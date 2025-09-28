export type ModuleType = 
  | 'sleep' 
  | 'food' 
  | 'medical' 
  | 'exercise' 
  | 'storage' 
  | 'hygiene'
  | 'workstation'
  | 'recreation'
  | 'airlock'
  | 'life-support'
  | 'communication'
  | 'maintenance'
  | 'laboratory'
  | 'greenhouse';

export type ZoneType = 'quiet' | 'active' | 'wet' | 'clean' | 'technical' | 'social';

export interface Module {
  id: string;
  type: ModuleType;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number, number]; // [length, width, height]
  volume: number;
  color: string;
  zone: ZoneType;
  level?: number; // For multi-level habitats
  requiredAdjacencies?: ModuleType[]; // Modules that should be nearby
  forbiddenAdjacencies?: ModuleType[]; // Modules that should be separated
  minVolumePerCrew?: number; // m³ per crew member
  noiseLevel: 'silent' | 'quiet' | 'moderate' | 'loud';
  isFixed?: boolean; // Cannot be moved once placed
}

export interface ModuleConfig {
  type: ModuleType;
  size: [number, number, number];
  color: string;
  volume: number;
  zone: ZoneType;
  requiredAdjacencies?: ModuleType[];
  forbiddenAdjacencies?: ModuleType[];
  minVolumePerCrew?: number;
  noiseLevel: 'silent' | 'quiet' | 'moderate' | 'loud';
  description: string;
  nasaGuidelines: string;
}