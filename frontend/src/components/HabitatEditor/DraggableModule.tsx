'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, Plane, Raycaster } from 'three';
import { Text } from '@react-three/drei';
import { Module } from '@/types/module';
import { useHabitat } from '@/contexts/HabitatContext';

interface DraggableModuleProps {
  module: Module;
  onUpdate: (id: string, updates: Partial<Module>) => void;
}

// Helper function to get material properties based on module type
const getModuleMaterialProps = (type: string) => {
  switch (type) {
    case 'sleep':
      return { metalness: 0.1, roughness: 0.8 }; // Soft, fabric-like
    case 'food':
      return { metalness: 0.4, roughness: 0.3 }; // Clean, metallic
    case 'medical':
      return { metalness: 0.2, roughness: 0.2 }; // Clean, sterile
    case 'exercise':
      return { metalness: 0.6, roughness: 0.4 }; // Robust, metallic
    case 'storage':
      return { metalness: 0.8, roughness: 0.6 }; // Industrial, rough
    case 'hygiene':
      return { metalness: 0.3, roughness: 0.1 }; // Smooth, clean
    case 'workstation':
      return { metalness: 0.5, roughness: 0.3 }; // Tech, smooth
    case 'recreation':
      return { metalness: 0.2, roughness: 0.7 }; // Comfortable, soft
    case 'airlock':
      return { metalness: 0.9, roughness: 0.2 }; // Heavy duty, metallic
    case 'life-support':
      return { metalness: 0.8, roughness: 0.4 }; // Industrial, technical
    case 'communication':
      return { metalness: 0.6, roughness: 0.2 }; // High-tech, smooth
    case 'maintenance':
      return { metalness: 0.7, roughness: 0.8 }; // Rough, industrial
    case 'laboratory':
      return { metalness: 0.3, roughness: 0.1 }; // Clean, precise
    case 'greenhouse':
      return { metalness: 0.1, roughness: 0.3 }; // Natural, translucent
    default:
      return { metalness: 0.3, roughness: 0.4 };
  }
};

