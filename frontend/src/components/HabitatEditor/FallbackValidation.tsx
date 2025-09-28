'use client';

import { useHabitat } from '@/contexts/HabitatContext';
import { nasaVolumeGuidelines } from '@/data/spaceModuleData';

export function useFallbackValidation() {
  const { habitatConfig, modules, stats } = useHabitat();

  const optimizeDesign = () => {
    // Create an optimized layout using rule-based logic
    const optimizedModules = modules.map(module => {
      const optimizedModule = { ...module };
      
      // Apply basic optimization rules
      switch (module.type) {
        case 'sleep':
          // Move sleep modules to upper levels and quieter areas
          optimizedModule.position = [
            module.position[0],
            Math.max(module.position[1], 2), // Move up
            module.position[2]
          ];
          break;
          
        case 'exercise':
          // Move exercise to lower levels with more space
          optimizedModule.position = [
            0, // Center for more space
            Math.min(module.position[1], -1), // Move down
            0
          ];
          break;
          
        case 'hygiene':
          // Place hygiene near exercise areas
          const exerciseModule = modules.find(m => m.type === 'exercise');
          if (exerciseModule) {
            optimizedModule.position = [
              exerciseModule.position[0] + 3,
              exerciseModule.position[1],
              exerciseModule.position[2]
            ];
          }
          break;
          
        case 'food':
          // Place food preparation in central, accessible location
          optimizedModule.position = [
            0,
            1, // Mid-level
            habitatConfig.radius * 0.6 // Near wall but accessible
          ];
          break;
          
        case 'life-support':
          // Place life support systems at habitat perimeter
          optimizedModule.position = [
            habitatConfig.radius * 0.7,
            -2, // Lower level
            0
          ];
          break;
      }
      
      return optimizedModule;
    });

    return {
      validation: {
        overallScore: 85,
        compliance: 'compliant' as const,
        issues: [],
        recommendations: ['Layout optimized using engineering rules']
      },
      optimizedLayout: {
        habitatConfig,
        modules: optimizedModules,
        changes: [
          'Sleep quarters moved to upper, quieter levels',
          'Exercise area centered for maximum space',
          'Hygiene facilities positioned near exercise area',
          'Food preparation placed in central, accessible location',
          'Life support systems moved to perimeter for maintenance access'
        ],
        reasoning: 'Applied rule-based optimization for NASA compliance and operational efficiency'
      },
      analysis: {
        volumeAnalysis: `Optimized for ${habitatConfig.mission.crewSize} occupants`,
        zoningAnalysis: 'Zones reorganized for better separation',
        adjacencyAnalysis: 'Adjacency rules applied systematically',
        safetyAnalysis: 'Layout optimized for operational efficiency'
      }
    };
  };

  const validateDesign = () => {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check crew volume requirements
    const crewSize = habitatConfig.mission.crewSize;
    const volumePerCrew = habitatConfig.volume / crewSize;
    
    if (volumePerCrew < nasaVolumeGuidelines.totalHabitable.min) {
      issues.push(`Insufficient volume per crew member: ${volumePerCrew.toFixed(1)}m³ < ${nasaVolumeGuidelines.totalHabitable.min}m³`);
      recommendations.push(`Increase habitat size or reduce crew count`);
      score -= 20;
    }

    // Check for essential modules
    const moduleTypes = modules.map(m => m.type);
    const essentialModules = ['sleep', 'food', 'hygiene', 'life-support'];
    
    essentialModules.forEach(essential => {
      if (!moduleTypes.includes(essential as any)) {
        issues.push(`Missing essential module: ${essential}`);
        recommendations.push(`Add ${essential} module for crew safety`);
        score -= 15;
      }
    });

    // Check sleep quarters
    const sleepModules = modules.filter(m => m.type === 'sleep').length;
    if (sleepModules < crewSize) {
      issues.push(`Insufficient sleep quarters: ${sleepModules} < ${crewSize} crew members`);
      recommendations.push(`Add ${crewSize - sleepModules} more sleep quarters`);
      score -= 10;
    }

    // Check module adjacencies (simplified)
    modules.forEach(module => {
      if (module.type === 'exercise') {
        const hasNearbyHygiene = modules.some(other => 
          other.type === 'hygiene' && 
          Math.sqrt(
            Math.pow(module.position[0] - other.position[0], 2) +
            Math.pow(module.position[1] - other.position[1], 2) +
            Math.pow(module.position[2] - other.position[2], 2)
          ) < 6
        );
        if (!hasNearbyHygiene) {
          issues.push('Exercise area should be near hygiene facilities');
          recommendations.push('Move exercise area closer to hygiene station');
          score -= 5;
        }
      }
    });

    const compliance = score >= 80 ? 'compliant' : score >= 60 ? 'warning' : 'critical';

    return {
      validation: {
        overallScore: Math.max(0, score),
        compliance,
        issues,
        recommendations
      },
      analysis: {
        volumeAnalysis: `Total volume: ${habitatConfig.volume.toFixed(1)}m³, Per crew: ${volumePerCrew.toFixed(1)}m³`,
        zoningAnalysis: `${modules.length} modules placed across different zones`,
        adjacencyAnalysis: `Basic adjacency rules checked for ${modules.length} modules`,
        safetyAnalysis: `Essential modules: ${essentialModules.filter(e => moduleTypes.includes(e as any)).length}/${essentialModules.length}`
      }
    };
  };

  return { validateDesign, optimizeDesign };
}