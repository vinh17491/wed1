import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  ArrowLeft,
  Gamepad2,
  Box,
  Diamond,
  Pickaxe,
  Sword,
  TreeDeciduous,
  Cpu,
  Layers,
  Play
} from 'lucide-react';

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

// --- Main Component ---

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authApi.register({ username, email, password });
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Tên người dùng hoặc email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 py-12 relative overflow-hidden font-inter selection:bg-indigo-500/30">
      
      {/* Premium Minecraft Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.4] scale-105"
          style={{ backgroundImage: 'url("https://www.anhnghethuatdulich.com/wp-content/uploads/2025/09/khong-gian-hien-hoa-tao-nen-cam-giac-gan-gui-va-an-nhien.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
        
        {/* 3D-like Floating Elements */}
        <FloatingBlock x="left-[10%]" y="top-[15%]" delay={0} />
        <FloatingBlock x="right-[15%]" y="top-[20%]" delay={1} />
        <FloatingBlock x="left-[20%]" y="bottom-[30%]" delay={2} />
        <FloatingBlock x="right-[10%]" y="bottom-[25%]" delay={3} />
        
        <MinecraftItemMarquee />
      </div>

      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] relative z-10"
      >
        <div className="bg-black/60 backdrop-blur-3xl border border-green-500/30 rounded-none shadow-[0_0_50px_rgba(34,197,94,0.2)] p-12">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-green-600 border-4 border-green-700 flex items-center justify-center mb-6 shadow-[4px_4px_0px_#15803d]"
            >
              <Gamepad2 className="w-9 h-9 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-mono uppercase">
              NEW PLAYER REGISTRATION
            </h1>
            <p className="text-green-500/70 mt-2 font-mono text-xs uppercase tracking-widest">
              Join the block world portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-green-500 flex items-center gap-2">
                  <User className="w-3 h-3" /> Player Name
                </label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="STEVE_1749"
                  className="w-full bg-black border-2 border-slate-700 p-4 font-mono text-green-400 focus:border-green-500 outline-none transition-all placeholder:opacity-20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-green-500 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="steve@world.com"
                  className="w-full bg-black border-2 border-slate-700 p-4 font-mono text-green-400 focus:border-green-500 outline-none transition-all placeholder:opacity-20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-green-500 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Access Key
                </label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border-2 border-slate-700 p-4 font-mono text-green-400 focus:border-green-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-green-500 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Confirm Key
                </label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border-2 border-slate-700 p-4 font-mono text-green-400 focus:border-green-500 outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-950/40 border-l-4 border-red-600 text-red-400 text-[10px] font-mono uppercase flex items-center gap-3"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="pt-4 grid grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-mono uppercase tracking-widest py-4 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all shadow-lg shadow-green-900/40 flex items-center justify-center gap-3"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Join World
                  </>
                )}
              </button>
              <Link
                to="/login"
                className="bg-slate-800 hover:bg-slate-700 text-white font-mono uppercase tracking-widest py-4 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 text-center"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
            </div>
          </form>

          <div className="mt-8 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 animate-ping rounded-full" />
              <span className="text-[9px] font-mono text-green-600 uppercase tracking-widest">New Player Slot Available</span>
            </div>
            <span className="text-[9px] font-mono text-slate-600 uppercase">Ver: 1.21.1_REG</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center gap-6">
          <Link to="/help" className="text-xs font-mono text-slate-600 hover:text-green-500 transition-colors uppercase tracking-widest">Support</Link>
          <Link to="/terms" className="text-xs font-mono text-slate-600 hover:text-green-500 transition-colors uppercase tracking-widest">Rules</Link>
          <Link to="/news" className="text-xs font-mono text-slate-600 hover:text-green-500 transition-colors uppercase tracking-widest">Wiki</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