export default function DraggableModule({ module, onUpdate }: DraggableModuleProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ 
    mouseX: number; 
    mouseY: number; 
    moduleX: number; 
    moduleY: number; 
    moduleZ: number;
    initialPosition: Vector3;
  } | null>(null);
  const [constraintViolated, setConstraintViolated] = useState(false);
  const [verticalOffset, setVerticalOffset] = useState(0);
  
  const { selectedModuleId, setSelectedModuleId, habitatConfig } = useHabitat();
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

    const handleWheel = (event: WheelEvent) => {
      if (isSelected) {
        event.preventDefault();
        const deltaY = event.deltaY;
        const sensitivity = 0.1;
        const newOffset = verticalOffset + (deltaY > 0 ? -sensitivity : sensitivity);
        setVerticalOffset(newOffset);
        
        // Update module position with vertical offset
        const newPosition = [
          module.position[0],
          module.position[1] + (newOffset - verticalOffset),
          module.position[2]
        ] as [number, number, number];
        
        onUpdate(module.id, { position: newPosition });
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isDragging, isSelected, verticalOffset, module.position, onUpdate, module.id]);

  // Constraint checking functions
  const isWithinCapsule = (position: [number, number, number], size: [number, number, number]) => {
    const [x, y, z] = position;
    const [width, height, depth] = size;
    
    const radius = habitatConfig.radius;
    const halfHeight = (habitatConfig.height || 10) / 2;
    
    // Check if module is within the capsule (cylinder + hemispheres)
    const distanceFromCenter = Math.sqrt(x * x + z * z);
    
    // For cylindrical section
    if (Math.abs(y) <= halfHeight - radius) {
      const maxRadius = radius - Math.max(width, depth) / 2;
      return distanceFromCenter <= maxRadius;
    }
    
    // For hemispherical sections
    const hemisphereY = Math.abs(y) - (halfHeight - radius);
    const hemisphereRadius = Math.sqrt(radius * radius - hemisphereY * hemisphereY);
    const maxRadius = hemisphereRadius - Math.max(width, depth) / 2;
    
    return distanceFromCenter <= maxRadius && hemisphereY <= radius;
  };

  const checkCollision = (position: [number, number, number], size: [number, number, number]) => {
    const [x, y, z] = position;
    const [width, height, depth] = size;
    
    // This would need access to other modules - for now, we'll rely on the context constraints
    return false;
  };

  useFrame((state) => {
    if (isDragging && isSelected && meshRef.current && dragStart) {
      // Create a plane at the module's height for intersection
      const plane = new Plane(new Vector3(0, 1, 0), -dragStart.initialPosition.y);
      
      // Create raycaster from camera through mouse position
      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, camera);
      
      // Find intersection with the plane
      const intersectionPoint = new Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      
      if (intersectionPoint) {
        // Calculate the offset from the initial drag point
        const offset = intersectionPoint.clone().sub(dragStart.initialPosition);
        
        // Apply the offset to the original module position
        const newPosition = [
          dragStart.moduleX + offset.x,
          dragStart.moduleY + offset.y,
          dragStart.moduleZ + offset.z
        ] as [number, number, number];
        
        // Check constraints for visual feedback (capsule bounds only)
        const withinCapsule = isWithinCapsule(newPosition, module.size);
        // Collision detection disabled - only check capsule bounds
        setConstraintViolated(!withinCapsule);
        
        onUpdate(module.id, { position: newPosition });
      }
    }
  });

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    
    console.log('Module clicked:', module.id, 'isSelected:', isSelected);
    console.log('Setting selected module to:', module.id);
    
    // Select this module
    setSelectedModuleId(module.id);
    setHovered(true);
    
    // Create a plane at the module's height for intersection
    const plane = new Plane(new Vector3(0, 1, 0), -module.position[1]);
    
    // Create raycaster from camera through mouse position
    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Find intersection with the plane
    const intersectionPoint = new Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    
    // Don't start dragging immediately - wait for mouse movement
    setDragStart({ 
      mouseX: mouse.x, 
      mouseY: mouse.y,
      moduleX: module.position[0],
      moduleY: module.position[1],
      moduleZ: module.position[2],
      initialPosition: intersectionPoint || new Vector3(module.position[0], module.position[1], module.position[2])
    });
  };

  const handlePointerUp = (event: any) => {
    event.stopPropagation();
    setIsDragging(false);
    setHovered(false);
    setDragStart(null);
    setConstraintViolated(false);
  };

  const handlePointerMove = (event: any) => {
    if (dragStart && !isDragging) {
      // Start dragging when mouse moves while holding down
      const deltaX = Math.abs(mouse.x - dragStart.mouseX);
      const deltaY = Math.abs(mouse.y - dragStart.mouseY);
      
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
    <group>
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
          color={constraintViolated ? '#ff4444' : module.color}
          metalness={getModuleMaterialProps(module.type).metalness}
          roughness={getModuleMaterialProps(module.type).roughness}
          opacity={hovered ? 0.8 : 0.9}
          transparent={true}
          emissive={isSelected ? '#ffffff' : (constraintViolated ? '#ff0000' : '#000000')}
          emissiveIntensity={isSelected ? 0.2 : (constraintViolated ? 0.3 : 0)}
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
              color={constraintViolated ? "#ff0000" : "#00ff00"}
              transparent={true}
              opacity={0.4}
              wireframe={true}
            />
          </mesh>
        )}
      </mesh>

      {/* Module Label */}
      <Text
        position={[module.position[0], module.position[1] + module.size[1]/2 + 0.3, module.position[2]]}
        fontSize={0.25}
        color={isSelected ? "#00ff00" : "#ffffff"}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {module.type.replace('-', ' ').toUpperCase()}
      </Text>

      {/* Dimensions Label (when selected) */}
      {isSelected && (
        <Text
          position={[module.position[0], module.position[1] - module.size[1]/2 - 0.3, module.position[2]]}
          fontSize={0.2}
          color="#00ff00"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {`${module.size[0]}×${module.size[1]}×${module.size[2]}m`}
        </Text>
      )}
      
      {/* Vertical movement indicator */}
      {isSelected && (
        <group>
          {/* Height line from ground to module */}
          <mesh position={[module.position[0], (module.position[1] - 5) / 2, module.position[2]]}>
            <cylinderGeometry args={[0.02, 0.02, Math.abs(module.position[1] + 5), 8]} />
            <meshBasicMaterial
              color="#00ff00"
              transparent={true}
              opacity={0.6}
            />
          </mesh>
          
          {/* Height indicator text */}
          <Text
            position={[module.position[0] + module.size[0] / 2 + 0.5, module.position[1], module.position[2]]}
            fontSize={0.25}
            color="#00ff00"
            anchorX="left"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {`Y: ${module.position[1].toFixed(1)}m`}
          </Text>
        </group>
      )}
    </group>
  );
}
