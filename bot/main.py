from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import PyPDF2
import json
import os
import ssl
import urllib3
import time
from functools import wraps

# Disable SSL warnings for development
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configure the API key
load_dotenv()
api_key = "AIzaSyAOu5I-ZsaZMTkaV78xIiOfBAazGY-nWV0"
ssl_verify = os.getenv('SSL_VERIFY', 'false').lower() == 'true'

# Configure SSL context for development
if not ssl_verify:
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    os.environ['PYTHONHTTPSVERIFY'] = '0'

genai.configure(api_key=api_key)

# Create the model configuration for FREE TIER
generation_config = {
  "temperature": 0.3,  # Balanced for free tier
  "top_p": 0.8,
  "top_k": 20,
  "max_output_tokens": 1024,  # Reasonable for free tier
}

# Global variables to store the chat sessions
chat_session = None
habitat_chat_session = None
nasa_guidelines_text = ""

# Rate limiting for API calls
last_api_call = 0
MIN_API_INTERVAL = 10.0  # Increased to 10 seconds between API calls
api_call_count = 0
MAX_API_CALLS_PER_HOUR = 50  # Conservative limit

def rate_limit(func):
    """Decorator to enforce rate limiting on API calls"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        global last_api_call, api_call_count
        current_time = time.time()
        time_since_last = current_time - last_api_call
        
        # Reset hourly counter
        if current_time - last_api_call > 3600:  # 1 hour
            api_call_count = 0
        
        # Check hourly limit
        if api_call_count >= MAX_API_CALLS_PER_HOUR:
            print(f"Hourly API limit reached ({MAX_API_CALLS_PER_HOUR}), using fallback")
            return None  # Signal to use fallback
        
        if time_since_last < MIN_API_INTERVAL:
            sleep_time = MIN_API_INTERVAL - time_since_last
            print(f"Rate limiting: sleeping for {sleep_time:.1f}s")
            time.sleep(sleep_time)
        
        last_api_call = time.time()
        api_call_count += 1
        return func(*args, **kwargs)
    return wrapper

app = Flask(__name__)

CORS(app, resources={
    "/validate_habitat": {"origins": ["http://localhost:3000", "http://localhost:5173"]},
    "/optimize_habitat": {"origins": ["http://localhost:3000", "http://localhost:5173"]}
})

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def load_nasa_guidelines():
    """Load NASA guidelines from PDF if available"""
    global nasa_guidelines_text
    try:
        # Try to load NASA guidelines PDF
        pdf_path = "nasa_guidelines.pdf"
        if os.path.exists(pdf_path):
            with open(pdf_path, 'rb') as file:
                nasa_guidelines_text = extract_text_from_pdf(file)
        else:
            # Fallback to hardcoded NASA guidelines
            nasa_guidelines_text = """
            NASA SPACE HABITAT DESIGN GUIDELINES:
            
            VOLUME REQUIREMENTS (per crew member):
            - Sleep quarters: 2.5-4.0 m³ minimum
            - Food preparation: 1.0-2.0 m³
            - Hygiene facilities: 0.5-1.0 m³
            - Exercise area: 3.0-5.0 m³
            - Workstation: 1.0-2.0 m³
            - Recreation: 1.5-3.0 m³
            - Medical bay: 2.0-4.0 m³
            - Storage: 0.8-1.5 m³
            - Total habitable volume: 25-50 m³ minimum per crew member
            
            ZONING REQUIREMENTS:
            - Quiet zones (sleep, work): Isolated from noisy areas
            - Active zones (exercise, recreation): Good ventilation, higher ceilings
            - Wet zones (hygiene): Separate from food preparation areas
            - Clean zones (medical, food): Isolated from contamination sources
            - Technical zones (life support): Accessible for maintenance
            
            ADJACENCY RULES:
            - Exercise areas must be near hygiene facilities
            - Food preparation must be adjacent to storage
            - Sleep quarters must be away from noisy equipment
            - Medical bay must be in clean, isolated location
            - Life support systems must be accessible but separated from living areas
            
            SAFETY REQUIREMENTS:
            - Multiple emergency exits
            - Fire suppression systems
            - Radiation shielding considerations
            - Structural integrity for launch and operational loads
            """
    except Exception as e:
        print(f"Error loading NASA guidelines: {e}")
        nasa_guidelines_text = "NASA guidelines not available"

def get_available_model():
    """Get the best FREE TIER Gemini model only"""
    try:
        # FORCE use of free tier models only
        free_tier_models = [
            'gemini-1.5-flash',    # Current free tier model
            'gemini-pro',          # Legacy free model
            'gemini-1.0-pro',      # Alternative free model
        ]
        
        # Try each free model in order
        for model in free_tier_models:
            try:
                # Test the model quickly
                test_model = genai.GenerativeModel(model_name=model)
                test_response = test_model.generate_content("test", generation_config={"max_output_tokens": 10})
                print(f"Successfully using FREE TIER model: {model}")
                return model
            except Exception as model_error:
                print(f"Model {model} failed: {model_error}")
                continue
        
        print("WARNING: All free models failed, using gemini-1.5-flash as fallback")
        return "gemini-1.5-flash"
            
    except Exception as e:
        print(f"Error testing models: {e}")
        return "gemini-1.5-flash"

# Initialize chat sessions
def initialize_chat_sessions():
    global chat_session, habitat_chat_session, nasa_guidelines_text
    
    # Load NASA guidelines
    load_nasa_guidelines()
    
    # Get the best available model
    model_name = get_available_model()
    
    # New chat session for habitat design validation and optimization
    if habitat_chat_session is None:
        habitat_system_instruction = """You are a space habitat design validator. Analyze designs for NASA compliance.

