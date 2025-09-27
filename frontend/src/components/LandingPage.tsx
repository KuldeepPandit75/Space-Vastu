// src/components/LandingPage.tsx
import { motion } from "framer-motion";
import Navbar from "./Navbar";

interface Props {
  nextStep: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const LandingPage: React.FC<Props> = ({ nextStep,onLoginClick,onSignupClick }) => {
  return (
     <div className="relative min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar onLoginClick={onLoginClick} onSignupClick={onSignupClick} />

      {/* Main content */}
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-5xl mb-6">👨‍🚀 Welcome to SpaceVastu!</h1>
      <p className="mb-6 text-center max-w-md">
        I am your astronaut guide. Let’s design your space habitat mission!
      </p>
      <div className="flex gap-4">
        <button onClick={nextStep} className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700">
          Tap to Start
        </button>
        <button onClick={nextStep} className="px-6 py-3 bg-gray-600 rounded hover:bg-gray-700">
          Skip
        </button>
      </div>
    </motion.div>
    </div>
  );
};

export default LandingPage;
