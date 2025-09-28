'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Module, ModuleType, HabitatConfig } from '@/types/module';
import { HabitatStats } from '@/types/habitat';
import { spaceModuleData, nasaVolumeGuidelines } from '@/data/spaceModuleData';

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
  setModules: (modules: Module[]) => void;
  
  // Import/Export
  exportDesign: () => void;
  importDesign: (designData: any) => boolean;
  
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
    volume: Math.PI * 5 * 5 * 10, // Initial volume calculation
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
    complianceScore: 100,
    warnings: []
  });

  const addModule = (type: ModuleType, position: [number, number, number]) => {
    const moduleData = spaceModuleData.find((m: any) => m.type === type);
    
    if (!moduleData) {
      console.error(`Module type ${type} not found in configuration`);
      return;
    }

    const moduleSize = moduleData.size;
    
    // Check if position is valid before adding (capsule bounds only)
    if (!isWithinCapsule(position, moduleSize)) {
      console.log('Cannot place module outside capsule bounds');
      return;
    }
    
    // Collision detection disabled - allowing overlapping modules for now
    // if (checkCollision('', position, moduleSize)) {
    //   console.log('Cannot place module - would overlap with existing module');
    //   return;
    // }

    const newModule: Module = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      rotation: [0, 0, 0],
      size: moduleData.size,
      volume: moduleData.volume,
      color: moduleData.color,
      zone: moduleData.zone,
      requiredAdjacencies: moduleData.requiredAdjacencies,
      forbiddenAdjacencies: moduleData.forbiddenAdjacencies,
      minVolumePerCrew: moduleData.minVolumePerCrew,
      noiseLevel: moduleData.noiseLevel,
      isFixed: moduleData.isFixed
    };

    setModules(prev => [...prev, newModule]);
  };

  // Constraint functions
  const isWithinCapsule = (position: [number, number, number], size: [number, number, number]) => {
    const [x, y, z] = position;
    const [width, height, depth] = size;
    
    const radius = habitatConfig.radius;
    const halfHeight = (habitatConfig.height || 10) / 2;
    
    // Check if module is within the capsule (cylinder + hemispheres)
    const distanceFromCenter = Math.sqrt(x * x + z * z);
    
    // For cylindrical section
    if (Math.abs(y) <= halfHeight - radius) {
      const maxRadius = radius - Math.max(width, depth) / 2;
      return distanceFromCenter <= maxRadius;
    }
    
    // For hemispherical sections
    const hemisphereY = Math.abs(y) - (halfHeight - radius);
    const hemisphereRadius = Math.sqrt(radius * radius - hemisphereY * hemisphereY);
    const maxRadius = hemisphereRadius - Math.max(width, depth) / 2;
    
    return distanceFromCenter <= maxRadius && hemisphereY <= radius;
  };

  const checkCollision = (moduleId: string, position: [number, number, number], size: [number, number, number]) => {
    const [x, y, z] = position;
    const [width, height, depth] = size;
    
    return modules.some(module => {
      if (module.id === moduleId) return false;
      
      const [otherX, otherY, otherZ] = module.position;
      const [otherWidth, otherHeight, otherDepth] = module.size;
      
      // Check for overlap using bounding box collision
      const overlapX = Math.abs(x - otherX) < (width + otherWidth) / 2;
      const overlapY = Math.abs(y - otherY) < (height + otherHeight) / 2;
      const overlapZ = Math.abs(z - otherZ) < (depth + otherDepth) / 2;
      
      return overlapX && overlapY && overlapZ;
    });
  };

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(module => {
      if (module.id === id) {
        const updatedModule = { ...module, ...updates };
        
        // Apply constraints
        if (updates.position) {
          const newPosition = updates.position as [number, number, number];
          const moduleSize = updatedModule.size;
          
          // Check capsule bounds only
          if (!isWithinCapsule(newPosition, moduleSize)) {
            console.log('Module would be outside capsule bounds, keeping original position');
            return module; // Keep original position
          }
          
          // Collision detection disabled - allowing overlapping modules for now
          // if (checkCollision(id, newPosition, moduleSize)) {
          //   console.log('Module would overlap with another module, keeping original position');
          //   return module; // Keep original position
          // }
        }
        
        return updatedModule;
      }
      return module;
    }));
  };

  const removeModule = (id: string) => {
    setModules(prev => prev.filter(module => module.id !== id));
  };

  const clearModules = () => {
    setModules([]);
    setSelectedModuleId(null);
  };

  const setModulesDirectly = (newModules: Module[]) => {
    setModules(newModules);
    setSelectedModuleId(null);
  };

  const exportDesign = () => {
    const designData = {
      version: "1.0",
      metadata: {
        name: `Habitat Design ${new Date().toLocaleDateString()}`,
        created: new Date().toISOString(),
        description: "Space habitat design created with Space Habitat Designer"
      },
      habitatConfig,
      modules: modules.map(module => ({
        ...module,
        // Ensure all required fields are present
        id: module.id,
        type: module.type,
        position: module.position,
        rotation: module.rotation,
        size: module.size,
        volume: module.volume,
        color: module.color,
        zone: module.zone,
        noiseLevel: module.noiseLevel
      })),
      stats: {
        totalVolume: stats.totalVolume,
        usedVolume: stats.usedVolume,
        freeVolume: stats.freeVolume,
        usagePercentage: stats.usagePercentage,
        crewVolumePerPerson: stats.crewVolumePerPerson,
        complianceScore: stats.complianceScore,
        moduleCount: modules.length
      }
    };

    const blob = new Blob([JSON.stringify(designData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `space-habitat-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDesign = (designData: any): boolean => {
    try {
      // Validate the imported data structure
      if (!designData || typeof designData !== 'object') {
        throw new Error('Invalid design data format');
      }

      // Check for required fields
      if (!designData.habitatConfig || !Array.isArray(designData.modules)) {
        throw new Error('Missing required design data (habitatConfig or modules)');
      }

      // Validate habitat config
      const config = designData.habitatConfig;
      if (!config.shape || !config.radius || !config.mission) {
        throw new Error('Invalid habitat configuration');
      }

      // Validate modules
      const modules = designData.modules;
      for (const module of modules) {
        if (!module.id || !module.type || !module.position || !module.size) {
          throw new Error('Invalid module data structure');
        }
        
        // Validate module type exists in our data
        const moduleExists = spaceModuleData.some(m => m.type === module.type);
        if (!moduleExists) {
          console.warn(`Unknown module type: ${module.type}, skipping...`);
          continue;
        }
      }

      // Clear current design
      clearModules();
      setSelectedModuleId(null);

      // Import habitat configuration
      setHabitatConfig({
        ...config,
        // Ensure all required fields are present with defaults
        levels: config.levels || 1,
        mission: {
          crewSize: config.mission.crewSize || 4,
          missionDuration: config.mission.missionDuration || 180,
          destination: config.mission.destination || 'moon',
          launchVehicle: config.mission.launchVehicle || 'sls',
          payloadConstraints: config.mission.payloadConstraints || {
            maxDiameter: 8.4,
            maxLength: 19.1,
            maxMass: 95000
          }
        }
      });

      // Import modules
      const validModules = modules.filter((module: any) => {
        return spaceModuleData.some(m => m.type === module.type);
      });

      setModules(validModules.map((module: any) => {
        // Get module data for missing fields
        const moduleData = spaceModuleData.find(m => m.type === module.type);
        
        return {
          ...module,
          // Fill in any missing fields with defaults from module data
          zone: module.zone || moduleData?.zone || 'technical',
          noiseLevel: module.noiseLevel || moduleData?.noiseLevel || 'quiet',
          color: module.color || moduleData?.color || '#6b7280',
          requiredAdjacencies: module.requiredAdjacencies || moduleData?.requiredAdjacencies,
          forbiddenAdjacencies: module.forbiddenAdjacencies || moduleData?.forbiddenAdjacencies,
          minVolumePerCrew: module.minVolumePerCrew || moduleData?.minVolumePerCrew,
          isFixed: module.isFixed || moduleData?.isFixed || false
        };
      }));

      return true;
    } catch (error) {
      console.error('Failed to import design:', error);
      return false;
    }
  };

  const calculateStats = useCallback(() => {
    const totalVolume = habitatConfig.volume;
    const usedVolume = modules.reduce((sum, module) => sum + module.volume, 0);
    const freeVolume = totalVolume - usedVolume;
    const usagePercentage = totalVolume > 0 ? (usedVolume / totalVolume) * 100 : 0;
    const crewVolumePerPerson = totalVolume / habitatConfig.mission.crewSize;

    // Calculate compliance score and warnings
    const warnings: string[] = [];
    let complianceScore = 100;

    // Check volume per crew member
    if (crewVolumePerPerson < nasaVolumeGuidelines.totalHabitable.min) {
      warnings.push(`Insufficient volume per crew member (${crewVolumePerPerson.toFixed(1)} < ${nasaVolumeGuidelines.totalHabitable.min})`);
      complianceScore -= 20;
    }

    // Check for required modules
    const modulesByType = modules.reduce((acc, module) => {
      acc[module.type] = (acc[module.type] || 0) + 1;
      return acc;
    }, {} as Record<ModuleType, number>);

    const requiredModules: ModuleType[] = ['sleep', 'food', 'hygiene', 'life-support'];
    requiredModules.forEach(moduleType => {
      if (!modulesByType[moduleType]) {
        warnings.push(`Missing required module: ${moduleType}`);
        complianceScore -= 15;
      }
    });

    // Check adjacency violations
    modules.forEach(module => {
      if (module.forbiddenAdjacencies) {
        const nearbyModules = modules.filter(other => {
          if (other.id === module.id) return false;
          const distance = Math.sqrt(
            Math.pow(module.position[0] - other.position[0], 2) +
            Math.pow(module.position[1] - other.position[1], 2) +
            Math.pow(module.position[2] - other.position[2], 2)
          );
          return distance < 5; // Within 5 meters
        });

        nearbyModules.forEach(nearby => {
          if (module.forbiddenAdjacencies!.includes(nearby.type)) {
            warnings.push(`${module.type} should not be adjacent to ${nearby.type}`);
            complianceScore -= 5;
          }
        });
      }
    });

    setStats({
      totalVolume,
      usedVolume,
      freeVolume,
      usagePercentage,
      crewVolumePerPerson,
      complianceScore: Math.max(0, complianceScore),
      warnings
    });
  }, [habitatConfig.volume, habitatConfig.mission.crewSize, modules]);

  // Calculate stats on mount and when dependencies change
  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  return (
    <HabitatContext.Provider value={{
      habitatConfig,
      setHabitatConfig,
      modules,
      addModule,
      updateModule,
      removeModule,
      clearModules,
      setModules: setModulesDirectly,
      exportDesign,
      importDesign,
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
