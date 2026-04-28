import React from 'react';
import { motion } from 'framer-motion';
import { Diamond, Pickaxe, Box, Users, ShieldCheck, Gamepad2, ArrowLeft } from 'lucide-react';
import MinecraftTactileButton from './MinecraftTactileButton';
import './MinecraftOfficialPanel.css';
import steveImg from '../assets/minecraft-steve.png';

interface MinecraftOfficialPanelProps {
  onLogin: () => void;
  onRegister: () => void;
  onBack: () => void;
}

const MinecraftOfficialPanel: React.FC<MinecraftOfficialPanelProps> = ({
  onLogin,
  onRegister,
  onBack
}) => {
  const features = [
    { icon: <Diamond size={20} />, text: 'Khám phá server mới' },
    { icon: <Box size={20} />, text: 'Tùy chỉnh skin' },
    { icon: <Users size={20} />, text: 'Chơi cùng bạn bè' },
    { icon: <Pickaxe size={20} />, text: 'Bắt đầu phiêu lưu' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mc-official-panel"
    >
      {/* Title Bar */}
      <div className="mc-panel-header">
        <h2 className="mc-font">SIGN IN OR SIGN UP</h2>
      </div>

      <div className="mc-panel-body">
        {/* Left: Actions (55%) */}
        <div className="mc-panel-left">
          <div className="mc-action-group">
            <MinecraftTactileButton 
              variant="green" 
              onClick={onLogin}
            >
              ĐĂNG NHẬP
            </MinecraftTactileButton>
            
            <MinecraftTactileButton 
              variant="gray" 
              onClick={onRegister}
            >
              ĐĂNG KÝ
            </MinecraftTactileButton>
          </div>

          <button className="mc-back-link" onClick={onBack}>
            <ArrowLeft size={16} /> GO BACK
          </button>
        </div>

        {/* Right: Showcase (45%) */}
        <div className="mc-panel-right">
            <div className="mc-showcase-content">
              <h3 className="mc-font mc-showcase-title">
                CÙNG STEVE BƯỚC VÀO THẾ GIỚI KHỐI VUÔNG NÀO!
              </h3>
              
              <ul className="mc-feature-list">
                {features.map((f, i) => (
                  <li key={i} className="mc-feature-item">
                    <span className="mc-feature-icon">{f.icon}</span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <div className="mc-steve-container">
              <motion.img 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                src={steveImg} 
                alt="Steve" 
                className="mc-steve-img" 
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MinecraftOfficialPanel;
