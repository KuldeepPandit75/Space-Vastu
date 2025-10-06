'use client';

import { useState } from 'react';
import { useHabitat } from '@/contexts/HabitatContext';
import SampleDesigns from './SampleDesigns';

export default function Toolbar() {
  const { modules, habitatConfig, stats, setHabitatConfig, clearModules, exportDesign } = useHabitat();
  const [showPresets, setShowPresets] = useState(false);
  const [showSamples, setShowSamples] = useState(false);

  const presetConfigurations = [
    {
      name: "Lunar Base",
      description: "4-person lunar surface habitat",
      config: {
        shape: 'cylinder' as const,
        radius: 6,
        height: 12,
        mission: {
          crewSize: 4,
          missionDuration: 180,
          destination: 'moon' as const,
          launchVehicle: 'sls' as const,
          payloadConstraints: { maxDiameter: 8.4, maxLength: 19.1, maxMass: 95000 }
        }
      }
    },
    {
      name: "Mars Transit",
      description: "6-person deep space transport",
      config: {
        shape: 'torus' as const,
        radius: 8,
        height: 15,
        mission: {
          crewSize: 6,
          missionDuration: 270,
          destination: 'transit' as const,
          launchVehicle: 'starship' as const,
          payloadConstraints: { maxDiameter: 9.0, maxLength: 18.0, maxMass: 150000 }
        }
      }
    },
    {
      name: "Mars Surface Base",
      description: "8-person Mars exploration base",
      config: {
        shape: 'modular' as const,
        radius: 10,
        height: 8,
        levels: 2,
        mission: {
          crewSize: 8,
          missionDuration: 500,
          destination: 'mars' as const,
          launchVehicle: 'starship' as const,
          payloadConstraints: { maxDiameter: 9.0, maxLength: 18.0, maxMass: 150000 }
        }
      }
    }
  ];

  const loadPreset = (preset: typeof presetConfigurations[0]) => {
    const volume = calculateVolume(preset.config.shape, preset.config.radius, preset.config.height);
    setHabitatConfig({
      ...preset.config,
      volume
    });
    setShowPresets(false);
  };

  const calculateVolume = (shape: string, radius: number, height?: number) => {
    switch (shape) {
      case 'cylinder':
        return Math.PI * radius * radius * (height || 10);
      case 'sphere':
        return (4 / 3) * Math.PI * radius * radius * radius;
      case 'torus':
        const minorRadius = radius * 0.3;
        return 2 * Math.PI * Math.PI * radius * minorRadius * minorRadius;
      case 'inflatable':
        return Math.PI * radius * radius * (height || 10) * 1.5;
      case 'modular':
        return Math.PI * radius * radius * (height || 10);
      default:
        return 0;
    }
  };



  const clearDesign = () => {
    if (confirm('Are you sure you want to clear the current design? This cannot be undone.')) {
      // Reset to default configuration
      setHabitatConfig({
        shape: 'cylinder',
        radius: 5,
        height: 10,
        volume: Math.PI * 5 * 5 * 10,
        levels: 1,
        mission: {
          crewSize: 4,
          missionDuration: 180,
          destination: 'moon',
          launchVehicle: 'sls',
          payloadConstraints: {
            maxDiameter: 8.4,
            maxLength: 19.1,
            maxMass: 95000
          }
        }
      });
      // Clear all modules
      clearModules();
    }
  };

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-gray-900 rounded-2xl border border-gray-600 shadow-2xl">
        <div className="flex items-center divide-x divide-gray-600">
          {/* Preset Configurations */}
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="px-4 py-3 bg-white text-black hover:bg-gray-200 rounded-l-2xl text-sm font-medium transition-all flex items-center space-x-2"
            >
              <span>📋</span>
              <span>Presets</span>
            </button>

            {showPresets && (
              <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-xl shadow-2xl min-w-72 z-20 border border-gray-600">
                <div className="p-4">
                  <h4 className="text-white font-medium mb-4 flex items-center">
                    <span className="mr-2">⚡</span>
                    Quick Start Configurations
                  </h4>
                  <div className="space-y-2">
                    {presetConfigurations.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => loadPreset(preset)}
                        className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all border border-gray-500 hover:border-gray-400"
                      >
                        <div className="text-white font-medium">{preset.name}</div>
                        <div className="text-gray-400 text-sm mt-1">{preset.description}</div>
                        <div className="text-gray-500 text-xs mt-2 flex items-center space-x-4">
                          <span>👥 {preset.config.mission.crewSize} crew</span>
                          <span>📅 {preset.config.mission.missionDuration} days</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center">
            <button
              onClick={() => setShowSamples(true)}
              className="px-4 py-3 text-white hover:text-gray-300 hover:bg-gray-800 text-sm font-medium transition-all flex items-center space-x-2"
              title="Load sample designs"
            >
              <span>📁</span>
              <span>Samples</span>
            </button>

            <button
              onClick={exportDesign}
              className="px-4 py-3 text-white hover:text-gray-300 hover:bg-gray-800 text-sm font-medium transition-all flex items-center space-x-2"
              title="Export design as JSON"
            >
              <span>💾</span>
              <span>Export</span>
            </button>

            <button
              onClick={clearDesign}
              className="px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 text-sm font-medium transition-all flex items-center space-x-2"
              title="Clear current design"
            >
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>

          {/* Stats Summary */}
          <div className="px-4 py-3 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Modules:</span>
                <span className="text-white font-semibold">{modules.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">Usage:</span>
                <span className="text-white font-semibold">{stats.usagePercentage.toFixed(0)}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="text-gray-400 text-xs">Overlap Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Designs Modal */}
      <SampleDesigns
        isOpen={showSamples}
        onClose={() => setShowSamples(false)}
      />
    </div>
  );
}