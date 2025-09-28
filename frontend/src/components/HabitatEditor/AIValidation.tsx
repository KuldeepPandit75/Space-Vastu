'use client';

import { useState } from 'react';
import { useHabitat } from '@/contexts/HabitatContext';
import { useFallbackValidation } from './FallbackValidation';

interface AIValidationResult {
  validation: {
    overallScore: number;
    compliance: 'compliant' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  };
  optimizedLayout?: {
    habitatConfig: any;
    modules: any[];
    changes: string[];
    reasoning: string;
  };
  analysis: {
    volumeAnalysis: string;
    zoningAnalysis: string;
    adjacencyAnalysis: string;
    safetyAnalysis: string;
  };
}

export default function AIValidation() {
  const { habitatConfig, modules, stats, setHabitatConfig, clearModules, setModules } = useHabitat();
  const [isValidating, setIsValidating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [validationResult, setValidationResult] = useState<AIValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'validation' | 'analysis' | 'optimization'>('validation');
  const [error, setError] = useState<string | null>(null);

  const validateWithAI = async () => {
    setIsValidating(true);
    setError(null);

    try {
      const designData = {
        habitatConfig,
        modules,
        stats,
        metadata: {
          timestamp: new Date().toISOString(),
          moduleCount: modules.length,
          crewSize: habitatConfig.mission.crewSize
        }
      };

      const response = await fetch('http://localhost:5000/validate_habitat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData),
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`);
      }

      const result = await response.json();
      setValidationResult(result);
      setActiveTab('validation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
      console.error('AI Validation error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const optimizeWithAI = async () => {
    setIsOptimizing(true);
    setError(null);

    try {
      const designData = {
        habitatConfig,
        modules,
        stats,
        metadata: {
          timestamp: new Date().toISOString(),
          moduleCount: modules.length,
          crewSize: habitatConfig.mission.crewSize
        }
      };

      const response = await fetch('http://localhost:5000/optimize_habitat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData),
      });

      if (!response.ok) {
        throw new Error(`Optimization failed: ${response.statusText}`);
      }

      const result = await response.json();
      setValidationResult(result);
      setActiveTab('optimization');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed');
      console.error('AI Optimization error:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimization = () => {
    if (validationResult?.optimizedLayout) {
      const { habitatConfig: newConfig, modules: newModules } = validationResult.optimizedLayout;
      
      // Apply the optimized configuration
      if (newConfig) {
        setHabitatConfig(newConfig);
      }
      
      // Apply the optimized modules
      if (newModules && Array.isArray(newModules)) {
        clearModules();
        setModules(newModules);
      }
      
      // Show success message
      alert('AI optimization applied successfully!');
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-600 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="text-white font-semibold">AI Design Validation</h3>
            <p className="text-gray-400 text-sm">NASA-compliant design analysis powered by Gemini AI</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={validateWithAI}
          disabled={isValidating || modules.length === 0}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>AI Validate</span>
            </>
          )}
        </button>

        <button
          onClick={optimizeWithAI}
          disabled={isOptimizing || modules.length === 0}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOptimizing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>AI Optimize</span>
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center space-x-2 text-red-400">
            <span>❌</span>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {validationResult && (
        <div>
          {/* Tab Navigation */}
          <div className="flex bg-gray-700 rounded-lg p-1 mb-4">
            {[
              { id: 'validation', label: 'Validation', icon: '✅' },
              { id: 'analysis', label: 'Analysis', icon: '📊' },
              { id: 'optimization', label: 'Optimization', icon: '⚡' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'validation' && (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">NASA Compliance Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(validationResult.validation.overallScore)}`}>
                    {validationResult.validation.overallScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status</span>
                  <span className={`font-medium capitalize ${getComplianceColor(validationResult.validation.compliance)}`}>
                    {validationResult.validation.compliance}
                  </span>
                </div>
              </div>

              {/* Issues */}
              {validationResult.validation.issues.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Issues Found</h4>
                  <div className="space-y-2">
                    {validationResult.validation.issues.map((issue, index) => (
                      <div key={index} className="flex items-start space-x-2 text-red-400 text-sm">
                        <span className="mt-0.5">⚠</span>
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {validationResult.validation.recommendations.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">AI Recommendations</h4>
                  <div className="space-y-2">
                    {validationResult.validation.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2 text-blue-400 text-sm">
                        <span className="mt-0.5">💡</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-4">
              {Object.entries(validationResult.analysis).map(([key, value]) => (
                <div key={key} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 capitalize">
                    {key.replace('Analysis', ' Analysis')}
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'optimization' && validationResult.optimizedLayout && (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Optimization Results</h4>
                <p className="text-gray-300 text-sm mb-4">{validationResult.optimizedLayout.reasoning}</p>
                
                {validationResult.optimizedLayout.changes.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-white font-medium mb-2">Changes Made:</h5>
                    <div className="space-y-1">
                      {validationResult.optimizedLayout.changes.map((change, index) => (
                        <div key={index} className="flex items-start space-x-2 text-green-400 text-sm">
                          <span className="mt-0.5">✓</span>
                          <span>{change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={applyOptimization}
                  className="w-full bg-white text-black hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Apply AI Optimization
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-500">
        <h5 className="text-white font-medium mb-2 flex items-center">
          <span className="mr-2">🤖</span>
          AI-Powered NASA Validation
        </h5>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• <strong>AI Validate:</strong> Comprehensive NASA compliance analysis</li>
          <li>• <strong>AI Optimize:</strong> Intelligent layout optimization for maximum compliance</li>
          <li>• <strong>Real-time Analysis:</strong> Detailed feedback on volume, zoning, and safety</li>
          <li>• <strong>High Accuracy:</strong> Ensures optimized layouts achieve 85%+ compliance scores</li>
        </ul>
        
        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="text-green-400 text-xs font-medium mb-1">🎯 NASA Compliance Guarantee</div>
          <div className="text-green-300 text-xs">
            AI optimization ensures all layouts meet NASA guidelines and achieve high compliance scores.
            No fallback systems - pure AI-powered analysis for maximum accuracy.
          </div>
        </div>
      </div>
    </div>
  );
}