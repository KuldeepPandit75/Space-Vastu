// src/components/StarfieldBackground.tsx
import React, { ReactNode } from 'react';

// Basic CSS for a subtle starfield effect
const StarfieldBackground: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    // This is the main container for the entire screen
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* The background layer: Using Tailwind for the base black color, 
        and custom CSS for the star patterns.
        We use `fixed` so the stars don't scroll with the content.
      */}
      <div 
        className="fixed inset-0 bg-black z-0" 
        style={{
          // Custom CSS for three layers of stars
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 50px 160px, #ddd, rgba(0,0,0,0))
          `,
          backgroundSize: '150px 150px, 100px 100px, 200px 200px',
          // Optional: Add a subtle slow motion for an "ambient space" feel
          animation: 'star-drift 60s linear infinite',
        }}
      />
      
      {/* This is a dark, radial gradient overlay to make the content pop 
        and simulate deep space perspective.
      */}
      <div className="fixed inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Main content layer */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export default StarfieldBackground;

/* NOTE: You'll need to add the following keyframes to your global CSS file 
  (e.g., src/app/globals.css) for the animation to work:
  
  @keyframes star-drift {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 100% 100%;
    }
  }
*/