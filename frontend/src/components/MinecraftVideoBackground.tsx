import React from 'react';
import Minecraft3DAnimals from './Minecraft3DAnimals';

const MinecraftVideoBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover opacity-80"
      >
        <source src="/assets/videoplayback.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 z-10 bg-black/30 backdrop-blur-[1px] pointer-events-none" />
      
      {/* 3D Animated Animals Overlay */}
      <Minecraft3DAnimals />
    </div>
  );
};

export default MinecraftVideoBackground;
