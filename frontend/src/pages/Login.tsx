import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts';
import { useGoogleLogin } from '@react-oauth/google';
import { Github, Chrome, Play } from 'lucide-react';

import MinecraftNavbar from '../components/MinecraftNavbar';
import Minecraft3DBackground from '../components/Minecraft3DBackground';
import MinecraftOfficialPanel from '../components/MinecraftOfficialPanel';
import MinecraftLoginForm from '../components/MinecraftLoginForm';
import MinecraftTactileButton from '../components/MinecraftTactileButton';

type MinecraftAuthView = 'selection' | 'login' | 'register';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/';

  const [view, setView] = useState<MinecraftAuthView>('selection');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    system: false,
    google: false,
    github: false
  });

  const setLoading = (key: string, value: boolean) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setError('');
  }, [view]);

  const handleSystemLogin = async (username: string, password: string) => {
    setLoading('system', true);
    setError('');
    try {
      const res = await authApi.login({ username, password });
      const { token, username: resUser, role } = res.data.data;
      login(token, resUser, role);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading('system', false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading('google', true);
      try {
        const res = await authApi.googleLogin(tokenResponse.access_token);
        const { token, username: resUser, role } = res.data.data;
        login(token, resUser, role);
        navigate(from, { replace: true });
      } catch (err) {
        setError('Google Login failed.');
      } finally {
        setLoading('google', false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] relative overflow-hidden">
      {/* Official Top Navbar */}
      <MinecraftNavbar />

      {/* Cinematic 3D Background */}
      <Minecraft3DBackground />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'selection' && (
            <div className="flex flex-col items-center w-full">
              <MinecraftOfficialPanel 
                onLogin={() => setView('login')}
                onRegister={() => navigate('/register')}
                onBack={() => navigate('/')}
              />
              
              {/* Other Methods Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-col items-center gap-4"
              >
                <p className="text-white/60 font-bold text-xs uppercase tracking-widest">Other sign in methods</p>
                <div className="flex gap-4">
                  <MinecraftTactileButton 
                    variant="gray" 
                    className="!w-auto !p-0"
                    onClick={() => googleLogin()}
                  >
                    <div className="px-6 py-2 flex items-center gap-2">
                      <Chrome size={18} />
                      <span className="text-sm">GOOGLE</span>
                    </div>
                  </MinecraftTactileButton>
                  
                  <MinecraftTactileButton 
                    variant="gray" 
                    className="!w-auto !p-0"
                    onClick={() => setLoading('github', true)}
                  >
                    <div className="px-6 py-2 flex items-center gap-2">
                      <Github size={18} />
                      <span className="text-sm">GITHUB</span>
                    </div>
                  </MinecraftTactileButton>

                  <MinecraftTactileButton 
                    variant="gray" 
                    className="!w-auto !p-0"
                    onClick={() => navigate('/')}
                  >
                    <div className="px-6 py-2 flex items-center gap-2">
                      <Play size={18} />
                      <span className="text-sm">GUEST</span>
                    </div>
                  </MinecraftTactileButton>
                </div>
              </motion.div>
            </div>
          )}

          {view === 'login' && (
            <div className="w-full max-w-[500px]">
              <MinecraftLoginForm 
                onSubmit={handleSystemLogin}
                isLoading={isLoading.system}
                error={error}
                onBack={() => setView('selection')}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 py-6 text-center text-white/40 text-xs font-bold uppercase tracking-widest">
        <div className="flex justify-center gap-8 mb-2">
          <button className="hover:text-white transition-colors">Privacy Policy</button>
          <button className="hover:text-white transition-colors">Terms of Use</button>
          <button className="hover:text-white transition-colors">Cookies</button>
        </div>
        <p>© 2026 MOJANG AB. MINECRAFT IS A TRADEMARK OF MOJANG SYNERGIES AB.</p>
      </footer>
    </div>
  );
};

export default Login;

