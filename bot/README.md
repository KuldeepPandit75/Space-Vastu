# Space Habitat AI Validation Bot

This bot provides AI-powered validation and optimization for space habitat designs using Google's Gemini AI and NASA guidelines.

## Features

- **Design Validation**: Analyze habitat layouts against NASA compliance standards
- **AI Optimization**: Get AI-generated improvements for better efficiency and safety
- **NASA Guidelines Integration**: Uses official NASA space habitat design requirements
- **Real-time Analysis**: Detailed feedback on volume, zoning, adjacency, and safety

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure API Key**
   - Create a `.env` file in the bot directory
   - Add your Google AI API key:
     ```
     GOOGLE_AI_API_KEY=your_api_key_here
     ```

3. **Add NASA Guidelines (Optional)**
   - Place `nasa_guidelines.pdf` in the bot directory
   - The bot will automatically extract and use the guidelines
   - If no PDF is provided, it uses built-in NASA standards

4. **Run the Bot**
   ```bash
   python main.py
   ```

## API Endpoints

### `/validate_habitat` (POST)
Validates a habitat design against NASA guidelines.

**Request Body:**
```json
{
  "habitatConfig": { ... },
  "modules": [ ... ],
  "stats": { ... }
}
```

**Response:**
```json
{
  "validation": {
    "overallScore": 85,
    "compliance": "compliant",
    "issues": ["list of issues"],
    "recommendations": ["list of recommendations"]
  },
  "analysis": {
    "volumeAnalysis": "...",
    "zoningAnalysis": "...",
    "adjacencyAnalysis": "...",
    "safetyAnalysis": "..."
  }
}
```

### `/optimize_habitat` (POST)
Optimizes a habitat design and returns improved layout.

**Request Body:** Same as validation

**Response:** Same as validation plus:
```json
{
  "optimizedLayout": {
    "habitatConfig": { ... },
    "modules": [ ... ],
    "changes": ["list of changes made"],
    "reasoning": "explanation of optimization decisions"
  }
}
```

## NASA Guidelines Implemented

- **Volume Requirements**: Minimum space per crew member for each function
- **Zoning Rules**: Proper separation of quiet, active, wet, clean, technical, and social areas
- **Adjacency Requirements**: Mandatory and forbidden module placements
- **Safety Standards**: Emergency access, structural integrity, radiation shielding
- **Operational Efficiency**: Crew workflow optimization and maintenance access

## Integration with Frontend

The bot integrates with the Space Habitat Designer frontend through CORS-enabled API calls. The frontend sends the current habitat design and receives AI-powered validation and optimization suggestions.

## Error Handling

- Graceful fallback if NASA PDF is not available
- JSON parsing error recovery
- Network timeout handling
- Detailed error logging for debugging