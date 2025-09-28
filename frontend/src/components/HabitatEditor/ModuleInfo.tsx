'use client';

import { useHabitat } from '@/contexts/HabitatContext';
import { spaceModuleData } from '@/data/spaceModuleData';

export default function ModuleInfo() {
  const { modules, selectedModuleId } = useHabitat();
  
  const selectedModule = modules.find(m => m.id === selectedModuleId);
  const moduleData = selectedModule ? spaceModuleData.find(m => m.type === selectedModule.type) : null;

  if (!selectedModule || !moduleData) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <div className="text-center text-slate-400">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-sm">Select a module to view details</div>
        </div>
      </div>
    );
  }

  const actualVolume = selectedModule.size[0] * selectedModule.size[1] * selectedModule.size[2];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center mb-3">
        <div 
          className="w-4 h-4 rounded mr-3"
          style={{ backgroundColor: selectedModule.color }}
        />
        <h3 className="text-white font-semibold">{moduleData.name}</h3>
      </div>

      <div className="space-y-3">
        {/* Dimensions */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-slate-700/30 rounded p-2 text-center">
            <div className="text-slate-400 text-xs">Length</div>
            <div className="text-white font-mono">{selectedModule.size[0]}m</div>
          </div>
          <div className="bg-slate-700/30 rounded p-2 text-center">
            <div className="text-slate-400 text-xs">Width</div>
            <div className="text-white font-mono">{selectedModule.size[1]}m</div>
          </div>
          <div className="bg-slate-700/30 rounded p-2 text-center">
            <div className="text-slate-400 text-xs">Height</div>
            <div className="text-white font-mono">{selectedModule.size[2]}m</div>
          </div>
        </div>

        {/* Volume */}
        <div className="bg-slate-700/30 rounded p-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-sm">Volume:</span>
            <span className="text-white font-mono">{actualVolume.toFixed(1)} m³</span>
          </div>
        </div>

        {/* Position */}
        <div className="bg-slate-700/30 rounded p-3">
          <div className="text-slate-300 text-sm mb-2">Position:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-slate-400">X</div>
              <div className="text-white font-mono">{selectedModule.position[0].toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Y</div>
              <div className="text-white font-mono">{selectedModule.position[1].toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Z</div>
              <div className="text-white font-mono">{selectedModule.position[2].toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Zone and Properties */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Zone:</span>
            <span className="text-white capitalize">{moduleData.zone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Noise Level:</span>
            <span className="text-white capitalize">{moduleData.noiseLevel}</span>
          </div>
          {moduleData.minVolumePerCrew && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Min/Crew:</span>
              <span className="text-white">{moduleData.minVolumePerCrew} m³</span>
            </div>
          )}
        </div>

        {/* NASA Guidelines */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
          <div className="text-blue-400 text-xs font-medium mb-1">NASA Guidelines</div>
          <div className="text-slate-300 text-xs leading-relaxed">
            {moduleData.nasaGuidelines}
          </div>
        </div>
      </div>
    </div>
  );
}