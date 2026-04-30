import React from 'react';
import { motion } from 'framer-motion';
import { Diamond, Pickaxe, Box, Users, ShieldCheck, Gamepad2, ArrowLeft } from 'lucide-react';
import MinecraftTactileButton from './MinecraftTactileButton';
import './MinecraftOfficialPanel.css';
import pigImg from '../assets/minecraft-pig.png';
import cowImg from '../assets/minecraft-cow.png';

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
                KHÁM PHÁ THẾ GIỚI CÙNG NHỮNG NGƯỜI BẠN!
              </h3>
              
              <ul className="mc-feature-list">
                {features.map((f, i) => (
                  <li key={i} className="mc-feature-item">
                    <span className="mc-feature-icon">{f.icon}</span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <div className="mc-animals-showcase">
                <motion.img 
                  animate={{ 
                    x: [0, 80, 0],
                    scaleX: [1, 1, -1, -1, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    times: [0, 0.45, 0.5, 0.95, 1]
                  }}
                  src={pigImg} 
                  alt="Pig" 
                  className="mc-showcase-animal mc-showcase-pig" 
                />
                <motion.img 
                  animate={{ 
                    x: [0, -60, 0],
                    scaleX: [-1, -1, 1, 1, -1]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity,
                    delay: 1,
                    times: [0, 0.45, 0.5, 0.95, 1]
                  }}
                  src={cowImg} 
                  alt="Cow" 
                  className="mc-showcase-animal mc-showcase-cow" 
                />
              </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MinecraftOfficialPanel;
