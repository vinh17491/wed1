import React from 'react';
import { motion } from 'framer-motion';
import './MinecraftTactileButton.css';

interface MinecraftTactileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'green' | 'gray';
  className?: string;
  icon?: React.ReactNode;
}

const MinecraftTactileButton: React.FC<MinecraftTactileButtonProps> = ({
  children,
  onClick,
  variant = 'green',
  className = '',
  icon
}) => {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 2 }}
      onClick={onClick}
      className={`mc-tactile-btn mc-tactile-btn--${variant} ${className}`}
    >
      <div className="mc-tactile-btn-inner">
        {icon && <span className="mc-btn-icon">{icon}</span>}
        {children}
      </div>
    </motion.button>
  );
};

export default MinecraftTactileButton;
