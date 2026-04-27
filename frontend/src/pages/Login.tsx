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
  ShieldCheck
} from 'lucide-react';

type AuthView = 'method' | 'credentials';

const Login: React.FC = () => {
  // Navigation & Auth
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/';

  // State
  const [view, setView] = useState<AuthView>('method');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  // Clear error when switching views
  useEffect(() => {
    setError('');
  }, [view]);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await authApi.login({ username, password });
      const { token, username: resUser, role } = res.data.data;
      login(token, resUser, role);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      setError('');
      try {
        const res = await authApi.googleLogin(tokenResponse.access_token);
        const { token, username: resUser, role } = res.data.data;
        login(token, resUser, role);
        navigate(from, { replace: true });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Đăng nhập bằng Google thất bại.');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Đăng nhập Google thất bại.');
      setIsGoogleLoading(false);
    },
  });

  const handleGithubLogin = () => {
    // Placeholder for Github Login
    setIsGithubLoading(true);
    setTimeout(() => {
      setError('Đăng nhập GitHub hiện đang được bảo trì.');
      setIsGithubLoading(false);
    }, 1000);
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const viewVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 py-12 relative overflow-hidden font-inter selection:bg-indigo-500/30">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Main Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Brand/Logo Area (Inside Card) */}
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20 border border-white/10"
            >
              <ShieldCheck className="w-9 h-9 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white tracking-tight text-center">
              {view === 'method' ? 'Chào mừng trở lại' : 'Đăng nhập'}
            </h1>
            <p className="text-slate-400 mt-2 font-medium text-center">
              {view === 'method' ? "Chọn phương thức để tiếp tục" : "Nhập thông tin tài khoản của bạn"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {view === 'method' ? (

              <motion.div
                key="method"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Method Buttons */}
                <button
                  onClick={() => setView('credentials')}
                  className="w-full group relative flex items-center justify-between bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/20 overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg">Tài khoản hệ thống</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => googleLogin()}
                  disabled={isGoogleLoading}
                  className="w-full group flex items-center justify-between bg-white hover:bg-slate-50 text-slate-900 p-4 rounded-2xl transition-all duration-300 border border-white/10 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isGoogleLoading ? (
                        <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                      ) : (
                        <Chrome className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <span className="font-semibold text-lg">Tiếp tục với Google</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={handleGithubLogin}
                  disabled={isGithubLoading}
                  className="w-full group flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl transition-all duration-300 border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isGithubLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Github className="w-5 h-5" />
                      )}
                    </div>
                    <span className="font-semibold text-lg">Tiếp tục với GitHub</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Tên đăng nhập hoặc Email</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600"
                        placeholder="vinhAn.dev"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Mật khẩu</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-slate-700 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all" />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Ghi nhớ đăng nhập</span>
                    </label>
                    <Link to="/forgot-password" title="Quên mật khẩu" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Đăng nhập ngay
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setView('method')}
                      className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white font-semibold py-3 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Quay lại tùy chọn
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-slate-500 font-medium">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors ml-1">
              Đăng ký ngay
            </Link>
          </p>
          {view === 'method' && (
            <Link to="/forgot-password" title="Quên mật khẩu" className="block text-sm font-semibold text-slate-500 hover:text-slate-400 transition-colors">
              Quên mật khẩu?
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
