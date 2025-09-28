'use client';

import { useHabitat } from '@/contexts/HabitatContext';
import { spaceModuleData } from '@/data/spaceModuleData';

export default function ValidationPanel() {
  const { modules, habitatConfig, stats } = useHabitat();

  // Check zoning violations
  const checkZoningViolations = () => {
    const violations: string[] = [];
    
    modules.forEach(module => {
      const moduleData = spaceModuleData.find(m => m.type === module.type);
      if (!moduleData) return;

      // Check forbidden adjacencies
      if (moduleData.forbiddenAdjacencies) {
        const nearbyModules = modules.filter(other => {
          if (other.id === module.id) return false;
          const distance = Math.sqrt(
            Math.pow(module.position[0] - other.position[0], 2) +
            Math.pow(module.position[1] - other.position[1], 2) +
            Math.pow(module.position[2] - other.position[2], 2)
          );
          return distance < 4; // Within 4 meters
        });

        nearbyModules.forEach(nearby => {
          if (moduleData.forbiddenAdjacencies!.includes(nearby.type)) {
            violations.push(`${module.type.replace('-', ' ')} should not be near ${nearby.type.replace('-', ' ')}`);
          }
        });
      }

      // Check required adjacencies
      if (moduleData.requiredAdjacencies) {
        const hasRequiredNearby = moduleData.requiredAdjacencies.some(requiredType => {
          return modules.some(other => {
            if (other.id === module.id) return false;
            const distance = Math.sqrt(
              Math.pow(module.position[0] - other.position[0], 2) +
              Math.pow(module.position[1] - other.position[1], 2) +
              Math.pow(module.position[2] - other.position[2], 2)
            );
            return distance < 6 && other.type === requiredType;
          });
        });

        if (!hasRequiredNearby) {
          violations.push(`${module.type.replace('-', ' ')} needs to be near ${moduleData.requiredAdjacencies.join(' or ')}`);
        }
      }
    });

    return violations;
  };

  // Check launch constraints
  const checkLaunchConstraints = () => {
    const constraints = habitatConfig.mission.payloadConstraints;
    const issues: string[] = [];
    
    const diameter = habitatConfig.radius * 2;
    const height = habitatConfig.height || habitatConfig.radius * 2;
    
    if (diameter > constraints.maxDiameter) {
      issues.push(`Habitat diameter (${diameter.toFixed(1)}m) exceeds launch vehicle limit (${constraints.maxDiameter}m)`);
    }
    
    if (height > constraints.maxLength) {
      issues.push(`Habitat height (${height.toFixed(1)}m) exceeds launch vehicle limit (${constraints.maxLength}m)`);
    }

    return issues;
  };

  // Check crew requirements
  const checkCrewRequirements = () => {
    const issues: string[] = [];
    const crewSize = habitatConfig.mission.crewSize;
    
    // Check minimum volume per crew
    const volumePerCrew = habitatConfig.volume / crewSize;
    if (volumePerCrew < 25) {
      issues.push(`Insufficient volume per crew member (${volumePerCrew.toFixed(1)}m³ < 25m³ minimum)`);
    }

    // Check for essential modules
    const moduleTypes = modules.map(m => m.type);
    const essentialModules = ['sleep', 'food', 'hygiene', 'life-support'];
    
    essentialModules.forEach(essential => {
      if (!moduleTypes.includes(essential as any)) {
        issues.push(`Missing essential module: ${essential.replace('-', ' ')}`);
      }
    });

    // Check sleep quarters count
    const sleepModules = modules.filter(m => m.type === 'sleep').length;
    if (sleepModules < crewSize) {
      issues.push(`Insufficient sleep quarters (${sleepModules} < ${crewSize} crew members)`);
    }

    return issues;
  };

  const zoningViolations = checkZoningViolations();
  const launchIssues = checkLaunchConstraints();
  const crewIssues = checkCrewRequirements();
  
  const allIssues = [...zoningViolations, ...launchIssues, ...crewIssues];
  const hasIssues = allIssues.length > 0;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-lg">✅</span>
          <h3 className="text-white font-semibold">Design Validation</h3>
        </div>
        <div className={`w-3 h-3 rounded-full shadow-lg ${
          hasIssues 
            ? 'bg-rose-500 shadow-rose-500/50' 
            : 'bg-emerald-500 shadow-emerald-500/50'
        }`} />
      </div>

      {!hasIssues ? (
        <div className="flex items-center text-emerald-400 text-sm bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
          <span className="mr-2 text-lg">✓</span>
          <span>Design meets all NASA requirements</span>
        </div>
      ) : (
        <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {allIssues.map((issue, index) => (
            <div key={index} className="flex items-start text-rose-400 text-sm bg-rose-500/10 rounded-lg p-3 border border-rose-500/20">
              <span className="mr-2 mt-0.5 text-rose-500">⚠</span>
              <span className="leading-relaxed">{issue}</span>
            </div>
          ))}
        </div>
      )}

      {/* Compliance Score */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-300 text-sm flex items-center">
            <span className="mr-2">🚀</span>
            NASA Compliance Score
          </span>
          <span className={`font-bold text-lg ${
            (stats.complianceScore || 0) >= 80 ? 'text-emerald-400' :
            (stats.complianceScore || 0) >= 60 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {(stats.complianceScore || 0).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${
              (stats.complianceScore || 0) >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
              (stats.complianceScore || 0) >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'
            }`}
            style={{ width: `${stats.complianceScore || 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}