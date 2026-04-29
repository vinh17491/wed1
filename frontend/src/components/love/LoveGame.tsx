import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../utils/emotionEngine';

interface LoveGameProps {
  onSuccess: () => void;
}

export const LoveGame: React.FC<LoveGameProps> = ({ onSuccess }) => {
  const [yesScale, setYesScale] = useState(1);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [burstHearts, setBurstHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const noPhrases = [
    "Không 😏",
    "Chắc chưa nè?",
    "Nghĩ lại đi mà...",
    "Đừng bấm nữa mà 🥺",
    "Anh buồn đóoo",
    "Nhi mipmap ơi, bấm CÓ đi!"
  ];

  const handleNoClick = () => {
    setNoCount((prev) => prev + 1);
    setYesScale((prev) => prev + 0.15);

    // Random movement
    const containerWidth = Math.min(window.innerWidth * 0.8, 350);
    const containerHeight = 200;
    const randomX = (Math.random() - 0.5) * containerWidth;
    const randomY = (Math.random() - 0.5) * containerHeight;

    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = (e: React.MouseEvent) => {
    triggerHaptic();
    setIsFinished(true);

    // Create a heart burst effect at click position
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX + (Math.random() - 0.5) * 100,
      y: e.clientY + (Math.random() - 0.5) * 100
    }));
    setBurstHearts(newHearts);

    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-[100dvh] bg-[#fff8f0] text-[#9b6b43] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Bursting hearts animation */}
      <AnimatePresence>
        {burstHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="fixed text-3xl pointer-events-none z-40"
            style={{ left: heart.x, top: heart.y }}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{
              opacity: 0,
              scale: 1.5,
              y: -100,
              x: (Math.random() - 0.5) * 100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            💖
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-20 max-w-md flex flex-col items-center"
      >
        {/* Cute brown bear avatar placeholder (SVG) */}
        <svg className="w-32 h-32 mb-6 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>

        <h2 className="text-2xl md:text-3xl font-semibold text-[#9b6b43] mb-12 leading-snug">
          Hôm nay em có muốn nhận chút yêu thương không?
        </h2>

        {!isFinished && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative min-h-[150px] w-full max-w-xs">
            <motion.button
              style={{ scale: yesScale }}
              whileHover={{ scale: yesScale * 1.05 }}
              whileTap={{ scale: yesScale * 0.95 }}
              onClick={handleYesClick}
              className="px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-full shadow-lg shadow-pink-300/50 transition-colors duration-200 z-30 focus:outline-none min-h-[48px] text-base"
            >
              Có chứ 💖
            </motion.button>

            <motion.button
              animate={{ x: noPosition.x, y: noPosition.y }}
              transition={{ type: 'spring', damping: 12, stiffness: 100 }}
              onClick={handleNoClick}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium rounded-full border border-gray-300 z-20 min-h-[48px] text-base md:absolute"
            >
              {noPhrases[Math.min(noCount, noPhrases.length - 1)]}
            </motion.button>
          </div>
        )}

        {isFinished && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-semibold text-pink-500 mt-6 z-30"
          >
            Yê! Moazzz 💋
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
