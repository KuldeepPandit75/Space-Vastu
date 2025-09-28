'use client';

import { useState, useRef } from 'react';
import { useHabitat } from '@/contexts/HabitatContext';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { importDesign } = useHabitat();
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setImportStatus({
        type: 'error',
        message: 'Please select a valid JSON file'
      });
      return;
    }

    setImporting(true);
    setImportStatus({ type: null, message: '' });

    try {
      const text = await file.text();
      const designData = JSON.parse(text);
      
      const success = importDesign(designData);
      
      if (success) {
        setImportStatus({
          type: 'success',
          message: `Successfully imported design: ${designData.metadata?.name || 'Unnamed Design'}`
        });
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setImportStatus({
          type: 'error',
          message: 'Failed to import design. Please check the file format.'
        });
      }
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Invalid JSON file or corrupted design data'
      });
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl border border-gray-600 p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Import Habitat Design</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-white bg-gray-700'
              : 'border-gray-500 hover:border-gray-400 hover:bg-gray-700/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-4xl mb-4">📁</div>
          <h4 className="text-white font-medium mb-2">
            Drop your design file here
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            or click to browse for a JSON file
          </p>
          
          <button
            onClick={handleBrowseClick}
            disabled={importing}
            className="px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? 'Importing...' : 'Browse Files'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Status Messages */}
        {importStatus.type && (
          <div className={`mt-4 p-4 rounded-lg border ${
            importStatus.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <div className="flex items-center space-x-2">
              <span>
                {importStatus.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="text-sm">{importStatus.message}</span>
            </div>
          </div>
        )}

        {/* Import Progress */}
        {importing && (
          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span className="text-gray-300 text-sm">Processing design file...</span>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-500">
          <h5 className="text-white font-medium mb-2 flex items-center">
            <span className="mr-2">💡</span>
            Import Guidelines
          </h5>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Only JSON files exported from this tool are supported</li>
            <li>• Invalid modules will be skipped during import</li>
            <li>• Current design will be replaced with imported design</li>
            <li>• Make sure to export your current design before importing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}