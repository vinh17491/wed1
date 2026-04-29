import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onNext: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNext }) => {
  const [showText, setShowText] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(1), 2000);
    const timer2 = setTimeout(() => setShowText(2), 4500);
    const timer3 = setTimeout(() => setShowText(3), 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#101828] to-[#1a2333] flex flex-col items-center justify-center relative px-4 overflow-hidden text-[#fff8f0]">
      {/* Glowing Moon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-16 right-16 w-32 h-32 bg-yellow-100 rounded-full filter blur-2xl"
      />

      <div className="z-20 text-center space-y-8 max-w-lg">
        <div className="h-24 flex items-center justify-center">
          {showText >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-xl md:text-2xl font-light text-cream-100 italic"
            >
              "Có những ngày rất bình thường."
            </motion.p>
          )}
        </div>

        <div className="h-24 flex items-center justify-center">
          {showText >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-xl md:text-2xl font-light text-cream-100 italic"
            >
              "Cho đến khi em xuất hiện."
            </motion.p>
          )}
        </div>

        <div className="h-24 flex flex-col items-center justify-center">
          {showText >= 3 && (
            <>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="text-3xl md:text-4xl font-semibold text-pink-300 tracking-wider drop-shadow-[0_0_10px_rgba(244,114,182,0.3)]"
              >
                Nhi mipmap ✨
              </motion.h1>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-medium rounded-full shadow-lg shadow-pink-500/30 transition-all duration-300 focus:outline-none"
              >
                Chạm vào đây 💖
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
