// src/components/Summary.tsx
import { useContext } from "react";
import { MissionContext } from "./MissionContext";

const Summary: React.FC = () => {
  const context = useContext(MissionContext);
  if (!context) return null;

  const { missionPath, missionParams } = context;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
      <h2 className="text-4xl">Mission Summary</h2>
      <p>Mission Path: {missionPath}</p>
      <p>Crew Size: {missionParams.crew}</p>
      <p>Mission Duration: {missionParams.duration}</p>
      <p>Habitat Type: {missionParams.habitat}</p>

      <button className="mt-6 px-6 py-3 bg-blue-600 rounded hover:bg-blue-700">
        Start Habitat Builder
      </button>
    </div>
  );
};

export default Summary;