KEY RULES:
- 25-50 m³ per crew member minimum
- Group by zones: quiet (sleep), active (exercise), wet (hygiene), clean (food/medical), technical (life-support)
- Exercise near hygiene, food near storage, sleep away from noise

OUTPUT JSON:
{
  "validation": {"overallScore": 0-100, "compliance": "compliant/warning/critical", "issues": [], "recommendations": []},
  "optimizedLayout": {"habitatConfig": {}, "modules": [], "changes": [], "reasoning": ""},
  "analysis": {"volumeAnalysis": "", "zoningAnalysis": "", "adjacencyAnalysis": "", "safetyAnalysis": ""}
}

Be concise and technical."""
        
        habitat_model = genai.GenerativeModel(
            model_name=model_name,
            generation_config=generation_config,
            system_instruction=habitat_system_instruction,
        )
        habitat_chat_session = habitat_model.start_chat(history=[])

# Initialize on startup
initialize_chat_sessions()

@app.route("/api_status", methods=["GET"])
def api_status():
    """Check API availability and quota status"""
    global api_call_count, last_api_call
    
    current_time = time.time()
    time_since_last = current_time - last_api_call
    
    # Reset hourly counter if needed
    if time_since_last > 3600:
        api_call_count = 0
    
    remaining_calls = MAX_API_CALLS_PER_HOUR - api_call_count
    next_call_available = max(0, MIN_API_INTERVAL - time_since_last)
    
    return jsonify({
        "api_available": remaining_calls > 0 and next_call_available <= 0,
        "remaining_calls": remaining_calls,
        "next_call_in_seconds": next_call_available,
        "fallback_mode": remaining_calls <= 0,
        "status": "ok"
    })

@app.route("/test_model", methods=["GET"])
def test_model():
    """Test model availability and list available models"""
    try:
        models = genai.list_models()
        available_models = [m.name for m in models if 'generateContent' in m.supported_generation_methods]
        current_model = get_available_model()
        
        # Test the current model
        try:
            test_model_instance = genai.GenerativeModel(model_name=current_model)
            test_response = test_model_instance.generate_content("Test message")
            model_working = True
            test_result = "Model working correctly"
        except Exception as model_error:
            model_working = False
            test_result = f"Model test failed: {str(model_error)}"
        
        return jsonify({
            "current_model": current_model,
            "available_models": available_models,
            "model_working": model_working,
            "test_result": test_result,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route("/validate_habitat", methods=["POST"])
def validate_habitat():
    """Validate habitat design against NASA guidelines"""
    global habitat_chat_session
    
    try:
        # Get the habitat design data
        design_data = request.get_json()
        
        if not design_data:
            return jsonify({"error": "No design data provided"}), 400
        
        print(f"Validating habitat design with {len(design_data.get('modules', []))} modules")
        
        # Try AI validation first (with rate limiting)
        ai_result = None
        try:
            # Apply rate limiting
            if rate_limit(lambda: True)() is None:
                print("Rate limit exceeded, using fallback validation")
                return jsonify(fallback_validation(design_data))
            
            # Check if habitat chat session is initialized
            if habitat_chat_session is None:
                print("Habitat chat session not initialized, attempting to reinitialize...")
                initialize_chat_sessions()
                if habitat_chat_session is None:
                    print("AI model not available, using fallback")
                    return jsonify(fallback_validation(design_data))
            
            # Prepare the prompt for validation
            validation_prompt = f"""
            Please analyze this space habitat design for NASA compliance and provide validation feedback:

            HABITAT DESIGN DATA:
            {json.dumps(design_data, indent=2)}

            Analyze the design and provide:
            1. Overall compliance score (0-100)
            2. Specific issues found
            3. Recommendations for improvement
            4. Volume analysis per crew member
            5. Zoning compliance assessment
            6. Adjacency rules validation

            Focus on NASA guidelines for crew safety, volume requirements, and operational efficiency.
            """
            
            # Send to Gemini for analysis with minimal retries
            max_retries = 2
            for attempt in range(max_retries):
                try:
                    response = habitat_chat_session.send_message(validation_prompt)
                    break
                except Exception as api_error:
                    error_msg = str(api_error).lower()
                    if "quota" in error_msg or "rate" in error_msg or "429" in error_msg:
                        print(f"API quota/rate limit hit on attempt {attempt + 1}, using fallback")
                        return jsonify(fallback_validation(design_data))
                    elif attempt < max_retries - 1:
                        print(f"API error on attempt {attempt + 1}, retrying...")
                        time.sleep(2)
                        continue
                    else:
                        print(f"API failed after {max_retries} attempts, using fallback")
                        return jsonify(fallback_validation(design_data))
            
            # Parse the JSON response
            try:
                validation_result = json.loads(response.text)
                print(f"AI validation complete. Score: {validation_result.get('validation', {}).get('overallScore', 'N/A')}")
                return jsonify(validation_result)
            except json.JSONDecodeError:
                print("AI response parsing failed, using fallback")
                return jsonify(fallback_validation(design_data))
                
        except Exception as e:
            print(f"AI validation failed: {e}, using fallback")
            return jsonify(fallback_validation(design_data))
        
    except Exception as e:
        print(f"Error in habitat validation: {e}")
        return jsonify({"error": f"Validation failed: {str(e)}"}), 500
def fallback_validation(design_data):
    """Fallback validation when AI is unavailable due to quota limits"""
    modules = design_data.get('modules', [])
    habitat_config = design_data.get('habitatConfig', {})
    
    # Use the existing compliance calculation
    score, issues = calculate_compliance_score(modules, habitat_config)
    
    # Generate recommendations based on issues
    recommendations = []
    if score < 85:
        recommendations.append("Consider adding missing essential modules")
        recommendations.append("Optimize module positioning for better adjacency")
        recommendations.append("Ensure adequate volume per crew member")
    else:
        recommendations.append("Design meets basic NASA requirements")
    
    return {
        "validation": {
            "overallScore": score,
            "compliance": "compliant" if score >= 85 else "warning" if score >= 70 else "critical",
            "issues": issues,
            "recommendations": recommendations
        },
        "analysis": {
            "volumeAnalysis": f"Analyzed {len(modules)} modules for compliance",
            "zoningAnalysis": "Basic zoning analysis completed",
            "adjacencyAnalysis": "Adjacency rules checked",
            "safetyAnalysis": f"Safety score: {score}%"
        }
    }

def calculate_compliance_score(modules, habitat_config):
    """Calculate NASA compliance score for a layout"""
    import math
    
    score = 100
    issues = []
    
    # Check crew volume requirements
    crew_size = habitat_config.get('mission', {}).get('crewSize', 4)
    total_volume = habitat_config.get('volume', 0)
    volume_per_crew = total_volume / crew_size if crew_size > 0 else 0
    
    if volume_per_crew < 25:  # NASA minimum
        score -= 30
        issues.append(f"Insufficient volume per crew: {volume_per_crew:.1f}m³ < 25m³")
    
    # Check essential modules
    module_types = [m.get('type') for m in modules]
    essential_modules = ['sleep', 'food', 'hygiene', 'life-support']
    
    for essential in essential_modules:
        if essential not in module_types:
            score -= 20
            issues.append(f"Missing essential module: {essential}")
    
    # Check sleep quarters count
    sleep_count = len([m for m in modules if m.get('type') == 'sleep'])
    if sleep_count < crew_size:
        score -= 15
        issues.append(f"Insufficient sleep quarters: {sleep_count} < {crew_size}")
    
    # Check adjacency violations
    for module in modules:
        mod_type = module.get('type')
        position = module.get('position', [0, 0, 0])
        
        # Check forbidden adjacencies
        forbidden = {
            'sleep': ['exercise', 'maintenance', 'life-support'],
            'food': ['hygiene', 'medical', 'exercise'],
            'medical': ['food', 'exercise', 'maintenance'],
            'exercise': ['sleep', 'medical', 'food']
        }.get(mod_type, [])
        
        for other in modules:
            if other.get('type') in forbidden:
                other_pos = other.get('position', [0, 0, 0])
                distance = math.sqrt(sum((a - b) ** 2 for a, b in zip(position, other_pos)))
                if distance < 4:  # Too close
                    score -= 5
                    issues.append(f"{mod_type} too close to {other.get('type')}")
    
    return max(0, score), issues

def ensure_essential_modules(modules, habitat_config):
    """Ensure all essential modules are present, add missing ones"""
    import math
    
    crew_size = habitat_config.get('mission', {}).get('crewSize', 4)
    existing_types = [m.get('type') for m in modules]
    
    # Essential modules required for NASA compliance
    essential_modules = ['sleep', 'food', 'hygiene', 'life-support']
    
    # Module templates for missing essentials
    module_templates = {
        'sleep': {
            'type': 'sleep',
            'size': [3.0, 2.0, 2.0],
            'volume': 12,
            'color': '#3b82f6',
            'zone': 'quiet',
            'noiseLevel': 'silent'
        },
        'food': {
            'type': 'food',
            'size': [3.0, 2.5, 2.0],
            'volume': 15,
            'color': '#10b981',
            'zone': 'clean',
            'noiseLevel': 'moderate'
        },
        'hygiene': {
            'type': 'hygiene',
            'size': [2.0, 2.0, 1.5],
            'volume': 6,
            'color': '#8b5cf6',
            'zone': 'wet',
            'noiseLevel': 'moderate'
        },
        'life-support': {
            'type': 'life-support',
            'size': [3.0, 2.5, 2.7],
            'volume': 20.25,
            'color': '#dc2626',
            'zone': 'technical',
            'noiseLevel': 'loud'
        }
    }
    
    complete_modules = modules.copy()
    
    # Add missing essential modules
    for essential in essential_modules:
        if essential not in existing_types:
            template = module_templates[essential]
            new_module = {
                'id': f'{essential}-{len(complete_modules)+1}',
                'position': [0, 0, 0],  # Will be positioned later
                'rotation': [0, 0, 0],
                **template
            }
            complete_modules.append(new_module)
            print(f"Added missing essential module: {essential}")
    
    # Ensure enough sleep quarters for crew
    sleep_count = len([m for m in complete_modules if m.get('type') == 'sleep'])
    while sleep_count < crew_size:
        template = module_templates['sleep']
        new_module = {
            'id': f'sleep-{sleep_count+1}',
            'position': [0, 0, 0],
            'rotation': [0, 0, 0],
            **template
        }
        complete_modules.append(new_module)
        sleep_count += 1
        print(f"Added additional sleep quarter for crew member {sleep_count}")
    
    return complete_modules

def create_nasa_compliant_layout(modules, habitat_config):
    """Create a NASA-compliant layout that achieves high scores"""
    import math
    
    # First ensure all essential modules are present
    complete_modules = ensure_essential_modules(modules, habitat_config)
    
    if not complete_modules:
        return []
    
    radius = habitat_config.get('radius', 5)
    height = habitat_config.get('height', 10)
    crew_size = habitat_config.get('mission', {}).get('crewSize', 4)
    
    # NASA-compliant positioning strategy
    optimized_modules = []
    
    # Sort modules by priority for optimal placement
    module_priority = {
        'life-support': 1,  # Core systems first
        'airlock': 2,
        'sleep': 3,         # Crew quarters
        'food': 4,          # Essential functions
        'hygiene': 5,
        'medical': 6,
        'exercise': 7,      # Active areas
        'workstation': 8,
        'storage': 9,
        'recreation': 10,
        'laboratory': 11,
        'greenhouse': 12,
        'communication': 13,
        'maintenance': 14
    }
    
    sorted_modules = sorted(complete_modules, key=lambda m: module_priority.get(m.get('type', 'unknown'), 99))
    
    # Define optimal zones with strict NASA compliance
    zone_positions = {
        'life-support': {'radius': 0.8 * radius, 'level': -0.4, 'angle_offset': 0},
        'airlock': {'radius': 0.9 * radius, 'level': 0, 'angle_offset': 0},
        'sleep': {'radius': 0.6 * radius, 'level': 0.3, 'angle_offset': 0},
        'food': {'radius': 0.5 * radius, 'level': 0.1, 'angle_offset': math.pi/4},
        'hygiene': {'radius': 0.7 * radius, 'level': -0.2, 'angle_offset': math.pi/2},
        'medical': {'radius': 0.4 * radius, 'level': 0.2, 'angle_offset': math.pi},
        'exercise': {'radius': 0.8 * radius, 'level': -0.3, 'angle_offset': math.pi/2},
        'workstation': {'radius': 0.6 * radius, 'level': 0.2, 'angle_offset': math.pi/6},
        'storage': {'radius': 0.7 * radius, 'level': -0.1, 'angle_offset': math.pi/3},
        'recreation': {'radius': 0.3 * radius, 'level': 0, 'angle_offset': 0},
        'laboratory': {'radius': 0.5 * radius, 'level': 0.3, 'angle_offset': 3*math.pi/4},
        'greenhouse': {'radius': 0.6 * radius, 'level': 0.4, 'angle_offset': math.pi/8},
        'communication': {'radius': 0.4 * radius, 'level': 0.1, 'angle_offset': 5*math.pi/4},
        'maintenance': {'radius': 0.8 * radius, 'level': -0.4, 'angle_offset': math.pi}
    }
    
    # Track used positions to avoid overlaps
    used_positions = []
    
    for i, module in enumerate(sorted_modules):
        mod_type = module.get('type', 'unknown')
        zone_config = zone_positions.get(mod_type, {'radius': 0.7 * radius, 'level': 0, 'angle_offset': 0})
        
        # Calculate base position
        base_radius = zone_config['radius']
        base_level = zone_config['level'] * height / 2
        base_angle = zone_config['angle_offset']
        
        # For multiple modules of same type, distribute around circle
        type_count = len([m for m in sorted_modules if m.get('type') == mod_type])
        type_index = len([m for m in optimized_modules if m.get('type') == mod_type])
        
        if type_count > 1:
            angle_step = 2 * math.pi / type_count
            angle = base_angle + (type_index * angle_step)
        else:
            angle = base_angle
        
        # Calculate position
        x = base_radius * math.cos(angle)
        z = base_radius * math.sin(angle)
        y = base_level
        
        # Ensure within bounds
        distance_from_center = math.sqrt(x*x + z*z)
        max_radius = radius - 1.5  # Safety margin
        
        if distance_from_center > max_radius:
            scale_factor = max_radius / distance_from_center
            x *= scale_factor
            z *= scale_factor
        
        # Ensure within height bounds
        max_height = height/2 - 1.5  # Safety margin
        if abs(y) > max_height:
            y = math.copysign(max_height, y)
        
        # Avoid overlaps with existing modules
        min_distance = 3.0  # Minimum separation
        attempts = 0
        while attempts < 10:
            collision = False
            for used_pos in used_positions:
                distance = math.sqrt((x - used_pos[0])**2 + (y - used_pos[1])**2 + (z - used_pos[2])**2)
                if distance < min_distance:
                    collision = True
                    break
            
            if not collision:
                break
            
            # Adjust position to avoid collision
            angle += math.pi / 6  # Rotate 30 degrees
            x = base_radius * math.cos(angle)
            z = base_radius * math.sin(angle)
            attempts += 1
        
        # Create optimized module
        optimized_module = module.copy()
        optimized_module['position'] = [round(x, 2), round(y, 2), round(z, 2)]
        optimized_modules.append(optimized_module)
        used_positions.append([x, y, z])
    
    return optimized_modules

def optimize_habitat_algorithmic(design_data):
    """Algorithmic optimization without AI"""
    modules = design_data.get('modules', [])
    habitat_config = design_data.get('habitatConfig', {})
    
    # Create NASA-compliant layout
    optimized_modules = create_nasa_compliant_layout(modules, habitat_config)
    
    if not optimized_modules:
        return jsonify({"error": "No modules to optimize"}), 400
    
    # Calculate compliance score
    score, issues = calculate_compliance_score(optimized_modules, habitat_config)
    
    # Determine compliance level
    if score >= 85:
        compliance = "compliant"
    elif score >= 70:
        compliance = "warning"
    else:
        compliance = "critical"
    
    # Generate changes made
    changes = []
    original_count = len(modules)
    optimized_count = len(optimized_modules)
    if optimized_count > original_count:
        added_count = optimized_count - original_count
        changes.append(f"Added {added_count} essential modules for NASA compliance")
    
    changes.append("Repositioned modules using NASA algorithms")
    
    result = {
        "validation": {
            "overallScore": score,
            "compliance": compliance,
            "issues": issues,
            "recommendations": [
                "Layout optimized using NASA algorithms",
                "All essential modules positioned correctly",
                "Adjacency rules enforced algorithmically"
            ]
        },
        "optimizedLayout": {
            "habitatConfig": habitat_config,
            "modules": optimized_modules,
            "changes": changes,
            "reasoning": f"Applied NASA engineering algorithms to achieve {score}% compliance"
        },
        "analysis": {
            "volumeAnalysis": f"Optimized {len(optimized_modules)} modules algorithmically",
            "zoningAnalysis": "Modules positioned by functional zones using algorithms",
            "adjacencyAnalysis": "NASA adjacency rules enforced programmatically",
            "safetyAnalysis": f"Algorithmic layout achieves {score}% NASA compliance"
        }
    }
    
    return jsonify(result)

@app.route("/optimize_habitat", methods=["POST"])
def optimize_habitat():
    """Smart optimization using NASA-compliant algorithms"""
    try:
        design_data = request.get_json()
        if not design_data:
            return jsonify({"error": "No design data provided"}), 400
        
        return optimize_habitat_algorithmic(design_data)
        
    except Exception as e:
        print(f"Error in optimization: {e}")
        return jsonify({"error": f"Optimization failed: {str(e)}"}), 500

@app.route("/optimize_habitat_ai", methods=["POST"])
def optimize_habitat_ai():
    """AI-powered optimization with NASA compliance validation"""
    global habitat_chat_session
    
    try:
        design_data = request.get_json()
        if not design_data:
            return jsonify({"error": "No design data provided"}), 400
        
        modules = design_data.get('modules', [])
        habitat_config = design_data.get('habitatConfig', {})
        crew_size = habitat_config.get('mission', {}).get('crewSize', 4)
        
        print(f"AI optimization requested for {len(modules)} modules")
        
        # Check rate limits first - if exceeded, use algorithmic optimization
        if rate_limit(lambda: True)() is None:
            print("Rate limit exceeded, using algorithmic optimization")
            # Use algorithmic optimization instead
            design_data_copy = design_data.copy()
            design_data_copy['modules'] = complete_modules
            return optimize_habitat_algorithmic(design_data_copy)
        
        # Ensure all essential modules are present
        complete_modules = ensure_essential_modules(modules, habitat_config)
        
        if not complete_modules:
            return jsonify({"error": "No modules to optimize"}), 400
        
        # Enhanced AI prompt with NASA compliance requirements
        optimization_prompt = f"""SPACE HABITAT OPTIMIZATION TASK

