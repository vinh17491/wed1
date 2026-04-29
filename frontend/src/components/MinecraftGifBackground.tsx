import React from 'react';

const MinecraftGifBackground: React.FC = () => {
  return (
    <>
      {/* Layer 1: Fullscreen animated GIF background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/assets/minecraft-bg.gif")',
          backgroundColor: '#1E293B' // Fallback color
        }}
      />
      {/* Layer 2: Soft dark transparent overlay for readability */}
      <div className="absolute inset-0 z-10 bg-black/25 backdrop-blur-[2px] pointer-events-none" />
    </>
  );
};

export default MinecraftGifBackground;
