import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts';
import { LogIn, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ username, password });
      const { token, username: resUser, role } = res.data.data;
      login(token, resUser, role);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.googleLogin(credentialResponse.credential);
      const { token, username: resUser, role } = res.data.data;
      login(token, resUser, role);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập Google thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-12 relative overflow-hidden font-inter">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20"
          >
            <LogIn className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Chào mừng trở lại</h1>
          <p className="text-slate-400 font-medium">Đăng nhập để tiếp tục quản lý dự án</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Tên đăng nhập</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600"
                placeholder="vinhAn.dev"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Mật khẩu</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Đăng nhập ngay
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0f172a] px-2 text-slate-500 font-medium tracking-wider">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Đăng nhập Google thất bại.')}
                useOneTap
                theme="filled_blue"
                shape="pill"
                size="large"
                width="100%"
              />
            </div>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-400 font-medium">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
