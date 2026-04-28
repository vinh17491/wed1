import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Mail, AlertCircle } from 'lucide-react';
import MinecraftTactileButton from './MinecraftTactileButton';
import './MinecraftLoginForm.css'; // Reusing common form styles

interface MinecraftRegisterFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string;
  onBack: () => void;
}

const MinecraftRegisterForm: React.FC<MinecraftRegisterFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onBack
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    onSubmit({ username, email, password });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mc-login-form-container"
    >
      <h2 className="mc-font mc-form-title">REGISTER ACCOUNT</h2>
      
      <form onSubmit={handleSubmit} className="mc-login-form">
        <div className="mc-input-group">
          <label htmlFor="username">USERNAME</label>
          <div className="mc-input-wrapper">
            <input 
              id="username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your player name"
              required
            />
          </div>
        </div>

        <div className="mc-input-group">
          <label htmlFor="email">EMAIL ADDRESS</label>
          <div className="mc-input-wrapper">
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div className="mc-input-group">
          <label htmlFor="password">PASSWORD</label>
          <div className="mc-input-wrapper">
            <input 
              id="password"
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
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

        <div className="mc-input-group">
          <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
          <div className="mc-input-wrapper">
            <input 
              id="confirmPassword"
              type={showPassword ? "text" : "password"} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
            />
          </div>
        </div>

        {error && (
          <div className="mc-error-msg">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {password !== confirmPassword && confirmPassword && (
          <div className="mc-error-msg">
            <AlertCircle size={16} />
            <span>Passwords do not match.</span>
          </div>
        )}

        <div className="mc-form-actions">
          <MinecraftTactileButton 
            variant="green" 
            className="mc-submit-btn"
            onClick={() => {}} 
          >
            {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </MinecraftTactileButton>
          
          <button type="button" className="mc-back-btn" onClick={onBack}>
            GO BACK
          </button>
        </div>
      </form>

      <div className="mc-form-footer">
        <p>ALREADY HAVE AN ACCOUNT? <button className="mc-footer-link" onClick={onBack}>SIGN IN</button></p>
      </div>
    </motion.div>
  );
};

export default MinecraftRegisterForm;
