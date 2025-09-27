// src/components/MissionParameters.tsx
import { useContext, useState } from "react";
import { MissionContext } from "./MissionContext";

interface Props {
  nextStep: () => void;
}

const MissionParameters: React.FC<Props> = ({ nextStep }) => {
  const context = useContext(MissionContext);
  const [skip, setSkip] = useState(false);

  if (!context) return null;
  const { missionParams, setMissionParams } = context;

  const updateParam = (field: string, value: string | number) => {
    setMissionParams({ ...missionParams, [field]: value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white gap-4">
      {!skip && (
        <p className="text-center max-w-md">
          Select your mission parameters: crew size, mission duration, and habitat type
        </p>
      )}
      <button onClick={() => setSkip(true)} className="text-sm underline text-gray-400">
        Skip Explanation
      </button>

      <div className="flex flex-col gap-4 mt-4">
        <div>
          <label>Crew Size:</label>
          <select
            value={missionParams.crew}
            onChange={(e) => updateParam("crew", Number(e.target.value))}
            className="ml-2 text-black"
          >
            {[2, 4, 6].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Mission Duration:</label>
          <select
            value={missionParams.duration}
            onChange={(e) => updateParam("duration", e.target.value)}
            className="ml-2 text-black"
          >
            {["30 days", "6 months", "2 years"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Habitat Type:</label>
          <select
            value={missionParams.habitat}
            onChange={(e) => updateParam("habitat", e.target.value)}
            className="ml-2 text-black"
          >
            {["Metallic", "Inflatable", "In-situ"].map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={nextStep}
        className="mt-6 px-6 py-3 bg-green-600 rounded hover:bg-green-700"
      >
        Proceed
      </button>
    </div>
  );
};

export default MissionParameters;
