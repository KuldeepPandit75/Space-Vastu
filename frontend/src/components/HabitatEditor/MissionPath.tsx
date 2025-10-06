// src/components/MissionPath.tsx
import { useContext } from "react";
import { MissionContext } from "./MissionContext";
import { motion } from "framer-motion";

interface Props {
  nextStep: () => void;
}

const MissionPath: React.FC<Props> = ({ nextStep }) => {
  const context = useContext(MissionContext);
  if (!context) return null;

  const { setMissionPath } = context;

  const selectPath = (path: string) => {
    setMissionPath(path);
    nextStep();
  };
  
  const cardVariants = {
    initial: { scale: 1, opacity: 0.8, y: 10 },
    hover: { scale: 1.05, opacity: 1, boxShadow: "0 0 20px rgba(75, 0, 130, 0.8)" },
  };


  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-5xl font-extrabold mb-12 text-blue-400 drop-shadow-lg tracking-wider">
        SELECT DESTINATION
      </h2>
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Moon Card */}
        <motion.div
          onClick={() => selectPath("Moon")}
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          className="relative flex flex-col items-center p-8 w-64 h-58 bg-gray-900 border border-gray-700 rounded-xl cursor-pointer transition duration-300 overflow-hidden shadow-2xl hover:border-purple-500"
        >
          {/* Faux 3D / Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black/20 opacity-0 hover:opacity-100 transition-opacity"></div>
          <p className="text-6xl mb-4">🌕</p>
          <h3 className="text-2xl font-bold mb-2">Earth → Moon</h3>
          <p className="text-sm text-gray-400 text-center">Artemis: Proving ground, sustained lunar presence.</p>
        </motion.div>

        {/* Mars Card */}
        <motion.div
          onClick={() => selectPath("Mars")}
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          // Custom color for Mars glow
          style={{ '--tw-shadow-color': 'rgba(239, 68, 68, 0.8)' } as React.CSSProperties}
          className="relative flex flex-col items-center p-8 w-64 h-58 bg-gray-900 border border-gray-700 rounded-xl cursor-pointer transition duration-300 overflow-hidden shadow-2xl hover:border-red-500"
        >
          {/* Faux 3D / Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-black/20 opacity-0 hover:opacity-100 transition-opacity"></div>
          <p className="text-6xl mb-4">🪐</p>
          <h3 className="text-2xl font-bold mb-2">Earth → Mars</h3>
          <p className="text-sm text-gray-400 text-center">Future human missions: Transit and surface habitat.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MissionPath;