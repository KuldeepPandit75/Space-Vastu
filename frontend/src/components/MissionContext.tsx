// src/components/MissionContext.tsx
import { createContext, useState, ReactNode } from "react";

interface MissionParams {
  crew: number;
  duration: string;
  habitat: string;
}

interface MissionContextType {
  missionPath: string;
  setMissionPath: (path: string) => void;
  missionParams: MissionParams;
  setMissionParams: (params: MissionParams) => void;
}

export const MissionContext = createContext<MissionContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const MissionProvider: React.FC<Props> = ({ children }) => {
  const [missionPath, setMissionPath] = useState<string>("");
  const [missionParams, setMissionParams] = useState<MissionParams>({
    crew: 2,
    duration: "30 days",
    habitat: "Metallic",
  });

  return (
    <MissionContext.Provider value={{ missionPath, setMissionPath, missionParams, setMissionParams }}>
      {children}
    </MissionContext.Provider>
  );
};