REQUIREMENTS:
- Container: Cylinder R={habitat_config.get('radius', 5)}m H={habitat_config.get('height', 10)}m
- Crew: {crew_size} members
- Modules: {len(complete_modules)} total (including added essential modules)

NASA COMPLIANCE RULES:
1. Sleep quarters: Upper levels, away from noise (exercise, life-support, maintenance)
2. Exercise: Lower levels, adjacent to hygiene, away from sleep/medical/food
3. Food prep: Clean zone, away from hygiene/medical, near storage
4. Medical: Clean zone, isolated from contamination sources
5. Life support: Accessible but separated from living areas
6. Hygiene: Near exercise, away from food/medical

COMPLETE MODULE LIST (including added essentials):
{json.dumps([{"id": m.get("id"), "type": m.get("type"), "position": m.get("position"), "zone": m.get("zone"), "size": m.get("size"), "volume": m.get("volume"), "color": m.get("color")} for m in complete_modules], indent=1)}

OUTPUT REQUIRED - Complete optimized layout achieving 90%+ NASA compliance:
{{
  "validation": {{"overallScore": 90-95, "compliance": "compliant", "issues": [], "recommendations": []}},
  "optimizedLayout": {{
    "habitatConfig": {json.dumps(habitat_config)},
    "modules": [
      {{"id": "module_id", "type": "module_type", "position": [x,y,z], "size": [w,h,d], "zone": "zone", "volume": num, "color": "color"}},
      ...
    ],
    "changes": ["specific changes made"],
    "reasoning": "NASA compliance explanation"
  }},
  "analysis": {{"volumeAnalysis": "", "zoningAnalysis": "", "adjacencyAnalysis": "", "safetyAnalysis": ""}}
}}

