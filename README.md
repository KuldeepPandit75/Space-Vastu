# Space Habitat Designer 🚀

An advanced visual tool for designing and validating space habitats for lunar, Mars, and deep space missions. Built with NASA guidelines and real space habitat requirements.

## Features

### 🏗️ **Habitat Configuration**
- **Multiple Shapes**: Cylindrical, spherical, toroidal, inflatable, and modular designs
- **Mission Planning**: Configure crew size, mission duration, destination, and launch vehicle constraints
- **Real Constraints**: Payload fairing limitations from Falcon Heavy, SLS, Starship, and custom vehicles
- **Multi-level Support**: Design habitats with multiple floors for optimal space utilization

### 🏠 **Comprehensive Module Library**
- **14 Module Types**: Sleep quarters, food prep, medical bay, exercise area, storage, hygiene, workstation, recreation, airlock, life support, communication, maintenance, laboratory, and greenhouse
- **NASA Guidelines**: Each module includes real NASA volume requirements and design specifications
- **Smart Categories**: Filter modules by essential, living, work, or technical categories
- **Search Functionality**: Quickly find modules by name or description

### 🎯 **Advanced Validation System**
- **NASA Compliance**: Real-time scoring based on official NASA habitat guidelines
- **Zoning Rules**: Automatic validation of module adjacency requirements (e.g., exercise near hygiene, sleep away from noisy areas)
- **Launch Constraints**: Verify habitat fits within selected launch vehicle payload limits
- **Crew Requirements**: Ensure adequate volume and facilities for specified crew size

### 🌌 **Interactive 3D Environment**
- **Real-time 3D Visualization**: Built with React Three Fiber for smooth 3D interaction
- **Drag & Drop**: Intuitive module placement with collision detection
- **Constraint Enforcement**: Modules automatically snap to valid positions within habitat bounds
- **Visual Feedback**: Color-coded validation indicators and real-time compliance scoring

### 📊 **Comprehensive Analytics**
- **Usage Statistics**: Track volume utilization, crew density, and space efficiency
- **Compliance Dashboard**: Monitor adherence to NASA guidelines with detailed breakdowns
- **Zone Analysis**: Visualize distribution across quiet, active, wet, clean, technical, and social zones
- **Export Capabilities**: Save designs as JSON for sharing and collaboration

### 🎮 **User Experience**
- **Quick Start Guide**: Interactive tutorial for new users
- **Preset Configurations**: Pre-built templates for lunar base, Mars transit, and Mars surface missions
- **Keyboard Shortcuts**: Delete key to remove modules, Escape to close modals
- **Responsive Design**: Works on desktop and tablet devices

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **3D Graphics**: React Three Fiber, Three.js
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Next.js with TypeScript support

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd space-habitat-designer
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Usage Guide

### 1. **Mission Planning**
- Set crew size (1-12 members)
- Choose mission duration (30-1000 days)
- Select destination (Moon, Mars, Transit, Orbit)
- Pick launch vehicle (affects size constraints)

### 2. **Habitat Design**
- Choose habitat shape based on mission requirements
- Adjust radius and height within launch vehicle limits
- Consider multi-level designs for larger crews

### 3. **Module Placement**
- Browse module library by category
- Click modules to add them to the 3D space
- Drag modules to reposition them
- Follow validation feedback for optimal placement

### 4. **Validation & Optimization**
- Monitor NASA compliance score (aim for 80%+)
- Address validation warnings in real-time
- Ensure proper zoning (quiet areas away from noisy ones)
- Verify adequate volume per crew member

### 5. **Export & Share**
- Export design as JSON file
- Share with community for feedback
- Load preset configurations for quick starts

## NASA Guidelines Implemented

### **Volume Requirements (per crew member)**
- **Sleep**: 2.5-4.0 m³ minimum
- **Food Preparation**: 1.0-2.0 m³
- **Hygiene**: 0.5-1.0 m³
- **Exercise**: 3.0-5.0 m³
- **Workstation**: 1.0-2.0 m³
- **Recreation**: 1.5-3.0 m³
- **Medical**: 2.0-4.0 m³
- **Storage**: 0.8-1.5 m³
- **Total Habitable**: 25-50 m³ minimum

### **Zoning Best Practices**
- **Quiet Zones**: Sleep and work areas isolated from noise
- **Active Zones**: Exercise and recreation with good ventilation
- **Wet Zones**: Hygiene facilities with proper waste management
- **Clean Zones**: Medical and food areas separated from contamination
- **Technical Zones**: Life support and maintenance accessible but isolated
- **Social Zones**: Recreation areas centrally located for crew interaction

### **Adjacency Rules**
- Exercise areas near hygiene facilities
- Food preparation near storage areas
- Sleep quarters away from noisy equipment
- Medical bay in clean, isolated location
- Life support systems accessible but separated from living areas

## Module Specifications

Each module includes detailed specifications:
- **Physical dimensions** and volume
- **Crew capacity** and volume requirements
- **Zone classification** and noise levels
- **Adjacency requirements** and restrictions
- **NASA guidelines** and design rationale

## Launch Vehicle Constraints

### **Falcon Heavy**
- Max Diameter: 5.2m
- Max Length: 13.1m
- Max Mass: 63,800 kg

### **Space Launch System (SLS)**
- Max Diameter: 8.4m
- Max Length: 19.1m
- Max Mass: 95,000 kg

### **SpaceX Starship**
- Max Diameter: 9.0m
- Max Length: 18.0m
- Max Mass: 150,000 kg

## Educational Value

This tool serves multiple educational purposes:

### **For Students**
- Learn about space habitat design challenges
- Understand NASA requirements and constraints
- Explore different mission scenarios
- Practice 3D design and spatial reasoning

### **For Educators**
- Demonstrate real-world engineering constraints
- Teach systems thinking and optimization
- Explore human factors in space exploration
- Connect STEM concepts to space missions

### **For Professionals**
- Rapid prototyping of habitat concepts
- Validation against NASA standards
- Collaboration and design sharing
- Mission planning and feasibility studies

## Future Enhancements

### **Planned Features**
- **Advanced Physics**: Artificial gravity simulation for rotating habitats
- **Environmental Systems**: Detailed life support and power calculations
- **Mission Scenarios**: Specific challenges for different destinations
- **Collaborative Design**: Real-time multi-user editing
- **VR/AR Support**: Immersive habitat walkthroughs
- **Advanced Analytics**: Detailed crew workflow analysis

### **Integration Possibilities**
- **NASA APIs**: Real mission data and constraints
- **CAD Export**: Integration with professional design tools
- **Simulation**: Crew behavior and system performance modeling
- **Community Features**: Design sharing and rating system

## Contributing

We welcome contributions! Areas where help is needed:

- **New Module Types**: Additional habitat components
- **Validation Rules**: More sophisticated NASA guideline checking
- **3D Improvements**: Better graphics and interactions
- **Educational Content**: Tutorials and learning materials
- **Accessibility**: Making the tool usable for all users

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **NASA**: For habitat design guidelines and research
- **Space Agencies**: ESA, JAXA, and others for habitat concepts
- **Research Community**: Academic papers on space habitat design
- **Open Source**: React Three Fiber, Next.js, and other amazing tools

---

**Ready to design the future of space exploration? Start building your space habitat today!** 🌌

For questions, suggestions, or contributions, please open an issue or submit a pull request.#   S p a c e V a s t u  
 