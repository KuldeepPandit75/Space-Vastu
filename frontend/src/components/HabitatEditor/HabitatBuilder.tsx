'use client';

import MissionPlanner from './MissionPlanner';
import HabitatShapeSelector from './HabitatShapeSelector';
import OverlapToggle from './OverlapToggle';

export default function HabitatBuilder() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl mb-4">
          <span className="text-2xl">🚀</span>
        </div>
        <h1 className="text-2xl font-bold text-white">
          Space Habitat Designer
        </h1>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Design and validate space habitats using NASA guidelines
        </p>
      </div>
      
      <MissionPlanner />
      <HabitatShapeSelector />
      <OverlapToggle />
    </div>
  );
}
