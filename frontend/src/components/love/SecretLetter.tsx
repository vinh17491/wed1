import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../../utils/emotionEngine';

interface SecretLetterProps {
  onNext: () => void;
}

export const SecretLetter: React.FC<SecretLetterProps> = ({ onNext }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const holdIntervalRef = useRef<any>(null);

  const startHold = () => {
    setIsHolding(true);
    setProgress(0);

    holdIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current!);
          triggerHaptic();
          setIsUnlocked(true);
          return 100;
        }
        return prev + 2; // 50 steps * 100ms = 5000ms (5s)
      });
    }, 100);
  };

  const stopHold = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    // Reset if not unlocked
    if (!isUnlocked) {
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  // SVG circle parameters
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-[100dvh] bg-[#1a2333] text-[#fff8f0] flex flex-col items-center justify-center px-6 relative">
      <AnimatePresence>
        {!isUnlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center z-20 max-w-md flex flex-col items-center"
          >
            <h2 className="text-2xl font-semibold mb-4 text-pink-300">Lá thư bí mật ✉️</h2>
            <p className="text-sm text-gray-300 mb-12 leading-relaxed">
              Mở khóa lá thư này bằng cách giữ chặt nút tròn bên dưới trong 5 giây nhé.
            </p>

            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Background Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-gray-700"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-pink-400"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 100ms linear' }}
                />
              </svg>

              <button
                onPointerDown={startHold}
                onPointerUp={stopHold}
                onPointerLeave={stopHold}
                className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-500 shadow-lg shadow-pink-500/30 focus:outline-none select-none active:scale-95 transition-transform duration-150 ${
                  isHolding ? 'brightness-110' : ''
                }`}
              >
                <span className="text-2xl">{isHolding ? '🔒' : '🔓'}</span>
              </button>
            </div>

            {isHolding && (
              <p className="text-xs text-pink-300 mt-6 animate-pulse">Đang giải mã... Giữ chặt nhé!</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#fff8f0] text-[#9b6b43] rounded-3xl p-8 max-w-md w-full shadow-2xl z-20 border-2 border-pink-200 relative flex flex-col"
          >
            <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-2xl mb-6 self-center">
              💌
            </div>

            <p className="text-lg font-bold mb-4 text-gray-800">Nhi mipmap thân yêu,</p>

            <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed italic">
              <p>Web này không phải để gây ấn tượng gì ghê gớm đâu...</p>
              <p>Chỉ là hôm nay anh muốn em vui hơn một chút xíu thôi.</p>
              <p>Và muốn nhân cơ hội này nhắc cho em nhớ một điều quan trọng là:</p>
              <p className="font-semibold text-pink-500 text-base not-italic text-center py-2">
                Em rất rất quan trọng đối với anh đó! ❤️
              </p>
            </div>

            <div className="mt-8 text-right">
              <p className="text-xs text-gray-500">Mãi yêu em,</p>
              <p className="text-sm font-bold text-[#9b6b43]">Vinh mupmup</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="mt-8 px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg focus:outline-none text-base self-center"
            >
              Đọc xong rồi 👣
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
