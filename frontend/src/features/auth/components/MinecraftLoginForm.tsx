import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import MinecraftTactileButton from './MinecraftTactileButton';
import './MinecraftLoginForm.css';

interface MinecraftLoginFormProps {
  onSubmit: (username: string, password: string) => void;
  isLoading: boolean;
  error?: string;
  onBack: () => void;
}

const MinecraftLoginForm: React.FC<MinecraftLoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onBack
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mc-login-form-container"
    >
      <h2 className="mc-font mc-form-title">SIGN IN</h2>
      
      <form onSubmit={handleSubmit} className="mc-login-form">
        <div className="mc-input-group">
          <label htmlFor="username">EMAIL OR USERNAME</label>
          <div className="mc-input-wrapper">
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>
        </div>

        <div className="mc-input-group">
          <div className="mc-label-row">
            <label htmlFor="password">PASSWORD</label>
            <button type="button" className="mc-forgot-link">FORGOT PASSWORD?</button>
          </div>
          <div className="mc-input-wrapper">
            <input 
              id="password"
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button 
              type="button" 
              className="mc-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mc-error-msg">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="mc-form-actions">
          <MinecraftTactileButton 
            variant="green" 
            className="mc-submit-btn"
            onClick={() => {}} // Form submit handles it
          >
            {isLoading ? 'SIGNING IN...' : 'LOG IN'}
          </MinecraftTactileButton>
          
          <button type="button" className="mc-back-btn" onClick={onBack}>
            GO BACK
          </button>
        </div>
      </form>

      <div className="mc-form-footer">
        <p>DON'T HAVE AN ACCOUNT? <button className="mc-footer-link">SIGN UP FOR FREE</button></p>
      </div>
    </motion.div>
  );
};

export default MinecraftLoginForm;