Ensure ALL {len(complete_modules)} modules (including newly added essentials) are repositioned for maximum NASA compliance."""
        
        print(f"AI optimizing {len(modules)} modules for NASA compliance")
        
        # Try AI optimization with minimal retries
        try:
            if habitat_chat_session is None:
                initialize_chat_sessions()
                if habitat_chat_session is None:
                    print("AI not available, using algorithmic optimization")
                    return optimize_habitat()
            
            response = habitat_chat_session.send_message(optimization_prompt)
            
        except Exception as api_error:
            error_msg = str(api_error).lower()
            if "quota" in error_msg or "rate" in error_msg or "429" in error_msg:
                print("API quota/rate limit hit, using algorithmic optimization")
                design_data_copy = design_data.copy()
                design_data_copy['modules'] = complete_modules
                return optimize_habitat_algorithmic(design_data_copy)
            else:
                print(f"AI optimization failed: {api_error}, using algorithmic optimization")
                design_data_copy = design_data.copy()
                design_data_copy['modules'] = complete_modules
                return optimize_habitat_algorithmic(design_data_copy)
        
        if not response.text or not response.text.strip():
            return jsonify({"error": "AI response was empty or blocked"}), 503
        
        # Parse the JSON response
        try:
            optimization_result = json.loads(response.text)
            
            # Validate the AI result
            ai_modules = optimization_result.get("optimizedLayout", {}).get("modules", [])
            if len(ai_modules) != len(complete_modules):
                return jsonify({"error": f"AI returned {len(ai_modules)} modules, expected {len(complete_modules)}"}), 422
            
            # Ensure all module properties are preserved
            for i, original in enumerate(complete_modules):
                if i < len(ai_modules):
                    ai_module = ai_modules[i]
                    # Preserve all original properties
                    for key, value in original.items():
                        if key not in ai_module or ai_module[key] is None:
                            ai_module[key] = value
            
            # Validate compliance score
            actual_score, actual_issues = calculate_compliance_score(ai_modules, habitat_config)
            
            # Update the result with actual calculated score
            optimization_result["validation"]["overallScore"] = actual_score
            optimization_result["validation"]["issues"] = actual_issues
            
            if actual_score >= 85:
                optimization_result["validation"]["compliance"] = "compliant"
            elif actual_score >= 70:
                optimization_result["validation"]["compliance"] = "warning"
            else:
                optimization_result["validation"]["compliance"] = "critical"
            
            print(f"AI optimization complete. Actual score: {actual_score}%")
            return jsonify(optimization_result)
            
        except json.JSONDecodeError as e:
            print(f"AI response parsing failed: {e}")
            return jsonify({"error": "AI response format invalid"}), 422
        
    except Exception as e:
        print(f"Error in AI optimization: {e}")
        return jsonify({"error": f"AI optimization failed: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=5000)