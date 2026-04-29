import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../utils/emotionEngine';

interface FallingHeart {
  id: number;
  x: number;
  speed: number;
  size: number;
}

interface HeartGameProps {
  onNext: () => void;
}

export const HeartGame: React.FC<HeartGameProps> = ({ onNext }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [fallingHearts, setFallingHearts] = useState<FallingHeart[]>([]);

  const gameIntervalRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const heartCountRef = useRef(0);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setGameStarted(true);
    setFallingHearts([]);

    // Timer countdown
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          clearInterval(gameIntervalRef.current!);
          setGameOver(true);
          setGameStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn hearts
    gameIntervalRef.current = setInterval(() => {
      const newHeart: FallingHeart = {
        id: heartCountRef.current++,
        x: Math.random() * 85 + 5, // Stay inside bounds
        speed: Math.random() * 3 + 2,
        size: Math.random() * 20 + 25
      };
      setFallingHearts((prev) => [...prev, newHeart]);

      // Remove heart after animation duration
      setTimeout(() => {
        setFallingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 4000);
    }, 600);
  };

  const handleHeartTap = (id: number) => {
    triggerHaptic();
    setScore((prev) => prev + 1);
    setFallingHearts((prev) => prev.filter((h) => h.id !== id));
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, []);

  const success = score >= 20;

  return (
    <div className="min-h-[100dvh] bg-[#1a2333] text-[#fff8f0] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Star backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: '2px',
              height: '2px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {!gameStarted && !gameOver && (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center z-20 max-w-md">
          <h2 className="text-2xl md:text-3xl font-semibold text-pink-300 mb-4">Thử thách hái tim 💕</h2>
          <p className="text-gray-300 mb-8 text-sm md:text-base leading-relaxed">
            Chạm thật nhanh vào những chiếc tim rơi xuống nhé! Thu thập đủ 20 tim trong 30 giây để vượt qua thử thách.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-500/30 focus:outline-none text-base"
          >
            Bắt đầu thôi!
          </motion.button>
        </motion.div>
      )}

      {gameStarted && (
        <>
          <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-30">
            <div className="bg-[#101828]/60 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-700">
              <span className="text-gray-400 text-xs block">Thời gian</span>
              <span className="text-pink-300 font-bold text-lg">{timeLeft}s</span>
            </div>
            <div className="bg-[#101828]/60 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-700">
              <span className="text-gray-400 text-xs block">Điểm số</span>
              <span className="text-pink-300 font-bold text-lg">{score}/20</span>
            </div>
          </div>

          {/* Falling Hearts Canvas */}
          <div className="absolute inset-0 z-20 overflow-hidden">
            <AnimatePresence>
              {fallingHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  className="absolute cursor-pointer select-none flex items-center justify-center"
                  style={{ left: `${heart.x}%` }}
                  initial={{ y: '-10vh', opacity: 1 }}
                  animate={{ y: '100vh' }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: heart.speed, ease: 'linear' }}
                  onClick={() => handleHeartTap(heart.id)}
                >
                  <svg
                    width={heart.size}
                    height={heart.size}
                    viewBox="0 0 24 24"
                    fill="#f472b6"
                    className="drop-shadow-[0_0_10px_rgba(244,114,182,0.5)] hover:brightness-110 active:scale-125 transition-transform duration-100"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {gameOver && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-20 max-w-md">
          <h3 className="text-3xl font-bold mb-4 text-pink-300">Hết giờ rồi!</h3>
          <p className="text-xl text-gray-200 mb-8">
            {success ? "Certified soulmate 💞" : "Chơi lại đi, anh tin em làm được 😌"}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-full min-h-[48px] text-base focus:outline-none w-full md:w-auto"
            >
              Thử lại
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-500/30 min-h-[48px] text-base focus:outline-none w-full md:w-auto"
            >
              {success ? "Tiếp tục" : "Vẫn cứ tiếp tục"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
