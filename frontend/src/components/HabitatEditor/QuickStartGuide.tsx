'use client';

import { useState } from 'react';

export default function QuickStartGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Space Habitat Designer",
      content: "Design and validate space habitats for lunar, Mars, and deep space missions using NASA guidelines.",
      icon: "🚀"
    },
    {
      title: "Set Mission Parameters",
      content: "Start by configuring your mission: crew size, duration, destination, and launch vehicle constraints.",
      icon: "📋"
    },
    {
      title: "Choose Habitat Shape",
      content: "Select from cylindrical, spherical, toroidal, inflatable, or modular designs. Each has unique advantages.",
      icon: "🏗️"
    },
    {
      title: "Add Functional Modules",
      content: "Browse the module library and add essential areas: sleep quarters, food prep, medical bay, etc.",
      icon: "🏠"
    },
    {
      title: "Follow NASA Guidelines",
      content: "The validation panel shows compliance with NASA volume requirements and zoning best practices.",
      icon: "✅"
    },
    {
      title: "Optimize Your Design",
      content: "Use the 3D view to position modules, check adjacency rules, and maximize space efficiency.",
      icon: "🎯"
    },
    {
      title: "Export and Share",
      content: "Save your design as JSON or share it with the community for feedback and collaboration.",
      icon: "📤"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/25 transition-all hover:scale-110 z-50 group"
        title="Quick Start Guide"
      >
        <span className="text-xl group-hover:rotate-12 transition-transform">❓</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 max-w-lg w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quick Start Guide
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">{steps[currentStep].icon}</div>
          <h4 className="text-white font-semibold text-lg mb-3">{steps[currentStep].title}</h4>
          <p className="text-slate-300 text-sm leading-relaxed">{steps[currentStep].content}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125' 
                  : index < currentStep 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-slate-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          
          <span className="text-slate-400 text-sm font-medium">
            {currentStep + 1} of {steps.length}
          </span>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/25"
            >
              <span>Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/25"
            >
              <span>Get Started</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Skip option */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  );
}