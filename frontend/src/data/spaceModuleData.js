export const spaceModuleData = [
  {
    id: 'sleep',
    name: 'Sleep Quarter',
    type: 'sleep',
    description: 'Private sleeping area for crew members with sound isolation',
    volume: 12,
    color: '#3b82f6',
    size: [3.0, 2.0, 2.0], // L×W×H = 12m³
    zone: 'quiet',
    minVolumePerCrew: 2.5,
    noiseLevel: 'silent',
    forbiddenAdjacencies: ['exercise', 'maintenance', 'life-support'],
    nasaGuidelines: 'Minimum 2.5m³ per crew member, isolated from noisy areas'
  },
  {
    id: 'food',
    name: 'Food Preparation',
    type: 'food',
    description: 'Kitchen and dining area with food storage',
    volume: 15,
    color: '#10b981',
    size: [3.0, 2.5, 2.0], // L×W×H = 15m³
    zone: 'clean',
    minVolumePerCrew: 1.5,
    noiseLevel: 'moderate',
    requiredAdjacencies: ['storage'],
    forbiddenAdjacencies: ['hygiene', 'medical', 'exercise'],
    nasaGuidelines: 'Separate from hygiene areas, adjacent to storage'
  },
  {
    id: 'medical',
    name: 'Medical Bay',
    type: 'medical',
    description: 'Medical equipment and treatment area',
    volume: 30,
    color: '#ef4444',
    size: [4.0, 3.0, 2.5], // L×W×H = 30m³
    zone: 'clean',
    minVolumePerCrew: 3,
    noiseLevel: 'quiet',
    forbiddenAdjacencies: ['food', 'exercise', 'maintenance'],
    nasaGuidelines: 'Clean environment, isolated from contamination sources'
  },
  {
    id: 'exercise',
    name: 'Exercise Area',
    type: 'exercise',
    description: 'Fitness equipment and workout space with ventilation',
    volume: 40.5,
    color: '#f97316',
    size: [5.0, 3.0, 2.7], // L×W×H = 40.5m³
    zone: 'active',
    minVolumePerCrew: 4,
    noiseLevel: 'loud',
    requiredAdjacencies: ['hygiene'],
    forbiddenAdjacencies: ['sleep', 'medical', 'food'],
    nasaGuidelines: 'High ceiling, good ventilation, near hygiene facilities'
  },
  {
    id: 'storage',
    name: 'Storage',
    type: 'storage',
    description: 'General storage compartment for supplies and equipment',
    volume: 8,
    color: '#6b7280',
    size: [2.5, 2.0, 1.6], // L×W×H = 8m³
    zone: 'technical',
    minVolumePerCrew: 1,
    noiseLevel: 'quiet',
    nasaGuidelines: 'Distributed throughout habitat, easily accessible'
  },
  {
    id: 'hygiene',
    name: 'Hygiene Station',
    type: 'hygiene',
    description: 'Personal hygiene and waste management facilities',
    volume: 6,
    color: '#8b5cf6',
    size: [2.0, 2.0, 1.5], // L×W×H = 6m³
    zone: 'wet',
    minVolumePerCrew: 0.8,
    noiseLevel: 'moderate',
    requiredAdjacencies: ['exercise'],
    forbiddenAdjacencies: ['food', 'medical'],
    nasaGuidelines: 'Private, well-ventilated, separate from food areas'
  },
  {
    id: 'workstation',
    name: 'Workstation',
    type: 'workstation',
    description: 'Individual work area with computer and communication',
    volume: 10,
    color: '#06b6d4',
    size: [2.5, 2.0, 2.0], // L×W×H = 10m³
    zone: 'quiet',
    minVolumePerCrew: 1.5,
    noiseLevel: 'quiet',
    nasaGuidelines: 'Ergonomic design, good lighting, minimal distractions'
  },
  {
    id: 'recreation',
    name: 'Recreation Area',
    type: 'recreation',
    description: 'Social space for relaxation and group activities',
    volume: 25.2,
    color: '#84cc16',
    size: [4.0, 3.0, 2.1], // L×W×H = 25.2m³
    zone: 'social',
    minVolumePerCrew: 2,
    noiseLevel: 'moderate',
    nasaGuidelines: 'Central location, flexible space for crew interaction'
  },
  {
    id: 'airlock',
    name: 'Airlock',
    type: 'airlock',
    description: 'Entry/exit chamber for EVA operations',
    volume: 12,
    color: '#f59e0b',
    size: [2.0, 2.0, 3.0], // L×W×H = 12m³
    zone: 'technical',
    noiseLevel: 'moderate',
    isFixed: true,
    nasaGuidelines: 'Located at habitat perimeter, suit storage adjacent'
  },
  {
    id: 'life-support',
    name: 'Life Support',
    type: 'life-support',
    description: 'Environmental control and life support systems',
    volume: 20.25,
    color: '#dc2626',
    size: [3.0, 2.5, 2.7], // L×W×H = 20.25m³
    zone: 'technical',
    noiseLevel: 'loud',
    forbiddenAdjacencies: ['sleep', 'medical'],
    isFixed: true,
    nasaGuidelines: 'Accessible for maintenance, isolated from living areas'
  },
  {
    id: 'communication',
    name: 'Communication Hub',
    type: 'communication',
    description: 'Communication equipment and mission control interface',
    volume: 8,
    color: '#7c3aed',
    size: [2.5, 2.0, 1.6], // L×W×H = 8m³
    zone: 'technical',
    noiseLevel: 'quiet',
    nasaGuidelines: 'Central location, redundant systems'
  },
  {
    id: 'maintenance',
    name: 'Maintenance Shop',
    type: 'maintenance',
    description: 'Tools and workspace for repairs and modifications',
    volume: 18.375,
    color: '#374151',
    size: [3.5, 2.5, 2.1], // L×W×H = 18.375m³
    zone: 'technical',
    noiseLevel: 'loud',
    forbiddenAdjacencies: ['sleep', 'medical', 'food'],
    nasaGuidelines: 'Well-ventilated, tool storage, waste containment'
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    type: 'laboratory',
    description: 'Scientific research and experimentation facility',
    volume: 22,
    color: '#059669',
    size: [4.0, 2.5, 2.2], // L×W×H = 22m³
    zone: 'clean',
    noiseLevel: 'quiet',
    forbiddenAdjacencies: ['exercise', 'maintenance'],
    nasaGuidelines: 'Controlled environment, minimal vibration'
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    type: 'greenhouse',
    description: 'Plant growth facility for food production and air recycling',
    volume: 34.5,
    color: '#16a34a',
    size: [5.0, 3.0, 2.3], // L×W×H = 34.5m³
    zone: 'clean',
    noiseLevel: 'quiet',
    requiredAdjacencies: ['life-support'],
    nasaGuidelines: 'Controlled lighting, water recycling, CO2 management'
  }
];

