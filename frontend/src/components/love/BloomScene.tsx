import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic } from '../../utils/emotionEngine';

interface BloomSceneProps {
  onNext: () => void;
}

export const BloomScene: React.FC<BloomSceneProps> = ({ onNext }) => {
  const [isBloomed, setIsBloomed] = useState(false);

  const handleBloom = () => {
    if (!isBloomed) {
      triggerHaptic();
      setIsBloomed(true);
    }
  };

  return (
    <div
      className="min-h-[100dvh] bg-[#101828] text-[#fff8f0] flex flex-col items-center justify-center px-6 relative cursor-pointer"
      onClick={handleBloom}
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-pink-900/20 transition-opacity duration-1000 ${isBloomed ? 'opacity-100' : 'opacity-0'}`} />

      {!isBloomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/4 text-center z-20 pointer-events-none"
        >
          <p className="text-pink-200 text-lg animate-pulse">Chạm vào màn hình nhé ✨</p>
        </motion.div>
      )}

      {/* The Flower Container */}
      <div className="relative w-64 h-64 flex items-center justify-center z-20">
        {/* Stem */}
        <div className="absolute bottom-0 w-2 bg-green-600 h-20 rounded-t-full left-1/2 -translate-x-1/2" />

        {/* Flower Bud & Petals */}
        <div className="relative w-32 h-32">
          {/* Petals */}
          {[...Array(8)].map((_, i) => {
            const angle = i * 45;
            return (
              <motion.div
                key={i}
                className="absolute top-0 left-8 w-16 h-24 bg-gradient-to-b from-pink-400 to-pink-300 rounded-full origin-bottom opacity-90 shadow-[0_0_10px_rgba(244,114,182,0.2)]"
                style={{ rotate: `${angle}deg` }}
                initial={{ scaleY: 0.4, scaleX: 0.6, y: 10 }}
                animate={
                  isBloomed
                    ? { scaleY: 1, scaleX: 1, rotate: `${angle + 20}deg`, y: 0 }
                    : { scaleY: 0.4, scaleX: 0.6, rotate: `${angle}deg`, y: 10 }
                }
                transition={{ duration: 1.5, ease: 'easeOut', delay: i * 0.1 }}
              />
            );
          })}

          {/* Center Core */}
          <motion.div
            className="absolute inset-8 bg-yellow-200 rounded-full z-30 shadow-md flex items-center justify-center"
            initial={{ scale: 0.5 }}
            animate={isBloomed ? { scale: 1 } : { scale: 0.5 }}
            transition={{ duration: 1 }}
          >
            <span className="text-xl">💛</span>
          </motion.div>
        </div>
      </div>

      {/* Text Reveal */}
      <div className="h-24 flex items-center justify-center text-center max-w-md z-20 mt-12 pointer-events-none">
        {isBloomed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <h3 className="text-xl md:text-2xl font-medium text-[#ffd36b] leading-relaxed drop-shadow-[0_0_10px_rgba(255,211,107,0.3)]">
              "Mỗi ngày có em,<br />cuộc sống anh nở hoa."
            </h3>
          </motion.div>
        )}
      </div>

      {/* Next Button */}
      {isBloomed && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent re-triggering click
            onNext();
          }}
          className="mt-8 px-10 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg z-30 focus:outline-none text-base"
        >
          Đi tiếp nào 🐾
        </motion.button>
      )}
    </div>
  );
};
