'use client';

import { useRef } from 'react';
import { Grid, useTexture } from '@react-three/drei';
import { Mesh, BufferGeometry, BufferGeometryEventMap, Material, NormalBufferAttributes, Object3DEventMap } from 'three';
import * as THREE from 'three';
import { useHabitat } from '@/contexts/HabitatContext';
import DraggableModule from './DraggableModule';
import LandingSite from './LandingSite';

export default function Scene3D() {
  const gridRef = useRef<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap>>(null);
  const capsuleRef = useRef<Mesh>(null);
  const { modules, updateModule, setSelectedModuleId, habitatConfig } = useHabitat();
  
  // Load NASA logo texture
  const nasaLogoTexture = useTexture('/NASA-Logo-Large.png');
  
  // Calculate capsule position to maintain fixed gap from lunar surface
  const fixedGapFromSurface = -3.8; // Fixed gap in units (reduced from 2)
  const capsuleRadius = habitatConfig.radius;
  const capsuleYPosition = fixedGapFromSurface + capsuleRadius;

  const handlePointerDown = (event: React.PointerEvent) => {
    // If clicking on empty space (not on a module), deselect all modules
    // Only deselect if we're clicking on the group itself, not on child elements
    if (event.target === event.currentTarget) {
      console.log('Clicked on empty space - deselecting modules');
      setSelectedModuleId(null);
    }
  };

  const handleGridClick = () => {
    // Also deselect when clicking on the grid
    console.log('Clicked on grid - deselecting modules');
    setSelectedModuleId(null);
  };

  const handleCapsuleClick = () => {
    // Also deselect when clicking on the capsule
    console.log('Clicked on capsule - deselecting modules');
    setSelectedModuleId(null);
  };

  // Rotate the capsule slowly
//   useFrame((state, delta) => {
//     if (capsuleRef.current) {
//       capsuleRef.current.rotation.y += delta * 0.2;
//     }
//   });

  return (
    <group onPointerDown={handlePointerDown}>
      {/* Reference Grid */}
      <Grid
        ref={gridRef as React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, Material | Material[], Object3DEventMap>>}
        position={[0, -5, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4edd"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
        onPointerDown={handleGridClick}
      />
      
      {/* Simple Silver Metallic Capsule */}
      <group ref={capsuleRef} position={[0, capsuleYPosition, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* Main cylindrical body */}
        <mesh position={[0, 0, 0]} onPointerDown={handleCapsuleClick}>
          <cylinderGeometry args={[habitatConfig.radius, habitatConfig.radius, habitatConfig.height || 10, 16, 1, true]} />
          <meshStandardMaterial 
            color="#fff" 
            metalness={0.3} 
            roughness={0.2}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.8}
            // wireframe={true}
          />
        </mesh>
        
        {/* Front hemisphere - open ended */}
        <mesh position={[0, (habitatConfig.height || 10) / 2, 0]} onPointerDown={handleCapsuleClick}>
          <sphereGeometry args={[habitatConfig.radius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#fff" 
            metalness={0.3} 
            roughness={0.2}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
        
        {/* Rear hemisphere - open ended */}
        <mesh position={[0, -(habitatConfig.height || 10) / 2, 0]} rotation={[0, 0, Math.PI]} onPointerDown={handleCapsuleClick}>
          <sphereGeometry args={[habitatConfig.radius, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#fff" 
            metalness={0.3} 
            roughness={0.2}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
        
        {/* NASA Logo on capsule wall */}
        <mesh position={[0, 0, habitatConfig.radius + 0.01]} rotation={[0, 0, 0]} onPointerDown={handleCapsuleClick}>
          <planeGeometry args={[3, 2.5]} />
          <meshStandardMaterial 
            map={nasaLogoTexture}
            transparent={true}
            opacity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Landing Site STL Model */}
      <LandingSite />

      {/* Draggable Modules */}
      {modules.map((module) => (
        <DraggableModule
          key={module.id}
          module={module}
          onUpdate={updateModule}
        />
      ))}
    </group>
  );
}
