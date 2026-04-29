import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  if (currentStep === 0) return null; // Hide on Loader

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 bg-nightBlue/10 backdrop-blur-sm z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-pink-400 to-pink-500 shadow-[0_0_8px_rgba(244,114,182,0.5)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
};
