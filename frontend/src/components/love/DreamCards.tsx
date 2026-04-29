import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dreamCards } from '../../data/loveData';

interface DreamCardsProps {
  onNext: () => void;
}

export const DreamCards: React.FC<DreamCardsProps> = ({ onNext }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openedCount, setOpenedCount] = useState<number[]>([]);

  const handleCardClick = (index: number) => {
    setSelectedId(index);
    if (!openedCount.includes(index)) {
      setOpenedCount((prev) => [...prev, index]);
    }
  };

  const canProceed = openedCount.length >= 3;

  return (
    <div className="min-h-[100dvh] bg-[#fff8f0] text-[#9b6b43] py-16 px-6 flex flex-col items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center max-w-md mb-12 z-20 mt-4"
      >
        <h2 className="text-2xl font-semibold mb-2 text-[#9b6b43]">Những giấc mơ nhỏ bé...</h2>
        <p className="text-sm text-gray-600">Tương lai mà anh muốn vẽ nên cùng em (Xem ít nhất 3 mục nhé! ☁️)</p>
      </motion.div>

      {/* Cards layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full z-20 mb-16 px-4">
        {dreamCards.map((card, index) => (
          <motion.div
            key={index}
            layoutId={`card-${index}`}
            onClick={() => handleCardClick(index)}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            className="p-6 bg-white border border-pink-100 rounded-2xl shadow-md cursor-pointer flex flex-col items-center text-center justify-center min-h-[150px] transition-shadow hover:shadow-lg"
          >
            <span className="text-4xl mb-4 block select-none">
              {card.title.slice(-2)}
            </span>
            <h3 className="text-base font-semibold text-gray-800">
              {card.title.slice(0, -3)}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedId !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setSelectedId(null)}
            />
            <motion.div
              layoutId={`card-${selectedId}`}
              className="bg-[#fff8f0] rounded-2xl p-8 max-w-md w-full shadow-2xl z-50 border-2 border-pink-200 text-center relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl focus:outline-none"
                onClick={() => setSelectedId(null)}
              >
                ✕
              </button>
              <span className="text-5xl mb-6 block select-none">
                {dreamCards[selectedId].title.slice(-2)}
              </span>
              <h3 className="text-xl font-bold text-[#9b6b43] mb-4">
                {dreamCards[selectedId].title.slice(0, -3)}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                {dreamCards[selectedId].desc}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {canProceed && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="fixed bottom-8 px-10 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-400/30 z-30 focus:outline-none text-base"
        >
          Tiếp bước thôi 🐾
        </motion.button>
      )}
    </div>
  );
};
