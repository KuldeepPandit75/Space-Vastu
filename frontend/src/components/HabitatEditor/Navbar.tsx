import { motion } from "framer-motion";
import { User } from "lucide-react"; 
import React from "react"; 

interface Props {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const Navbar: React.FC<Props> = ({ onLoginClick, onSignupClick }) => {
  const navVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 w-full z-50 p-3 backdrop-blur-md bg-black/50 border-b border-blue-400/30 shadow-lg"
    >
      {/* Full-width flex container */}
      <div className="flex justify-between items-center w-full px-6">
        {/* Logo / Title on extreme left */}
        <h1
          className="text-2xl font-extrabold cursor-pointer transition 
                     bg-clip-text text-transparent 
                     bg-gradient-to-r from-blue-400 via-pink-500 to-purple-600 
                     hover:brightness-125"
        >
          SPACEVASTU
        </h1>
      </div>
    </motion.nav>
  );
};

export default Navbar;
