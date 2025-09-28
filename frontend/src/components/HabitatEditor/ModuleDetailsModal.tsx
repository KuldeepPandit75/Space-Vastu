'use client';

import { useState } from 'react';
import { spaceModuleData } from '@/data/spaceModuleData';

interface ModuleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleType: string | null;
}

export default function ModuleDetailsModal({ isOpen, onClose, moduleType }: ModuleDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!isOpen || !moduleType) return null;

  // Find module data from the new structure
  const moduleData = spaceModuleData.find(module => module.type === moduleType);

  if (!moduleData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Module Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-300">Module details not available for this type.</p>
        </div>
      </div>
    );
  }

  const getModuleIcon = (type: string) => {
    const icons: Record<string, string> = {
      sleep: '🛏️', food: '🍽️', medical: '🏥', exercise: '🏋️', storage: '📦',
      hygiene: '🚿', workstation: '💻', recreation: '🎮', airlock: '🚪',
      'life-support': '🌬️', communication: '📡', maintenance: '🔧',
      laboratory: '🔬', greenhouse: '🌱'
    };
    return icons[type] || '📦';
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'specifications', name: 'Specifications', icon: '📐' },
    { id: 'guidelines', name: 'NASA Guidelines', icon: '🚀' },
    { id: 'zoning', name: 'Zoning Rules', icon: '🗺️' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{getModuleIcon(moduleType)}</span>
            <h2 className="text-2xl font-bold text-white">{moduleData.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Description</h3>
                <p className="text-gray-300">{moduleData.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-white">{moduleData.volume}</div>
                  <div className="text-gray-400 text-sm">Volume (m³)</div>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-white">
                    {moduleData.size.join('×')}
                  </div>
                  <div className="text-gray-400 text-sm">Dimensions (m)</div>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-white capitalize">{moduleData.zone}</div>
                  <div className="text-gray-400 text-sm">Zone Type</div>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <div className="text-2xl font-bold text-white capitalize">{moduleData.noiseLevel}</div>
                  <div className="text-gray-400 text-sm">Noise Level</div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'specifications' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Physical Properties</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Length:</span>
                      <span className="text-white">{moduleData.size[0]} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Width:</span>
                      <span className="text-white">{moduleData.size[1]} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Height:</span>
                      <span className="text-white">{moduleData.size[2]} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Volume:</span>
                      <span className="text-white">{moduleData.volume} m³</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Crew Requirements</h3>
                  <div className="space-y-2">
                    {moduleData.minVolumePerCrew && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Min Volume/Crew:</span>
                        <span className="text-white">{moduleData.minVolumePerCrew} m³</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-300">Zone Classification:</span>
                      <span className="text-white capitalize">{moduleData.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Noise Level:</span>
                      <span className="text-white capitalize">{moduleData.noiseLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'guidelines' && (
            <>
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">NASA Design Guidelines</h3>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300">{moduleData.nasaGuidelines}</p>
                </div>
              </div>

              {moduleData.minVolumePerCrew && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Volume Requirements</h3>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-300">
                      This module requires a minimum of <strong>{moduleData.minVolumePerCrew} m³</strong> per crew member 
                      to meet NASA habitability standards.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'zoning' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {moduleData.requiredAdjacencies && (
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-3">Should be near:</h3>
                    <div className="space-y-2">
                      {moduleData.requiredAdjacencies.map((adj, index) => (
                        <div key={index} className="flex items-center space-x-2 text-green-300">
                          <span>✓</span>
                          <span className="capitalize">{adj.replace('-', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {moduleData.forbiddenAdjacencies && (
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-3">Should avoid:</h3>
                    <div className="space-y-2">
                      {moduleData.forbiddenAdjacencies.map((adj, index) => (
                        <div key={index} className="flex items-center space-x-2 text-red-300">
                          <span>✗</span>
                          <span className="capitalize">{adj.replace('-', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Zone Classification: {moduleData.zone}</h3>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300">
                    {moduleData.zone === 'quiet' && 'Quiet zones require minimal noise and disturbance for activities like sleep and focused work.'}
                    {moduleData.zone === 'active' && 'Active zones accommodate high-energy activities and can tolerate more noise and movement.'}
                    {moduleData.zone === 'wet' && 'Wet zones handle water and waste systems, requiring special ventilation and containment.'}
                    {moduleData.zone === 'clean' && 'Clean zones maintain sterile environments for medical care and food preparation.'}
                    {moduleData.zone === 'technical' && 'Technical zones house equipment and systems, prioritizing accessibility for maintenance.'}
                    {moduleData.zone === 'social' && 'Social zones facilitate crew interaction and group activities.'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

