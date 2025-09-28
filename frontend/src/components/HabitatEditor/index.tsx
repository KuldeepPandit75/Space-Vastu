'use client';

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { HabitatProvider, useHabitat } from '@/contexts/HabitatContext';
import Scene3D from './Scene3D';
import HabitatBuilder from './HabitatBuilder';
import ModuleLibrary from './ModuleLibrary';
import StatsPanel from './StatsPanel';
import ModuleDetailsModal from './ModuleDetailsModal';
import Toolbar from './Toolbar';
import QuickStartGuide from './QuickStartGuide';
import ModuleInfo from './ModuleInfo';
import AIValidation from './AIValidation';

function CanvasWithControls() {
  const { selectedModuleId } = useHabitat();
  
  return (
    <Canvas
      camera={{ position: [10, 10, 10], fov: 60 }}
      className="bg-gray-900"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Scene3D />
      <OrbitControls 
        enablePan={!selectedModuleId}
        enableZoom={!selectedModuleId}
        enableRotate={!selectedModuleId}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </Canvas>
  );
}

function HabitatEditorContent() {
  const { isModalOpen, setModalOpen, selectedModuleType, selectedModuleId, removeModule, setSelectedModuleId } = useHabitat();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete key - delete selected module
      if (event.key === 'Delete' && selectedModuleId) {
        event.preventDefault();
        removeModule(selectedModuleId);
        setSelectedModuleId(null);
      }
      
      // Escape key - close modal if open
      if (event.key === 'Escape' && isModalOpen) {
        setModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedModuleId, isModalOpen, removeModule, setSelectedModuleId, setModalOpen]);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-black">
        {/* Left Sidebar - Habitat Settings */}
        <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <HabitatBuilder />
          </div>
        </div>

        {/* Center - 3D Canvas */}
        <div className="flex-1 relative bg-black">
          <CanvasWithControls />
          <Toolbar />
        </div>

        {/* Right Sidebar - Modules & Stats */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto">
          <div className="p-6 space-y-6">
            <ModuleLibrary />
            <AIValidation />
            <ModuleInfo />
            <StatsPanel />
          </div>
        </div>
      </div>
      
      {/* Module Details Modal */}
      <ModuleDetailsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        moduleType={selectedModuleType}
      />
      
      {/* Quick Start Guide */}
      <QuickStartGuide />
    </>
  );
}

export default function HabitatEditor() {
  return (
    <HabitatProvider>
      <HabitatEditorContent />
    </HabitatProvider>
  );
}
