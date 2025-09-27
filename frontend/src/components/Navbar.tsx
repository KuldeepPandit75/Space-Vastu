// src/components/Navbar.tsx
import React from "react";

interface Props {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const Navbar: React.FC<Props> = ({ onLoginClick, onSignupClick }) => {
  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-trasparent text-white fixed top-0 left-0 z-50 shadow-md">
      <div className="text-2xl font-bold">SpaceVastu</div>
      <div className="flex gap-4">
        <button
          onClick={onLoginClick}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          Login
        </button>
        <button
          onClick={onSignupClick}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
