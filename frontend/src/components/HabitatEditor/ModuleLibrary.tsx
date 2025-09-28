'use client';

import { useState } from 'react';
import { ModuleType } from '@/types/module';
import { useHabitat } from '@/contexts/HabitatContext';
import { spaceModuleData } from '@/data/spaceModuleData';
import ValidationPanel from './ValidationPanel';

export default function ModuleLibrary() {
  const { addModule, habitatConfig } = useHabitat();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Modules', icon: '🏠' },
    { id: 'essential', name: 'Essential', icon: '⚡' },
    { id: 'living', name: 'Living', icon: '🛏️' },
    { id: 'work', name: 'Work', icon: '🔬' },
    { id: 'technical', name: 'Technical', icon: '🔧' }
  ];

  const getModulesByCategory = () => {
    let filtered = spaceModuleData;

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryMap: Record<string, string[]> = {
        essential: ['sleep', 'food', 'hygiene', 'life-support'],
        living: ['sleep', 'food', 'hygiene', 'recreation', 'exercise'],
        work: ['workstation', 'laboratory', 'communication', 'medical'],
        technical: ['life-support', 'maintenance', 'airlock', 'storage']
      };
      
      filtered = filtered.filter(module => 
        categoryMap[selectedCategory]?.includes(module.type)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(module =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleAddModule = (moduleType: ModuleType) => {
    // Add module at a random position within habitat bounds
    const radius = habitatConfig.radius * 0.7; // Keep within 70% of radius
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * radius * Math.random();
    const z = Math.sin(angle) * radius * Math.random();
    const y = (Math.random() - 0.5) * (habitatConfig.height || 10) * 0.8;
    
    addModule(moduleType, [x, y, z]);
  };

  const getModuleIcon = (type: ModuleType) => {
    const icons: Record<ModuleType, string> = {
      sleep: '🛏️',
      food: '🍽️',
      medical: '🏥',
      exercise: '🏋️',
      storage: '📦',
      hygiene: '🚿',
      workstation: '💻',
      recreation: '🎮',
      airlock: '🚪',
      'life-support': '🌬️',
      communication: '📡',
      maintenance: '🔧',
      laboratory: '🔬',
      greenhouse: '🌱'
    };
    return icons[type] || '📦';
  };

  const filteredModules = getModulesByCategory();

  return (
    <div className="space-y-6">
      
      <div>
        <div className="flex items-center mb-4">
          <span className="text-lg mr-3">🏠</span>
          <h2 className="text-xl font-bold text-white">Module Library</h2>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all outline-none placeholder-gray-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-500'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
        
        {/* Module Grid */}
        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {filteredModules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleAddModule(module.type)}
              className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-all text-left border border-gray-500 hover:border-gray-400 group"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl group-hover:scale-110 transition-transform">{getModuleIcon(module.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">{module.name}</div>
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: module.color }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mb-2 leading-relaxed">
                    {module.description}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{module.size[0]}×{module.size[1]}×{module.size[2]}m</span>
                    <span className="text-gray-500">{module.volume}m³</span>
                    <span className="capitalize text-gray-500 bg-gray-600 px-2 py-0.5 rounded">{module.zone}</span>
                  </div>
                  {module.minVolumePerCrew && (
                    <div className="text-xs text-white mt-2 flex items-center">
                      <span className="mr-1">👥</span>
                      Min: {module.minVolumePerCrew}m³/crew
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {filteredModules.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-2">🔍</div>
            <div>No modules found matching your criteria</div>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-4 p-4 bg-gray-700 rounded-xl border border-gray-500">
          <div className="flex items-start">
            <span className="mr-2">💡</span>
            <div>
              <strong className="text-gray-300">Tips:</strong> Click modules to add them to your habitat. 
              Use categories to filter by function. Check validation above for NASA compliance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
