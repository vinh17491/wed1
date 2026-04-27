import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  LogIn, 
  User, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Github, 
  Chrome, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Gamepad2,
  Play,
  Box,
  Diamond,
  Pickaxe,
  Sword,
  TreeDeciduous,
  Cloud,
  Layers,
  Cpu
} from 'lucide-react';

type AuthView = 'method' | 'credentials' | 'minecraft';

// --- Sub-components ---

const MinecraftItemMarquee: React.FC = () => {
  const items = [
    <Box className="w-6 h-6" />,
    <Diamond className="w-6 h-6" />,
    <Pickaxe className="w-6 h-6" />,
    <Sword className="w-6 h-6" />,
    <TreeDeciduous className="w-6 h-6" />,
    <Box className="w-6 h-6" />,
    <Diamond className="w-6 h-6" />,
    <Pickaxe className="w-6 h-6" />,
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-black/40 backdrop-blur-md border-t-4 border-green-600/50 py-3">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 items-center whitespace-nowrap px-4"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-green-400 opacity-60 hover:opacity-100 hover:scale-110 transition-all cursor-default">
            {item}
            <span className="font-mono text-[10px] uppercase tracking-tighter">Pixel_Item_{i % 8}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const FloatingBlock: React.FC<{ delay?: number; x: string; y: string }> = ({ delay = 0, x, y }) => (
  <motion.div
    initial={{ y: 0, rotate: 0 }}
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    className={`absolute ${x} ${y} p-3 bg-green-500/10 border-2 border-green-500/20 rounded-xl backdrop-blur-sm z-0`}
  >
    <Box className="w-8 h-8 text-green-500/40" />
  </motion.div>
);

interface ProviderCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'minecraft' | 'guest';
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  icon, title, subtitle, onClick, isLoading, className, variant = 'default' 
}) => {
  const isMinecraft = variant === 'minecraft';
  const isGuest = variant === 'guest';

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full group relative flex items-center p-4 rounded-2xl transition-all duration-300 border
        ${isMinecraft ? 'bg-green-900/40 border-green-500/50 shadow-[4px_4px_0px_rgba(34,197,94,0.3)]' : 
          isGuest ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400/30' : 
          'bg-slate-800/50 hover:bg-slate-700/50 border-white/5'}
        ${className}
      `}
    >
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-transform group-hover:scale-110
        ${isMinecraft ? 'bg-green-500/20 text-green-400' : 
          isGuest ? 'bg-white/20 text-white' : 
          'bg-white/5 text-slate-300'}
      `}>
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon}
      </div>
      <div className="flex-1 text-left">
        <h3 className={`font-bold text-lg leading-tight ${isMinecraft ? 'font-mono uppercase tracking-wider text-green-400' : 'text-white'}`}>
          {title}
        </h3>
        <p className={`text-sm ${isMinecraft ? 'text-green-500/70 font-mono' : 'text-slate-400'}`}>
          {subtitle}
        </p>
      </div>
      <ChevronRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${isMinecraft ? 'text-green-400' : 'text-slate-500'}`} />
    </motion.button>
  );
};

// --- Main Component ---

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/';

  const [view, setView] = useState<AuthView>('method');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    system: false,
    google: false,
    github: false,
    minecraft: false,
    guest: false
  });

  const setLoading = (key: string, value: boolean) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setError('');
  }, [view]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('system', true);
    setError('');
    try {
      const res = await authApi.login({ username, password });
      const { token, username: resUser, role } = res.data.data;
      login(token, resUser, role);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại.');
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
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 py-12 relative overflow-hidden font-inter selection:bg-indigo-500/30">
      
      {/* Background Layer: Standard SaaS */}
      <AnimatePresence mode="wait">
        {view !== 'minecraft' && (
          <motion.div 
            key="saas-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          </motion.div>
        )}

        {/* Background Layer: Minecraft Launcher */}
        {view === 'minecraft' && (
          <motion.div 
            key="minecraft-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center brightness-50"
              style={{ backgroundImage: 'url("https://www.anhnghethuatdulich.com/wp-content/uploads/2025/09/bau-khong-khi-tinh-khoi-khe-goi-nho-su-nhe-nhom-trong-long.jpg")' }}
            />




            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />

            
            {/* 3D-like Floating Elements */}
            <FloatingBlock x="left-[10%]" y="top-[15%]" delay={0} />
            <FloatingBlock x="right-[15%]" y="top-[20%]" delay={1} />
            <FloatingBlock x="left-[20%]" y="bottom-[30%]" delay={2} />
            <FloatingBlock x="right-[10%]" y="bottom-[25%]" delay={3} />
            
            <MinecraftItemMarquee />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className={`
          backdrop-blur-3xl border transition-all duration-500 overflow-hidden
          ${view === 'minecraft' ? 'bg-black/60 border-green-500/30 rounded-none shadow-[0_0_50px_rgba(34,197,94,0.2)] p-12' : 'bg-slate-900/60 border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]'}
        `}>
          
          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={view === 'minecraft' ? 'minecraft-logo' : 'saas-logo'}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`w-16 h-16 flex items-center justify-center mb-6 shadow-2xl border border-white/10 
                  ${view === 'minecraft' ? 'bg-green-600 rounded-none shadow-green-500/30' : 'bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-indigo-500/30'}`}
              >
                {view === 'minecraft' ? <Gamepad2 className="w-9 h-9 text-white" /> : <ShieldCheck className="w-9 h-9 text-white" />}
              </motion.div>
            </AnimatePresence>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {view === 'minecraft' ? 'MINECRAFT LAUNCHER' : 'Welcome back'}
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              {view === 'minecraft' ? 'Ready to explore the blocks?' : 'Choose your access method'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {view === 'method' && (
              <motion.div
                key="method"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <ProviderCard 
                  icon={<User className="w-6 h-6" />}
                  title="Tài khoản hệ thống"
                  subtitle="Internal secure login"
                  onClick={() => setView('credentials')}
                />
                <ProviderCard 
                  icon={<Chrome className="w-6 h-6" />}
                  title="Google"
                  subtitle="Fast and trusted sign in"
                  onClick={() => googleLogin()}
                  isLoading={isLoading.google}
                />
                <ProviderCard 
                  icon={<Github className="w-6 h-6" />}
                  title="GitHub"
                  subtitle="Developer access portal"
                  onClick={() => setLoading('github', true)}
                  isLoading={isLoading.github}
                />
                <ProviderCard 
                  icon={<Box className="w-6 h-6" />}
                  title="Minecraft"
                  subtitle="TLauncher & Legacy Vibe"
                  onClick={() => setView('minecraft')}
                  variant="minecraft"
                />
                <ProviderCard 
                  icon={<Play className="w-6 h-6" />}
                  title="Guest Demo"
                  subtitle="Explore without account"
                  onClick={() => navigate('/')}
                  variant="guest"
                />
              </motion.div>
            )}

            {view === 'credentials' && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Username</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      placeholder="vinhAn.dev"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {isLoading.system ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign in'}
                  </button>
                  <button
                    onClick={() => setView('method')}
                    className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white font-semibold py-3 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to methods
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'minecraft' && (
              <motion.div
                key="minecraft"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-8"
              >
                <div className="bg-slate-900/80 border-4 border-slate-700 p-8 rounded-none relative overflow-hidden group">
                  <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-green-500 flex items-center gap-2">
                          <User className="w-3 h-3" /> Player Name
                        </label>
                        <input 
                          type="text" 
                          placeholder="STEVE_1749"
                          className="w-full bg-black border-2 border-slate-700 p-4 font-mono text-green-400 focus:border-green-500 outline-none transition-all placeholder:opacity-20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-green-500 flex items-center gap-2">
                          <Cpu className="w-3 h-3" /> Version Selector
                        </label>
                        <div className="w-full bg-black border-2 border-slate-700 p-4 font-mono text-green-400 flex justify-between items-center cursor-pointer hover:border-green-500/50 transition-all">
                          <span>Release 1.21.1</span>
                          <Layers className="w-4 h-4 opacity-50" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        className="bg-green-600 hover:bg-green-500 text-white font-mono uppercase tracking-widest py-4 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all shadow-lg shadow-green-900/40 flex items-center justify-center gap-3"
                      >
                        <Play className="w-5 h-5 fill-white" />
                        Enter Game
                      </button>
                      <button
                        onClick={() => setView('method')}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-mono uppercase tracking-widest py-4 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 animate-ping rounded-full" />
                    <span className="text-[10px] font-mono text-green-500/70 uppercase tracking-widest">Server Online: 2,451 players</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 uppercase">Build: 2026.04.27</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center gap-6">
          <Link to="/register" className="text-sm font-semibold text-slate-500 hover:text-white transition-colors">Register</Link>
          <Link to="/help" className="text-sm font-semibold text-slate-500 hover:text-white transition-colors">Support</Link>
          <Link to="/news" className="text-sm font-semibold text-slate-500 hover:text-white transition-colors">News</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
