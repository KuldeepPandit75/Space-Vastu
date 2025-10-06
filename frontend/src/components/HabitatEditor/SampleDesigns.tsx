'use client';

import { useState } from 'react';
import { useHabitat } from '@/contexts/HabitatContext';

interface SampleDesign {
  name: string;
  description: string;
  filename: string;
  crew: number;
  duration: number;
  destination: string;
  modules: number;
  thumbnail: string;
}

const sampleDesigns: SampleDesign[] = [
  {
    name: "Lunar Base - 4 Crew",
    description: "Compact lunar surface habitat with essential modules for a 4-person crew on a 180-day mission",
    filename: "lunar-base-4-crew.json",
    crew: 4,
    duration: 180,
    destination: "Moon",
    modules: 12,
    thumbnail: "🌙"
  },
  {
    name: "Mars Transit - 6 Crew", 
    description: "Deep space transit vehicle designed for 6 crew members on a 270-day journey to Mars",
    filename: "mars-transit-6-crew.json",
    crew: 6,
    duration: 270,
    destination: "Mars Transit",
    modules: 21,
    thumbnail: "🚀"
  }
];

interface SampleDesignsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleDesigns({ isOpen, onClose }: SampleDesignsProps) {
  const { importDesign } = useHabitat();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const loadSampleDesign = async (filename: string) => {
    setLoading(filename);
    setError(null);

    try {
      const response = await fetch(`/sample-designs/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load sample design: ${response.status} ${response.statusText}`);
      }
      
      const designData = await response.json();
      const success = importDesign(designData);
      
      if (success) {
        onClose();
      } else {
        setError('Failed to import sample design - invalid format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading sample design';
      setError(errorMessage);
      console.error('Sample design load error:', err);
    } finally {
      setLoading(null);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const designData = JSON.parse(e.target?.result as string);
        const success = importDesign(designData);
        
        if (success) {
          onClose();
        } else {
          setError('Failed to import design - invalid format');
        }
      } catch (err) {
        setError('Invalid JSON file format');
        console.error('File import error:', err);
      }
    };
    
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-600 p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Sample Habitat Designs</h3>
            <p className="text-gray-400 mt-1">Load pre-built designs to explore different habitat configurations</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleDesigns.map((design) => (
            <div key={design.filename} className="bg-gray-700 rounded-xl border border-gray-500 overflow-hidden">
              {/* Thumbnail */}
              <div className="bg-gray-600 p-8 text-center">
                <div className="text-6xl mb-4">{design.thumbnail}</div>
                <h4 className="text-xl font-bold text-white">{design.name}</h4>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {design.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-600 rounded p-3 text-center">
                    <div className="text-white font-bold text-lg">{design.crew}</div>
                    <div className="text-gray-400 text-xs">Crew Members</div>
                  </div>
                  <div className="bg-gray-600 rounded p-3 text-center">
                    <div className="text-white font-bold text-lg">{design.duration}</div>
                    <div className="text-gray-400 text-xs">Days</div>
                  </div>
                  <div className="bg-gray-600 rounded p-3 text-center">
                    <div className="text-white font-bold text-lg">{design.modules}</div>
                    <div className="text-gray-400 text-xs">Modules</div>
                  </div>
                  <div className="bg-gray-600 rounded p-3 text-center">
                    <div className="text-white font-bold text-sm">{design.destination}</div>
                    <div className="text-gray-400 text-xs">Destination</div>
                  </div>
                </div>

                {/* Load Button */}
                <button
                  onClick={() => loadSampleDesign(design.filename)}
                  disabled={loading === design.filename}
                  className="w-full bg-white text-black hover:bg-gray-200 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading === design.filename ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>📁</span>
                      <span>Load Design</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Import Section */}
        <div className="mt-8 p-6 bg-gray-700 rounded-xl border border-gray-500">
          <h5 className="text-white font-medium mb-4 flex items-center">
            <span className="mr-2">📁</span>
            Import Custom Design
          </h5>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
              id="design-file-input"
            />
            <label
              htmlFor="design-file-input"
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center space-x-2"
            >
              <span>📂</span>
              <span>Choose JSON File</span>
            </label>
            <span className="text-gray-400 text-sm">Import your own habitat design from a JSON file</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-6 bg-gray-700 rounded-xl border border-gray-500">
          <h5 className="text-white font-medium mb-3 flex items-center">
            <span className="mr-2">💡</span>
            About Sample Designs
          </h5>
          <div className="text-gray-300 text-sm space-y-2">
            <p>• These designs demonstrate different habitat configurations and NASA compliance strategies</p>
            <p>• Loading a sample design will replace your current habitat configuration</p>
            <p>• You can modify and export these designs as starting points for your own creations</p>
            <p>• Each design follows NASA guidelines for crew volume, module placement, and zoning</p>
          </div>
        </div>
      </div>
    </div>
  );
}