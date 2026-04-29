import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { memoryCards } from '../../data/loveData';

interface MemoryCardsProps {
  onNext: () => void;
}

export const MemoryCards: React.FC<MemoryCardsProps> = ({ onNext }) => {
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    if (!flippedIndices.includes(index)) {
      setFlippedIndices([...flippedIndices, index]);
    }
  };

  const canProceed = flippedIndices.length >= 8;

  return (
    <div className="min-h-[100dvh] bg-[#ffd6e7]/30 text-[#9b6b43] py-12 px-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-md mb-8 mt-4 z-20"
      >
        <h2 className="text-2xl font-semibold mb-2">Những mảnh ghép nhỏ nhắn...</h2>
        <p className="text-sm text-gray-600">Chạm để mở khóa những điều làm tim anh rung động (Mở ít nhất 8 thẻ nhé! ✨)</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl w-full z-20 mb-24">
        {memoryCards.map((text, index) => {
          const isFlipped = flippedIndices.includes(index);
          return (
            <div
              key={index}
              className="h-32 cursor-pointer perspective-1000"
              onClick={() => handleCardClick(index)}
            >
              <motion.div
                className="relative w-full h-full transition-all duration-500 transform-style-3d"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
              >
                {/* Card Front */}
                <div className="absolute inset-0 bg-[#fff8f0] rounded-2xl flex items-center justify-center p-2 border border-pink-200 shadow-md shadow-pink-200/20 backface-hidden">
                  <span className="text-2xl text-pink-400 animate-pulse">💖</span>
                </div>

                {/* Card Back */}
                <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center p-3 text-center border border-pink-300 shadow-sm transform rotateY-180 backface-hidden">
                  <p className="text-xs md:text-sm font-medium text-gray-800 leading-snug">
                    {text}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {canProceed && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="fixed bottom-8 px-10 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-400/40 z-30 focus:outline-none text-base"
        >
          Tiếp tục hành trình 🐾
        </motion.button>
      )}

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotateY-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};
