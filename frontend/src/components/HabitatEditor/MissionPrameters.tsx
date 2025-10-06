import React, { useContext, useState } from "react";
import { MissionContext } from "./MissionContext";
import { motion } from "framer-motion";
import { Users, Clock, Globe } from 'lucide-react';

interface Props {
  nextStep: () => void;
}

const DURATION_OPTIONS = ["30 days", "90 days", "1 year", "3+ years (Mars Transit)"];
const HABITAT_OPTIONS = ["Metallic", "Inflatable", "ISRU (In-Situ Resource Utilization)"];

const MissionParameters: React.FC<Props> = ({ nextStep }) => {
  const context = useContext(MissionContext);
  if (!context) return null;

  const { missionParams, setMissionParams } = context;

  // Handler for all parameter changes
  const handleChange = (field: keyof typeof missionParams, value: number | string) => {
    setMissionParams({ ...missionParams, [field]: value as any });
  };

  // Helper for consistent UI styling
  const optionButtonClass = (isActive: boolean) => 
    `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 w-full text-center ${
      isActive
        ? "bg-blue-600 shadow-md shadow-blue-500/50 border border-blue-400"
        : "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/70"
    }`;

  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };


  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold mb-12 text-blue-400 drop-shadow-lg tracking-wider">
        DEFINE MISSION PARAMETERS
      </h2>

      {/* Parameter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        
        {/* 1. Crew Size Card */}
        <motion.div
          variants={cardVariant} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
          className="p-6 bg-gray-900/80 border border-blue-500/30 rounded-xl shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Users className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold tracking-wide">Crew Size</h3>
          </div>
          <p className="text-gray-400 mb-6 text-sm">How many astronauts will occupy the habitat?</p>

          <div className="flex flex-col items-center space-y-4">
            <span className="text-6xl font-extrabold text-white">{missionParams.crew}</span>
            <input
              type="range"
              min="2"
              max="10"
              step="2"
              value={missionParams.crew}
              onChange={(e) => handleChange("crew", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              style={{
                '--tw-ring-color': 'rgba(37, 99, 235, 1)',
                '--tw-ring-shadow': '0 0 0 4px rgba(37, 99, 235, 0.5)',
              } as React.CSSProperties}
            />
            <div className="flex justify-between w-full text-xs text-gray-500">
              {[2, 4, 6, 8, 10].map(n => <span key={n}>{n}</span>)}
            </div>
          </div>
        </motion.div>

        {/* 2. Mission Duration Card */}
        <motion.div
          variants={cardVariant} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
          className="p-6 bg-gray-900/80 border border-blue-500/30 rounded-xl shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold tracking-wide">Duration</h3>
          </div>
          <p className="text-gray-400 mb-6 text-sm">Determines resource requirements (food, water, air, repair parts).</p>

          <div className="space-y-3">
            {DURATION_OPTIONS.map((duration) => (
              <button
                key={duration}
                onClick={() => handleChange("duration", duration)}
                className={optionButtonClass(missionParams.duration === duration)}
              >
                {duration}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 3. Habitat Type Card */}
        <motion.div
          variants={cardVariant} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
          className="p-6 bg-gray-900/80 border border-blue-500/30 rounded-xl shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold tracking-wide">Habitat Class</h3>
          </div>
          <p className="text-gray-400 mb-6 text-sm">Influences structural constraints and launch logistics.</p>

          <div className="space-y-3">
            {HABITAT_OPTIONS.map((habitat) => (
              <button
                key={habitat}
                onClick={() => handleChange("habitat", habitat)}
                className={optionButtonClass(missionParams.habitat === habitat)}
              >
                {habitat}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Proceed Button */}
      <button 
        onClick={nextStep}
        className=" mt-12 px-10 py-4 bg-purple-600 rounded-full hover:bg-blue-500 transition duration-300 shadow-2xl shadow-blue-500/50 uppercase tracking-widest font-bold text-lg transform hover:scale-105"
      >
        PROCEED TO SUMMARY &gt;
      </button>
    </motion.div>
  );
};

export default MissionParameters;
