import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './BloomScene.css';

interface BloomSceneProps {
  onNext: () => void;
}

export const BloomScene: React.FC<BloomSceneProps> = ({ onNext }) => {
  const [isBloomed, setIsBloomed] = useState(false);

  useEffect(() => {
    // Automatically trigger bloom effect after loading page
    const timer = setTimeout(() => setIsBloomed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bloom-scene-container ${!isBloomed ? 'not-loaded' : ''}`}>
      {/* Title overlay */}
      <div className="fixed top-12 left-0 right-0 text-center z-30 px-4 pointer-events-none">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-2xl md:text-3xl font-light text-pink-200 drop-shadow-[0_0_10px_rgba(244,114,182,0.3)]"
        >
          A little floral surprise for you, Nhi mipmap 🌸
        </motion.h2>
      </div>

      {/* Next Button overlay */}
      <div className="fixed bottom-12 left-0 right-0 flex justify-center z-30">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isBloomed ? 1 : 0 }}
          transition={{ delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-10 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-500/30 focus:outline-none text-base"
        >
          Đi tiếp nào 🐾
        </motion.button>
      </div>

      {/* The Advanced CSS Flowers implementation */}
      <div className="flowers">
        {/* Flower 1 */}
        <div className="flower flower--1">
          <div className="flower__leafs flower__leafs--1">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>

            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
            ))}
          </div>
          <div className="flower__line">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
            ))}
          </div>
        </div>

        {/* Flower 2 */}
        <div className="flower flower--2">
          <div className="flower__leafs flower__leafs--2">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>

            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
            ))}
          </div>
          <div className="flower__line">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
            ))}
          </div>
        </div>

        {/* Flower 3 */}
        <div className="flower flower--3">
          <div className="flower__leafs flower__leafs--3">
            <div className="flower__leaf flower__leaf--1"></div>
            <div className="flower__leaf flower__leaf--2"></div>
            <div className="flower__leaf flower__leaf--3"></div>
            <div className="flower__leaf flower__leaf--4"></div>
            <div className="flower__white-circle"></div>

            {[...Array(8)].map((_, i) => (
              <div key={i} className={`flower__light flower__light--${i + 1}`}></div>
            ))}
          </div>
          <div className="flower__line">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i + 1}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
