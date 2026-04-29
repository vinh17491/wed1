import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onDone: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onDone }) => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Đang chuẩn bị một chút dịu êm...",
    "Dành riêng cho Nhi mipmap ✨"
  ];

  useEffect(() => {
    const textTimer = setTimeout(() => setTextIndex(1), 2500);
    const doneTimer = setTimeout(() => onDone(), 5000); // 5 seconds as requested

    return () => {
      clearTimeout(textTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#101828] text-[#fff8f0] relative overflow-hidden px-4">
      {/* Starry background effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/60 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="text-center z-20 max-w-md"
      >
        <h2 className="text-2xl font-light tracking-wide text-pink-200">
          {texts[textIndex]}
        </h2>
        <div className="mt-6 flex justify-center space-x-2">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </motion.div>
    </div>
  );
};
