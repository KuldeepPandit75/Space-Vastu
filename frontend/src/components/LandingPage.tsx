// src/components/LandingPage.tsx
"use client";


import Spline from '@splinetool/react-spline';

import { motion } from "framer-motion";
import Navbar from "./Navbar";

interface Props {
  nextStep: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const LandingPage: React.FC<Props> = ({ nextStep, onLoginClick, onSignupClick }) => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Solid black background */}
      <div className="absolute inset-0 bg-black" />

      {/* Spline scene */}
      <Spline
        scene="https://prod.spline.design/50FAQC2wmw6BTLvv/scene.splinecode"
        className="absolute inset-0 w-full h-full"
      />

      {/* Navbar */}
      <Navbar onLoginClick={onLoginClick} onSignupClick={onSignupClick} />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-5xl mb-6">👨‍🚀 Welcome to SpaceVastu!</h1>
        <p className="mb-6 text-center max-w-md">
          I am your astronaut guide. Let’s design your space habitat mission!
        </p>
        <div className="flex gap-4">
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
          >
            Tap to Start
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-gray-600 rounded hover:bg-gray-700"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
