import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionLayerProps {
  visible: boolean;
  type?: 'fade' | 'hearts' | 'glow';
}

export const TransitionLayer: React.FC<TransitionLayerProps> = ({ visible, type = 'fade' }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-[#101828]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {type === 'hearts' && (
            <div className="text-4xl text-pink-400 animate-ping">💖</div>
          )}
          {type === 'glow' && (
            <div className="w-40 h-40 rounded-full bg-pink-300 filter blur-3xl opacity-50 animate-pulse" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
