'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Module, ModuleType, HabitatConfig } from '@/types/module';
import { HabitatStats } from '@/types/habitat';
import { spaceModuleData } from '@/data/spaceModuleData';

interface HabitatContextType {
  // Habitat configuration
  habitatConfig: HabitatConfig;
  setHabitatConfig: (config: HabitatConfig) => void;
  
  // Modules
  modules: Module[];
  addModule: (type: ModuleType, position: [number, number, number]) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  removeModule: (id: string) => void;
  clearModules: () => void;
  
  // Selection state
  selectedModuleId: string | null;
  setSelectedModuleId: (id: string | null) => void;
  
  // Modal state
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  selectedModuleType: string | null;
  setSelectedModuleType: (type: string | null) => void;
  
  // Drag state
  isDragging: boolean;
  setDragging: (dragging: boolean) => void;
  draggedModuleType: ModuleType | null;
  setDraggedModuleType: (type: ModuleType | null) => void;
  
  // Import/Export
  importDesign: (designData: any) => boolean;
  exportDesign: () => void;
  
  // Stats
  stats: HabitatStats;
  calculateStats: () => void;
}

const HabitatContext = createContext<HabitatContextType | undefined>(undefined);

export function HabitatProvider({ children }: { children: ReactNode }) {
  const [habitatConfig, setHabitatConfig] = useState<HabitatConfig>({
    shape: 'cylinder',
    radius: 5,
    height: 10,
    volume: 0,
    mission: {
      crewSize: 4,
      missionDuration: 180,
      destination: 'moon',
      launchVehicle: 'falcon-heavy',
      payloadConstraints: {
        maxDiameter: 5.2,
        maxLength: 13.1,
        maxMass: 63800
      }
    }
  });

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedModuleType, setSelectedModuleType] = useState<string | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [draggedModuleType, setDraggedModuleType] = useState<ModuleType | null>(null);

  const [stats, setStats] = useState<HabitatStats>({
    totalVolume: 0,
    usedVolume: 0,
    freeVolume: 0,
    usagePercentage: 0,
    crewVolumePerPerson: 0,
    complianceScore: 0,
    warnings: []
  });

  const addModule = (type: ModuleType, position: [number, number, number]) => {
    // Find the module configuration from spaceModuleData
    const moduleConfig = spaceModuleData.find(m => m.type === type);
    
    if (!moduleConfig) {
      console.error(`Module type ${type} not found in spaceModuleData`);
      return;
    }

    const newModule: Module = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      rotation: [0, 0, 0],
      size: moduleConfig.size as [number, number, number],
      volume: moduleConfig.volume,
      color: moduleConfig.color
    };

    setModules(prev => [...prev, newModule]);
  };

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(module => 
      module.id === id ? { ...module, ...updates } : module
    ));
  };

  const removeModule = (id: string) => {
    setModules(prev => prev.filter(module => module.id !== id));
  };

  const clearModules = () => {
    setModules([]);
  };

  const importDesign = (designData: any): boolean => {
    try {
      // Validate the design data structure
      if (!designData || typeof designData !== 'object') {
        console.error('Invalid design data format');
        return false;
      }

      // Import habitat configuration
      if (designData.habitatConfig) {
        setHabitatConfig(designData.habitatConfig);
      }

      // Import modules
      if (designData.modules && Array.isArray(designData.modules)) {
        setModules(designData.modules);
      }

      console.log('Design imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing design:', error);
      return false;
    }
  };

  const exportDesign = () => {
    const designData = {
      habitatConfig,
      modules,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(designData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitat-design-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calculateStats = useCallback(() => {
    const totalVolume = habitatConfig.volume;
    const usedVolume = modules.reduce((sum, module) => sum + module.volume, 0);
    const freeVolume = totalVolume - usedVolume;
    const usagePercentage = totalVolume > 0 ? (usedVolume / totalVolume) * 100 : 0;
    const crewVolumePerPerson = habitatConfig.mission?.crewSize
      ? totalVolume / habitatConfig.mission.crewSize
      : 0;

    setStats({
      totalVolume,
      usedVolume,
      freeVolume,
      usagePercentage,
      crewVolumePerPerson,
      complianceScore: 0,
      warnings: []
    });
  }, [habitatConfig.volume, modules]);

  return (
    <HabitatContext.Provider value={{
      habitatConfig,
      setHabitatConfig,
      modules,
      addModule,
      updateModule,
      removeModule,
      clearModules,
      selectedModuleId,
      setSelectedModuleId,
      isModalOpen,
      setModalOpen,
      selectedModuleType,
      setSelectedModuleType,
      isDragging,
      setDragging,
      draggedModuleType,
      setDraggedModuleType,
      importDesign,
      exportDesign,
      stats,
      calculateStats
    }}>
      {children}
    </HabitatContext.Provider>
  );
}

export function useHabitat() {
  const context = useContext(HabitatContext);
  if (context === undefined) {
    throw new Error('useHabitat must be used within a HabitatProvider');
  }
  return context;
}
