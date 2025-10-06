// src/components/Summary.tsx
import { useContext } from "react";
import { MissionContext } from "./MissionContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Summary: React.FC = () => {
  const context = useContext(MissionContext);
  if (!context) return null;
  const router=useRouter();

  const { missionPath, missionParams } = context;

  const cardItems = [
    { label: "Destination", value: missionPath, icon: missionPath === "Moon" ? "🌕" : "🪐" },
    { label: "Crew Size", value: `${missionParams.crew} Astronauts`, icon: "👨‍🚀" },
    { label: "Duration", value: missionParams.duration, icon: "🗓️" },
    { label: "Habitat Class", value: missionParams.habitat, icon: "🏗️" },
  ];

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen text-white p-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-5xl font-extrabold mb-12 text-blue-500 drop-shadow-lg tracking-wider">
        MISSION BRIEFING COMPLETE
      </h2>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-10">
        {cardItems.map((item, index) => (
          <motion.div
            key={index}
            className="p-6 bg-gray-800/70 border border-blue-500/50 rounded-lg shadow-xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-sm uppercase text-blue-300 tracking-widest">{item.label}</p>
                <p className="text-2xl font-semibold text-white">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        className="mt-4 mb-5 px-10 py-4 bg-purple-600 rounded-full hover:bg-blue-500 transition duration-300 shadow-2xl shadow-blue-500/50 uppercase tracking-widest font-bold text-lg transform hover:scale-105"
        onClick={()=>{router.push("/editor")}}
      >
        START HABITAT BUILDER &gt;
      </button>
    </motion.div>
  );
};

export default Summary;