import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Diamond, Pickaxe, Sword, Box, Users, ShieldCheck, Gamepad2 } from 'lucide-react';

import './MinecraftLoginModal.css';
import MinecraftVideoBackground from './MinecraftVideoBackground';


interface MinecraftLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const MinecraftLoginModal: React.FC<MinecraftLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const features = [
    { icon: <Diamond className="minecraft-feature-icon" />, text: 'Mua game thật dễ, chơi cực phê!' },
    { icon: <Sword className="minecraft-feature-icon" />, text: 'Tùy chỉnh skin và nhân vật của bạn!' },
    { icon: <Users className="minecraft-feature-icon" />, text: 'Quản lý Realms, mời bạn bè cùng vui!' },
    { icon: <Pickaxe className="minecraft-feature-icon" />, text: 'Bắt đầu cuộc phiêu lưu ngay hôm nay!' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="minecraft-modal-backdrop">
          {/* Live Video Background */}
          <MinecraftVideoBackground />

          {/* Click to close overlay */}
          <div className="absolute inset-0 z-0" onClick={onClose} />



          {/* Center Modal Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="minecraft-panel"
          >
            {/* Header Bar */}
            <div className="minecraft-header">
              <h2>SIGN IN OR SIGN UP</h2>
              <button className="minecraft-close" onClick={onClose}>
                <X size={32} />
              </button>
            </div>

            {/* Body Layout */}
            <div className="minecraft-body">
              {/* Left Column (40%) */}
              <div className="minecraft-left">
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mc-btn mc-btn-green"
                  onClick={onLogin}
                >
                  <Gamepad2 size={24} />
                  ĐĂNG NHẬP
                </motion.button>
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mc-btn mc-btn-gray"
                  onClick={onRegister}
                >
                  <Users size={24} />
                  ĐĂNG KÝ
                </motion.button>
              </div>

              {/* Right Column (60%) */}
              <div className="minecraft-right">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="minecraft-title"
                >
                  CÙNG STEVE BƯỚC VÀO THẾ GIỚI KHỐI VUÔNG NÀO!
                </motion.h3>

                <ul className="minecraft-features">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="minecraft-feature-item"
                    >
                      {feature.icon}
                      <span>{feature.text}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Removed 2D Animals */}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MinecraftLoginModal;
