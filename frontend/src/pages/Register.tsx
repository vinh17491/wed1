import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';

import MinecraftNavbar from '../components/MinecraftNavbar';
import MinecraftVideoBackground from '../components/MinecraftVideoBackground';
import MinecraftRegisterForm from '../components/MinecraftRegisterForm';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      await authApi.register(data);
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] relative overflow-hidden">
      {/* Official Top Navbar */}
      <MinecraftNavbar />

      {/* Cinematic Video Background */}
      <MinecraftVideoBackground />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-[500px]">
          <div className="bg-[#e6e4e2] border-4 border-[#333] shadow-2xl overflow-hidden">
            <MinecraftRegisterForm 
              onSubmit={handleRegister}
              isLoading={loading}
              error={error}
              onBack={() => navigate('/login')}
            />
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 py-6 text-center text-white/40 text-xs font-bold uppercase tracking-widest">
        <p>© 2026 MOJANG AB. MINECRAFT IS A TRADEMARK OF MOJANG SYNERGIES AB.</p>
      </footer>
    </div>
  );
};

export default Register;
