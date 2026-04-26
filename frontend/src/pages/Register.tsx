import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api';
import { UserPlus, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

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
      setError(err.response?.data?.message || 'Đăng ký thất bại. Tên người dùng có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-12 relative overflow-hidden font-inter">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20"
          >
            <UserPlus className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Tạo tài khoản</h1>
          <p className="text-slate-400 font-medium">Khởi đầu hành trình mới của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Tên đăng nhập</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder:text-slate-600"
                placeholder="vinh123"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder:text-slate-600"
                placeholder="vinh@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Mật khẩu</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Xác nhận mật khẩu</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder:text-slate-600"
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
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Tạo tài khoản ngay
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-400 font-medium">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