// Launch vehicle constraints
export const launchVehicleConstraints = {
  'falcon-heavy': {
    name: 'Falcon Heavy',
    maxDiameter: 5.2,
    maxLength: 13.1,
    maxMass: 63800,
    fairing: 'cylindrical'
  },
  'sls': {
    name: 'Space Launch System',
    maxDiameter: 8.4,
    maxLength: 19.1,
    maxMass: 95000,
    fairing: 'cylindrical'
  },
  'starship': {
    name: 'SpaceX Starship',
    maxDiameter: 9.0,
    maxLength: 18.0,
    maxMass: 150000,
    fairing: 'cylindrical'
  },
  'custom': {
    name: 'Custom Vehicle',
    maxDiameter: 10.0,
    maxLength: 20.0,
    maxMass: 100000,
    fairing: 'cylindrical'
  }
};

// NASA habitat volume guidelines (m³ per crew member)
export const nasaVolumeGuidelines = {
  sleep: { min: 2.5, recommended: 4.0 },
  food: { min: 1.0, recommended: 2.0 },
  hygiene: { min: 0.5, recommended: 1.0 },
  exercise: { min: 3.0, recommended: 5.0 },
  workstation: { min: 1.0, recommended: 2.0 },
  recreation: { min: 1.5, recommended: 3.0 },
  medical: { min: 2.0, recommended: 4.0 },
  storage: { min: 0.8, recommended: 1.5 },
  totalHabitable: { min: 25, recommended: 50 }
};