'use client';

import { useState } from 'react';

export default function OverlapToggle() {
  const [allowOverlap, setAllowOverlap] = useState(true);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-600 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">🔧</span>
          <div>
            <h3 className="text-white font-semibold">Design Mode</h3>
            <p className="text-gray-400 text-sm">Configure design constraints</p>
          </div>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={allowOverlap}
            onChange={(e) => setAllowOverlap(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
        </label>
      </div>
      
      <div className="mt-3 p-3 bg-gray-700 rounded-lg border border-gray-500">
        <div className="flex items-center space-x-2 text-sm">
          <span className={`w-2 h-2 rounded-full ${allowOverlap ? 'bg-white' : 'bg-gray-500'}`}></span>
          <span className="text-gray-300">
            {allowOverlap ? 'Module overlapping enabled' : 'Collision detection active'}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {allowOverlap 
            ? 'Modules can overlap for easier experimentation and layout testing'
            : 'Modules cannot overlap - realistic collision detection active'
          }
        </p>
      </div>
    </div>
  );
}