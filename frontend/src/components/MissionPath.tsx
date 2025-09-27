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

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-4xl mb-6">Where is your mission headed?</h2>
      <div className="flex gap-6">
        <button
          onClick={() => selectPath("Moon")}
          className="px-6 py-3 bg-purple-600 rounded hover:bg-purple-700"
        >
          Earth → Moon
        </button>
        <button
          onClick={() => selectPath("Mars")}
          className="px-6 py-3 bg-red-600 rounded hover:bg-red-700"
        >
          Earth → Mars
        </button>
      </div>
    </motion.div>
  );
};

export default MissionPath;
