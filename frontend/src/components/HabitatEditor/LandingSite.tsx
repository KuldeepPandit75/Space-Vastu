'use client';

import { useRef, useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

export default function LandingSite() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    // Load the STL file
    const loader = new STLLoader();
    loader.load(
      '/landing_site.stl',
      (loadedGeometry) => {
        // Compute bounding box to understand the model dimensions
        loadedGeometry.computeBoundingBox();
        const box = loadedGeometry.boundingBox!;
        const size = box.getSize(new THREE.Vector3());
        
        console.log('STL Model dimensions:', size);
        console.log('STL Model bounding box:', box);
        
        // Center the geometry
        const center = box.getCenter(new THREE.Vector3());
        loadedGeometry.translate(-center.x, -center.y, -center.z);
        
        // Scale the geometry to appropriate size - make it larger for better visibility
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 8 / maxDimension; // Scale to fit within 8 units (larger than before)
        loadedGeometry.scale(scale, scale, scale);
        
        // Compute normals for proper lighting
        loadedGeometry.computeVertexNormals();
        
        setGeometry(loadedGeometry);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading STL:', error);
      }
    );
  }, []);

  if (!geometry) {
    return null; // Don't render anything while loading
  }

  return (
    <mesh ref={meshRef} position={[0, -4, 0]} rotation={[Math.PI / 2, Math.PI, 0]} scale={[16, 16, 1]}>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color="#666666" 
        metalness={0.1} 
        roughness={0.8}
        side={THREE.DoubleSide}
        flatShading={false}
      />
    </mesh>
  );
}
