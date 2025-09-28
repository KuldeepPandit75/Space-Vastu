'use client';

import { useHabitat } from '@/contexts/HabitatContext';
import type { HabitatShape } from '@/types/habitat';

export default function HabitatShapeSelector() {
  const { habitatConfig, setHabitatConfig } = useHabitat();

  const shapes = [
    {
      id: 'cylinder',
      name: 'Cylindrical',
      description: 'Traditional space station design with good structural efficiency',
      icon: '🛢️',
      pros: ['Structural efficiency', 'Easy to manufacture', 'Good for rotation'],
      cons: ['Limited floor space', 'Curved walls']
    },
    {
      id: 'sphere',
      name: 'Spherical',
      description: 'Maximum volume-to-surface ratio, optimal for pressure vessels',
      icon: '⚪',
      pros: ['Maximum volume efficiency', 'Equal pressure distribution', 'No corners'],
      cons: ['Difficult to partition', 'Manufacturing complexity']
    },
    {
      id: 'torus',
      name: 'Toroidal',
      description: 'Ring-shaped habitat ideal for artificial gravity via rotation',
      icon: '🍩',
      pros: ['Artificial gravity', 'Large living area', 'Central hub access'],
      cons: ['Complex structure', 'High mass', 'Coriolis effects']
    },
    {
      id: 'inflatable',
      name: 'Inflatable',
      description: 'Expandable habitat that deploys after launch',
      icon: '🎈',
      pros: ['Compact launch', 'Large deployed volume', 'Lightweight'],
      cons: ['Puncture risk', 'Limited rigidity', 'Deployment complexity']
    },
    {
      id: 'modular',
      name: 'Modular',
      description: 'Connected modules allowing flexible configuration',
      icon: '🔗',
      pros: ['Scalable', 'Redundancy', 'Specialized modules'],
      cons: ['Connection complexity', 'More interfaces', 'Higher mass']
    }
  ];

  const updateHabitatShape = (shape: HabitatShape) => {
    let newConfig = { ...habitatConfig, shape };
    
    // Calculate volume based on shape
    const { radius, height = 10 } = habitatConfig;
    
    switch (shape) {
      case 'cylinder':
        newConfig.volume = Math.PI * radius * radius * height;
        break;
      case 'sphere':
        newConfig.volume = (4/3) * Math.PI * radius * radius * radius;
        newConfig.height = undefined; // Spheres don't have height
        break;
      case 'torus':
        const minorRadius = radius * 0.3; // Inner tube radius
        newConfig.volume = 2 * Math.PI * Math.PI * radius * minorRadius * minorRadius;
        break;
      case 'inflatable':
        // Similar to cylinder but with expansion factor
        newConfig.volume = Math.PI * radius * radius * height * 1.5;
        break;
      case 'modular':
        // Base module volume
        newConfig.volume = Math.PI * radius * radius * height;
        break;
    }
    
    setHabitatConfig(newConfig);
  };

  const updateDimension = (key: 'radius' | 'height', value: number) => {
    const newConfig = { ...habitatConfig, [key]: value };
    
    // Recalculate volume
    const { radius, height = 10, shape } = newConfig;
    
    switch (shape) {
      case 'cylinder':
        newConfig.volume = Math.PI * radius * radius * height;
        break;
      case 'sphere':
        newConfig.volume = (4/3) * Math.PI * radius * radius * radius;
        break;
      case 'torus':
        const minorRadius = radius * 0.3;
        newConfig.volume = 2 * Math.PI * Math.PI * radius * minorRadius * minorRadius;
        break;
      case 'inflatable':
        newConfig.volume = Math.PI * radius * radius * height * 1.5;
        break;
      case 'modular':
        newConfig.volume = Math.PI * radius * radius * height;
        break;
    }
    
    setHabitatConfig(newConfig);
  };

  const checkConstraints = () => {
    const { mission } = habitatConfig;
    const constraints = mission.payloadConstraints;
    const diameter = habitatConfig.radius * 2;
    const height = habitatConfig.height || habitatConfig.radius * 2;
    
    const diameterOk = diameter <= constraints.maxDiameter;
    const heightOk = height <= constraints.maxLength;
    
    return { diameterOk, heightOk };
  };

  const { diameterOk, heightOk } = checkConstraints();

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-600 p-6">
      <div className="flex items-center mb-6">
        <span className="text-lg mr-3">🏗️</span>
        <h3 className="text-white font-semibold">Habitat Configuration</h3>
      </div>
      
      {/* Shape Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Habitat Shape
        </label>
        <div className="grid grid-cols-1 gap-3">
          {shapes.map(shape => (
            <button
              key={shape.id}
              onClick={() => updateHabitatShape(shape.id as HabitatShape)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                habitatConfig.shape === shape.id
                  ? 'bg-white text-black border-white'
                  : 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{shape.icon}</span>
                <span className="font-medium text-lg">{shape.name}</span>
              </div>
              <p className="text-sm opacity-80 mb-3 leading-relaxed">{shape.description}</p>
              <div className="text-xs space-y-1">
                <div className="flex items-start">
                  <span className="text-white mr-1">✓</span>
                  <span className={habitatConfig.shape === shape.id ? 'text-gray-700' : 'text-white'}>{shape.pros.join(', ')}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-400 mr-1">✗</span>
                  <span className={habitatConfig.shape === shape.id ? 'text-gray-600' : 'text-gray-400'}>{shape.cons.join(', ')}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Radius (m)
          </label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="20"
            value={habitatConfig.radius}
            onChange={(e) => updateDimension('radius', parseFloat(e.target.value))}
            className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border transition-all outline-none ${
              diameterOk 
                ? 'border-gray-500 focus:border-white focus:ring-2 focus:ring-white/20' 
                : 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
            }`}
          />
          {!diameterOk && (
            <p className="text-red-400 text-xs mt-2 flex items-center">
              <span className="mr-1">⚠</span>
              Diameter exceeds launch vehicle limit
            </p>
          )}
        </div>
        
        {habitatConfig.shape !== 'sphere' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Height (m)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="30"
              value={habitatConfig.height || 10}
              onChange={(e) => updateDimension('height', parseFloat(e.target.value))}
              className={`w-full px-3 py-2 bg-gray-700 text-white rounded-lg border transition-all outline-none ${
                heightOk 
                  ? 'border-gray-500 focus:border-white focus:ring-2 focus:ring-white/20' 
                  : 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
              }`}
            />
            {!heightOk && (
              <p className="text-red-400 text-xs mt-2 flex items-center">
                <span className="mr-1">⚠</span>
                Height exceeds launch vehicle limit
              </p>
            )}
          </div>
        )}
      </div>

      {/* Multi-level option */}
      {(habitatConfig.shape === 'cylinder' || habitatConfig.shape === 'modular') && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Levels
          </label>
          <select
            value={habitatConfig.levels || 1}
            onChange={(e) => setHabitatConfig({
              ...habitatConfig,
              levels: parseInt(e.target.value)
            })}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all outline-none"
          >
            <option value={1} className="bg-gray-800">Single Level</option>
            <option value={2} className="bg-gray-800">Two Levels</option>
            <option value={3} className="bg-gray-800">Three Levels</option>
          </select>
        </div>
      )}

      {/* Volume Display */}
      <div className="bg-gray-700 rounded-xl p-4 border border-gray-500">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 flex items-center">
            <span className="mr-2">📊</span>
            Total Volume:
          </span>
          <span className="text-white font-mono text-lg font-semibold">
            {habitatConfig.volume.toFixed(1)} m³
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Volume per Crew:</span>
          <span className="text-white font-mono font-medium">
            {(habitatConfig.volume / habitatConfig.mission.crewSize).toFixed(1)} m³
          </span>
        </div>
      </div>
    </div>
  );
}