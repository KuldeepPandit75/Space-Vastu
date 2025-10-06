// src/components/LandingPage.tsx (Updated)
"use client";

import Spline from '@splinetool/react-spline';
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Image from 'next/image';

interface Props {
  nextStep: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const LandingPage: React.FC<Props> = ({ nextStep, onLoginClick, onSignupClick }) => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden z-20">
      
      {/* Navbar */}
      <Navbar onLoginClick={onLoginClick} onSignupClick={onSignupClick} />

      {/* Main content */}
      <div className="flex flex-col-reverse md:flex-row min-h-screen pt-4">
        
        {/* Left content */}
        <motion.div
          className="relative z-10 flex-1 flex flex-col items-start justify-center p-12 md:w-1/2" 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Heading Image */}
          <Image
            src="/welcome.png" 
            alt="Welcome to SpaceVastu"
            width={500} 
            height={150} 
            priority 
            className="mb-2 max-w-full h-auto" 
          />

          {/* Paragraph */}
          <p className="mb-5 max-w-lg text-m font-light text-left pl-1 text-purple-100">
            Embark on an interactive space journey—plan missions, explore planets, and let your inner astronaut take flight!
          </p>

          {/* Buttons aligned left */}
          <div className="flex flex-row gap-4">
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-blue-500 transition duration-300 shadow-xl shadow-blue-500/40 uppercase  text-m"
            >
              START MISSION
            </button>
            
            <button
              onClick={() => console.log('Learn More clicked')} 
              className="px-6 py-3 bg-gray-800/70 rounded-xl hover:bg-gray-700 transition duration-300 border border-gray-600 uppercase text-m"
            >
              LEARN MORE
            </button>
          </div>
        </motion.div>

        {/* Right Spline scene */}
        <div className="flex-1 relative w-full h-96 md:h-full md:w-1/2 md:absolute md:inset-y-0 md:right-0"> 
          <Spline
            scene="https://prod.spline.design/50FAQC2wmw6BTLvv/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
