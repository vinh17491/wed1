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
  const [floatingMemes, setFloatingMemes] = useState<{ id: number; x: number; y: number; src: string }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const sadCats = [
    "https://github.com/NikhilMarko03/resources/blob/main/sad1.gif?raw=true",
    "https://media.tenor.com/9413ffc5a11722a3cc456a88810750bd/tenor.gif",
    "https://media.tenor.com/BP70qe8X0J8AAAAC/crycat-crying-cat.gif",
    "https://media.tenor.com/a0554662ae7c3c60c0a7fdadac74ef18/tenor.gif"
  ];

  const noPhrases = [
    "Không 😏",
    "Chắc chưa nè? 🥺",
    "Em lỡ lòng nào bấm KHÔNG... 😭",
    "Anh đang khóc ròng rồi này 💔",
    "Nhi mipmap ơi, tha cho anh mà",
    "Bấm CÓ ngay đi thôiii"
  ];

  const [currentCat, setCurrentCat] = useState<string | null>("https://github.com/NikhilMarko03/resources/blob/main/happy1.gif?raw=true");

  const handleNoClick = () => {
    triggerHaptic();
    const nextNoCount = noCount + 1;
    setNoCount(nextNoCount);
    setYesScale((prev) => prev + 0.2); 

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

    // Dodging movement bounds
    const containerWidth = Math.min(window.innerWidth * 0.6, 300);
    const containerHeight = 150;
    const randomX = (Math.random() - 0.5) * containerWidth;
    const randomY = (Math.random() - 0.5) * containerHeight;

    setNoPosition({ x: randomX, y: randomY });
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
        className="text-center z-20 max-w-md flex flex-col items-center"
      >
        {/* Meme Cat Image display area */}
        <div className="w-64 h-64 mb-8 flex items-center justify-center relative bg-pink-100/10 rounded-3xl border border-pink-200 overflow-hidden shadow-inner">
          {currentCat ? (
            <motion.img
              key={currentCat}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={currentCat}
              alt="Sad Cat Meme"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-32 h-32 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-[#9b6b43] mb-12 leading-snug h-24 flex items-center justify-center px-2">
          {noCount > 0 
            ? noPhrases[Math.min(noCount - 1, noPhrases.length - 1)] 
            : "Hôm nay em có muốn nhận chút yêu thương không?"
          }
        </h2>

        {!isFinished && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative min-h-[180px] w-full max-w-xs mt-4">
            <motion.button
              style={{ scale: yesScale }}
              whileHover={{ scale: yesScale * 1.05 }}
              whileTap={{ scale: yesScale * 0.95 }}
              onClick={handleYesClick}
              className="px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-300/50 transition-all duration-200 z-30 focus:outline-none min-h-[48px] text-base"
            >
              Có chứ 💖
            </motion.button>

            <motion.button
              animate={{ x: noPosition.x, y: noPosition.y }}
              transition={{ type: 'spring', damping: 12, stiffness: 100 }}
              onClick={handleNoClick}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium rounded-full border border-gray-300 z-20 min-h-[48px] text-base md:absolute shadow-sm"
            >
              Không 😏
            </motion.button>
          </div>
        )}

        {isFinished && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold text-pink-500 mt-6 z-30 drop-shadow-sm select-none animate-bounce"
          >
            Yê! Moazzz 💋
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
