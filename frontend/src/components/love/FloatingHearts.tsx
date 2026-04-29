import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  color: string;
}

export const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const colors = ['#ffd6e7', '#f472b6', '#fbcfe8', '#d8c8ff'];
    let count = 0;

    const interval = setInterval(() => {
      setHearts((prev) => {
        const newHeart: Heart = {
          id: count++,
          x: Math.random() * 100,
          y: 110,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 4 + 4,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
        // Keep maximum 12 hearts
        if (prev.length >= 12) {
          return [...prev.slice(1), newHeart];
        }
        return [...prev, newHeart];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute flex items-center justify-center"
            style={{ left: `${heart.x}%` }}
            initial={{ y: '110vh', opacity: 0, scale: 0.5 }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.6, 0.6, 0],
              scale: [0.5, 1, 1, 0.8]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: heart.duration,
              ease: 'linear'
            }}
          >
            <svg
              width={heart.size}
              height={heart.size}
              viewBox="0 0 24 24"
              fill={heart.color}
              className="opacity-40 drop-shadow-sm"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
