import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../core/animations';

interface LoveGameProps {
  onSuccess: () => void;
}

export const LoveGame: React.FC<LoveGameProps> = ({ onSuccess }) => {
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [noCount, setNoCount] = useState(0);
  const [burstHearts, setBurstHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [floatingMemes, setFloatingMemes] = useState<{ id: number; x: number; y: number; src: string }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const sadCats = [
    "https://github.com/NikhilMarko03/resources/blob/main/sad1.gif?raw=true",
    "https://media.tenor.com/9413ffc5a11722a3cc456a88810750bd/tenor.gif",
    "https://media.tenor.com/BP70qe8X0J8AAAAC/crycat-crying-cat.gif",
    "https://media.tenor.com/a0554662ae7c3c60c0a7fdadac74ef18/tenor.gif"
  ];

  const noPhrases = [
    "Chắc chưa 😼",
    "Suy nghĩ lại nha 🐱",
    "Bấm nhầm đúng không 😹",
    "Anh chờ em bấm Có đó 😽"
  ];

  const [currentCat, setCurrentCat] = useState<string | null>("https://github.com/NikhilMarko03/resources/blob/main/happy1.gif?raw=true");

  const handleNoClick = () => {
    triggerHaptic();
    const nextNoCount = noCount + 1;
    setNoCount(nextNoCount);

    // Scale transitions
    setYesScale((prev) => Math.min(prev + 0.15, 1.9));
    setNoScale((prev) => Math.max(prev - 0.1, 0.45));

    // Choose a random cat meme
    const randomCat = sadCats[Math.floor(Math.random() * sadCats.length)];
    setCurrentCat(randomCat);

    // Spawn floating memes everywhere
    const newMemes = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      src: sadCats[Math.floor(Math.random() * sadCats.length)]
    }));
    setFloatingMemes(newMemes);
  };

  const handleYesClick = (e: React.MouseEvent) => {
    triggerHaptic();
    setIsFinished(true);
    setCurrentCat("https://github.com/NikhilMarko03/resources/blob/main/happy3.gif?raw=true");

    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX + (Math.random() - 0.5) * 120,
      y: e.clientY + (Math.random() - 0.5) * 120
    }));
    setBurstHearts(newHearts);

    setTimeout(() => {
      onSuccess();
    }, 1800);
  };

  return (
    <div className="min-h-[100dvh] bg-[#fff8f0] text-[#9b6b43] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Bursting hearts */}
      <AnimatePresence>
        {burstHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="fixed text-4xl pointer-events-none z-40"
            style={{ left: heart.x, top: heart.y }}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{
              opacity: 0,
              scale: 2,
              y: -150,
              x: (Math.random() - 0.5) * 120
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            💖
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Meme Cats */}
      <AnimatePresence>
        {floatingMemes.map((meme) => (
          <motion.img
            key={meme.id}
            src={meme.src}
            alt="Floating Cat"
            className="fixed w-32 h-32 object-cover pointer-events-none z-10 rounded-2xl shadow-lg border border-pink-300/30"
            style={{ left: meme.x, top: meme.y }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-20 max-w-md flex flex-col items-center bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-pink-100"
      >
        {/* Meme Cat Image display area */}
        <div className="w-64 h-64 mb-8 flex items-center justify-center relative bg-pink-50/30 rounded-2xl border border-pink-100 overflow-hidden shadow-inner">
          {currentCat && (
            <motion.img
              key={currentCat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={currentCat}
              alt="Cat Meme"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-[#9b6b43] mb-6 leading-snug min-h-[3rem] flex items-center justify-center px-2">
          {noCount > 0 
            ? noPhrases[Math.min(noCount - 1, noPhrases.length - 1)] 
            : "Em có muốn đi tiếp cùng anh không?"
          }
        </h2>

        {noCount > 0 && (
          <p className="text-sm text-pink-400 font-medium mb-8">
            Chọn kỹ nha 😼
          </p>
        )}

        {!isFinished && (
          <div className="flex flex-row items-center justify-center gap-6 relative w-full mt-4">
            <motion.button
              style={{ scale: yesScale }}
              whileHover={{ scale: yesScale * 1.05 }}
              whileTap={{ scale: yesScale * 0.95 }}
              onClick={handleYesClick}
              className="px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-300/50 z-30 focus:outline-none text-base transition-all duration-150"
            >
              Có chứ 💖
            </motion.button>

            <motion.button
              style={{ scale: noScale }}
              whileHover={{ scale: noScale * 1.05 }}
              whileTap={{ scale: noScale * 0.95 }}
              onClick={handleNoClick}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium rounded-full border border-gray-300 z-20 focus:outline-none text-base transition-all duration-150 shadow-sm"
            >
              Không 😏
            </motion.button>
          </div>
        )}

        {isFinished && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold text-pink-500 mt-6 z-30 animate-bounce select-none"
          >
            Yê! Moazzz 💋
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
