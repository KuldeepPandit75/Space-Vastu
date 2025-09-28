'use client';

import { useEffect, useState } from 'react';
import { useHabitat } from '@/contexts/HabitatContext';
import { nasaVolumeGuidelines, spaceModuleData } from '@/data/spaceModuleData';
import type { ModuleType } from '@/types/module';
import ImportModal from './ImportModal';

export default function StatsPanel() {
  const { stats, calculateStats, modules, selectedModuleId, habitatConfig, setModalOpen, setSelectedModuleType, removeModule, setSelectedModuleId, exportDesign } = useHabitat();
  const [activeTab, setActiveTab] = useState<'stats' | 'compliance' | 'zones'>('stats');
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    calculateStats();
  }, [modules, habitatConfig.volume, calculateStats]);

  const selectedModule = modules.find(module => module.id === selectedModuleId);

  const handleLearnMore = () => {
    if (selectedModule) {
      setSelectedModuleType(selectedModule.type);
      setModalOpen(true);
    }
  };

  const handleDeleteModule = () => {
    if (selectedModuleId) {
      removeModule(selectedModuleId);
      setSelectedModuleId(null);
    }
  };

  // Calculate NASA compliance
  const calculateCompliance = () => {
    const crewSize = habitatConfig.mission.crewSize;
    const modulesByType = modules.reduce((acc, module) => {
      acc[module.type] = (acc[module.type] || 0) + module.volume;
      return acc;
    }, {} as Record<ModuleType, number>);

    const compliance: Array<{
      type: string;
      required: number;
      actual: number;
      status: 'good' | 'warning' | 'critical';
      message: string;
    }> = [];

    Object.entries(nasaVolumeGuidelines).forEach(([type, guidelines]) => {
      if (type === 'totalHabitable') {
        const totalHabitable = stats.totalVolume;
        const required = guidelines.min * crewSize;
        const recommended = guidelines.recommended * crewSize;
        
        compliance.push({
          type: 'Total Habitable',
          required,
          actual: totalHabitable,
          status: totalHabitable >= recommended ? 'good' : totalHabitable >= required ? 'warning' : 'critical',
          message: totalHabitable >= recommended ? 'Exceeds recommended' : 
                  totalHabitable >= required ? 'Meets minimum' : 'Below minimum'
        });
      } else {
        const actualVolume = modulesByType[type as ModuleType] || 0;
        const required = guidelines.min * crewSize;
        const recommended = guidelines.recommended * crewSize;
        
        if (actualVolume > 0 || required > 0) {
          compliance.push({
            type: type.charAt(0).toUpperCase() + type.slice(1),
            required,
            actual: actualVolume,
            status: actualVolume >= recommended ? 'good' : actualVolume >= required ? 'warning' : 'critical',
            message: actualVolume >= recommended ? 'Exceeds recommended' : 
                    actualVolume >= required ? 'Meets minimum' : 
                    actualVolume === 0 ? 'Missing' : 'Below minimum'
          });
        }
      }
    });

    return compliance;
  };

  // Calculate zone distribution
  const calculateZones = () => {
    const zoneVolumes = modules.reduce((acc, module) => {
      const moduleData = spaceModuleData.find(m => m.type === module.type);
      const zone = moduleData?.zone || 'technical';
      acc[zone] = (acc[zone] || 0) + module.volume;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(zoneVolumes).map(([zone, volume]) => ({
      zone: zone.charAt(0).toUpperCase() + zone.slice(1),
      volume,
      percentage: (volume / stats.usedVolume) * 100
    }));
  };

  const compliance = calculateCompliance();
  const zones = calculateZones();



  return (
    <div className="mt-8 space-y-4">
      {/* Selected Module Info */}
      {selectedModule && (
        <div className="bg-blue-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Selected Module</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Type:</span>
              <span className="text-white font-semibold capitalize">
                {selectedModule.type.replace('-', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Size:</span>
              <span className="text-white font-semibold">
                {selectedModule.size[0]}×{selectedModule.size[1]}×{selectedModule.size[2]}m
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Volume:</span>
              <span className="text-white font-semibold">
                {selectedModule.volume} m³
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Position:</span>
              <span className="text-white font-semibold">
                ({selectedModule.position[0].toFixed(1)}, {selectedModule.position[1].toFixed(1)}, {selectedModule.position[2].toFixed(1)})
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            <button
              onClick={handleLearnMore}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Learn More About This Module
            </button>
            
            <button
              onClick={handleDeleteModule}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Delete Module
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex bg-gray-800 rounded-lg p-1">
        {[
          { id: 'stats', label: 'Usage' },
          { id: 'compliance', label: 'NASA Guidelines' },
          { id: 'zones', label: 'Zones' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && (
        <div className="bg-gray-700 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Total Volume:</span>
            <span className="text-white font-semibold">
              {stats.totalVolume.toFixed(1)} m³
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-300">Used Volume:</span>
            <span className="text-yellow-400 font-semibold">
              {stats.usedVolume.toFixed(1)} m³
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-300">Free Space:</span>
            <span className="text-green-400 font-semibold">
              {stats.freeVolume.toFixed(1)} m³
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Volume per Crew:</span>
            <span className="text-white font-semibold">
              {(stats.crewVolumePerPerson || 0).toFixed(1)} m³
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Total Modules:</span>
            <span className="text-white font-semibold">
              {modules.length}
            </span>
          </div>
          
          <div className="pt-2 border-t border-gray-600">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Usage:</span>
              <span className="text-white font-semibold">
                {stats.usagePercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(stats.usagePercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-3">NASA Volume Guidelines</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {compliance.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-600 rounded">
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{item.type}</div>
                  <div className="text-xs text-gray-300">
                    {item.actual.toFixed(1)} / {item.required.toFixed(1)} m³
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-300">{item.message}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'good' ? 'bg-green-500' :
                    item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'zones' && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-3">Zone Distribution</h4>
          <div className="space-y-2">
            {zones.map((zone, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-300">{zone.zone}:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-semibold">
                    {zone.volume.toFixed(1)} m³
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({zone.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <button 
          onClick={exportDesign}
          className="w-full bg-white text-black hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          💾 Export Layout
        </button>
        <button 
          onClick={() => setShowImportModal(true)}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          📁 Import Layout
        </button>
        <button 
          onClick={() => {
            // Copy design data to clipboard for sharing
            const designData = {
              habitatConfig,
              modules,
              stats,
              shareUrl: window.location.href
            };
            navigator.clipboard.writeText(JSON.stringify(designData, null, 2));
            alert('Design data copied to clipboard! Share this with others.');
          }}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          🔗 Share Design
        </button>
      </div>

      {/* Import Modal */}
      <ImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
      />
    </div>
  );
}
