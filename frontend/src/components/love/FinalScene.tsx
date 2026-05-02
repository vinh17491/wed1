import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { triggerHaptic } from '../../core/animations';

interface FinalSceneProps {
  onRestart: () => void;
}

export const FinalScene: React.FC<FinalSceneProps> = ({ onRestart }) => {
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [hugged, setHugged] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowFirst(true), 1500);
    const timer2 = setTimeout(() => setShowSecond(true), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleHug = () => {
    triggerHaptic();
    setHugged(true);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#101828] to-[#1a2333] text-[#fff8f0] flex flex-col items-center justify-center px-6 relative overflow-hidden text-center">
      {/* Star Rain effect if hugged */}
      {hugged && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-200 text-lg"
              style={{ left: `${Math.random() * 100}%` }}
              initial={{ y: '-5vh', opacity: 1 }}
              animate={{
                y: '105vh',
                opacity: [1, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: 'linear',
                repeat: Infinity
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      <div className="max-w-md space-y-8 z-20">
        <div className="h-24 flex items-center justify-center">
          {showFirst && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl md:text-3xl font-light tracking-wide text-cream-100 italic leading-snug"
            >
              "Không cần ngày đặc biệt."
            </motion.h2>
          )}
        </div>

        <div className="h-32 flex flex-col items-center justify-center">
          {showSecond && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-4"
            >
              <p className="text-xl font-light text-gray-300">Vì có em...</p>
              <p className="text-2xl md:text-3xl font-semibold text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.3)]">
                Ngày nào cũng đặc biệt. ✨
              </p>
            </motion.div>
          )}
        </div>

        {/* Bears SVG Container */}
        <div className="h-40 flex items-center justify-center relative mb-4">
          {hugged ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="text-8xl select-none"
            >
              🧸❤️🧸
            </motion.div>
          ) : (
            <div className="flex items-center gap-12 text-6xl select-none">
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                🧸
              </motion.span>
              <span className="text-3xl opacity-40 text-pink-300">...</span>
              <motion.span animate={{ x: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}>
                🧸
              </motion.span>
            </div>
          )}
        </div>

        {showSecond && (
          <div className="flex flex-col items-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHug}
              className={`px-10 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 text-base focus:outline-none ${
                hugged
                  ? 'bg-green-500 text-white shadow-green-500/20'
                  : 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink-500/30'
              }`}
            >
              {hugged ? 'Đã ôm anh thật chặt 🤍' : 'Ôm anh cái nào 🤍'}
            </motion.button>

            <button
              onClick={onRestart}
              className="text-gray-400 hover:text-gray-300 text-sm mt-4 focus:outline-none hover:underline underline-offset-4"
            >
              Xem lại từ đầu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
