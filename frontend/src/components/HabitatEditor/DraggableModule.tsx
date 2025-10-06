'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { Module } from '@/types/module';
import { useHabitat } from '@/contexts/HabitatContext';

interface DraggableModuleProps {
  module: Module;
  onUpdate: (id: string, updates: Partial<Module>) => void;
}

export default function DraggableModule({ module, onUpdate }: DraggableModuleProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; z: number; moduleX: number; moduleY: number; moduleZ: number } | null>(null);
  
  const { selectedModuleId, setSelectedModuleId } = useHabitat();
  const { camera, mouse } = useThree();
  
  const isSelected = selectedModuleId === module.id;

  // Global mouse up handler to stop dragging
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        console.log('Global mouse up - stopping drag');
        setIsDragging(false);
        setHovered(false);
        setDragStart(null);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  useFrame((state) => {
    if (isDragging && isSelected && meshRef.current && dragStart) {
      // Calculate movement based on mouse delta from the original position
      const deltaX = (mouse.x - dragStart.x) * 5; // Reduced sensitivity
      const deltaY = (mouse.y - dragStart.y) * 5; // Reduced sensitivity
      
      const newPosition = [
        dragStart.moduleX + deltaX,
        dragStart.moduleY - deltaY, // Invert Y for proper movement
        dragStart.moduleZ
      ] as [number, number, number];
      
      onUpdate(module.id, { position: newPosition });
    }
  });

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    
    console.log('Module clicked:', module.id, 'isSelected:', isSelected);
    
    // Select this module
    setSelectedModuleId(module.id);
    setHovered(true);
    
    // Don't start dragging immediately - wait for mouse movement
    setDragStart({ 
      x: mouse.x, 
      y: mouse.y, 
      z: module.position[2],
      moduleX: module.position[0],
      moduleY: module.position[1],
      moduleZ: module.position[2]
    });
  };

  const handlePointerUp = (event: any) => {
    event.stopPropagation();
    setIsDragging(false);
    setHovered(false);
    setDragStart(null);
  };

  const handlePointerMove = (event: any) => {
    if (dragStart && !isDragging) {
      // Start dragging when mouse moves while holding down
      const deltaX = Math.abs(mouse.x - dragStart.x);
      const deltaY = Math.abs(mouse.y - dragStart.y);
      
      if (deltaX > 0.01 || deltaY > 0.01) {
        console.log('Starting drag for module:', module.id);
        setIsDragging(true);
      }
    }
    
    if (isDragging) {
      event.stopPropagation();
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={module.position}
      rotation={module.rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <boxGeometry args={module.size} />
      <meshStandardMaterial
        color={module.color}
        metalness={0.3}
        roughness={0.4}
        opacity={hovered ? 0.8 : 1}
        transparent={hovered}
        emissive={isSelected ? '#ffffff' : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
      
      {/* Selection outline */}
      {isSelected && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[
            module.size[0] + 0.1,
            module.size[1] + 0.1,
            module.size[2] + 0.1
          ]} />
          <meshBasicMaterial
            color="#ffff00"
            transparent={true}
            opacity={0.3}
            wireframe={true}
          />
        </mesh>
      )}
    </mesh>
  );
}
