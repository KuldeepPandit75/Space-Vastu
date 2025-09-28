export type HabitatShape = 'cylinder' | 'sphere' | 'torus' | 'inflatable' | 'modular';
export type Destination = 'moon' | 'mars' | 'transit' | 'orbit';
export type LaunchVehicle = 'falcon-heavy' | 'sls' | 'starship' | 'custom';

export interface MissionParameters {
  crewSize: number;
  missionDuration: number; // in days
  destination: Destination;
  launchVehicle: LaunchVehicle;
  payloadConstraints: {
    maxDiameter: number; // meters
    maxLength: number; // meters
    maxMass: number; // kg
  };
}

export interface HabitatConfig {
  shape: HabitatShape;
  radius: number;
  height?: number; // Only for cylinder
  volume: number;
  levels?: number; // For multi-level habitats
  mission: MissionParameters;
}

export interface HabitatStats {
  totalVolume: number;
  usedVolume: number;
  freeVolume: number;
  usagePercentage: number;
  crewVolumePerPerson: number;
  complianceScore: number; // 0-100 based on NASA guidelines
  warnings: string[];
}

