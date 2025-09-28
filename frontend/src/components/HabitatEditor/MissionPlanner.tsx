'use client';

import { useState } from 'react';
import { useHabitat } from '@/contexts/HabitatContext';
import { launchVehicleConstraints } from '@/data/spaceModuleData';
import type { Destination, LaunchVehicle } from '@/types/habitat';

export default function MissionPlanner() {
  const { habitatConfig, setHabitatConfig } = useHabitat();
  const [isOpen, setIsOpen] = useState(false);

  const destinations = [
    { id: 'moon', name: 'Lunar Surface', description: 'Moon base operations' },
    { id: 'mars', name: 'Mars Surface', description: 'Mars exploration base' },
    { id: 'transit', name: 'Deep Space Transit', description: 'Journey to Mars' },
    { id: 'orbit', name: 'Earth/Moon Orbit', description: 'Orbital station' }
  ];

  const updateMissionParam = (key: string, value: any) => {
    setHabitatConfig({
      ...habitatConfig,
      mission: {
        ...habitatConfig.mission,
        [key]: value
      }
    });
  };

  const updatePayloadConstraint = (key: string, value: number) => {
    setHabitatConfig({
      ...habitatConfig,
      mission: {
        ...habitatConfig.mission,
        payloadConstraints: {
          ...habitatConfig.mission.payloadConstraints,
          [key]: value
        }
      }
    });
  };

  const selectLaunchVehicle = (vehicleId: LaunchVehicle) => {
    const constraints = launchVehicleConstraints[vehicleId];
    setHabitatConfig({
      ...habitatConfig,
      mission: {
        ...habitatConfig.mission,
        launchVehicle: vehicleId,
        payloadConstraints: {
          maxDiameter: constraints.maxDiameter,
          maxLength: constraints.maxLength,
          maxMass: constraints.maxMass
        }
      }
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-600 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-white font-medium hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">📋</span>
          <span>Mission Parameters</span>
        </div>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
          {/* Crew Size & Duration Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Crew Size
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={habitatConfig.mission.crewSize}
                onChange={(e) => updateMissionParam('crewSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duration (days)
              </label>
              <input
                type="number"
                min="30"
                max="1000"
                value={habitatConfig.mission.missionDuration}
                onChange={(e) => updateMissionParam('missionDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Destination
            </label>
            <select
              value={habitatConfig.mission.destination}
              onChange={(e) => updateMissionParam('destination', e.target.value as Destination)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all outline-none"
            >
              {destinations.map(dest => (
                <option key={dest.id} value={dest.id} className="bg-gray-800">
                  {dest.name} - {dest.description}
                </option>
              ))}
            </select>
          </div>

          {/* Launch Vehicle */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Launch Vehicle
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(launchVehicleConstraints).map(([id, vehicle]) => (
                <button
                  key={id}
                  onClick={() => selectLaunchVehicle(id as LaunchVehicle)}
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    habitatConfig.mission.launchVehicle === id
                      ? 'bg-white text-black border-white'
                      : 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">{vehicle.name}</div>
                  <div className="text-xs opacity-75 mt-1">
                    ⌀{vehicle.maxDiameter}m × {vehicle.maxLength}m
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payload Constraints */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-500">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <span className="mr-2">📏</span>
              Payload Constraints
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Diameter (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={habitatConfig.mission.payloadConstraints.maxDiameter}
                  onChange={(e) => updatePayloadConstraint('maxDiameter', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm border border-gray-400 focus:border-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Length (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={habitatConfig.mission.payloadConstraints.maxLength}
                  onChange={(e) => updatePayloadConstraint('maxLength', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm border border-gray-400 focus:border-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Mass (kg)</label>
                <input
                  type="number"
                  step="100"
                  value={habitatConfig.mission.payloadConstraints.maxMass}
                  onChange={(e) => updatePayloadConstraint('maxMass', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 bg-gray-600 text-white rounded text-sm border border-gray-400 focus:border-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}