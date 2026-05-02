import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts';
import { Star, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeedbackMutations } from '../hooks/useFeedbacks';

const categories = [
  { id: 'Bug', label: 'Lỗi website', icon: '🐛' },
  { id: 'UI', label: 'Giao diện', icon: '🎨' },
  { id: 'Speed', label: 'Tốc độ', icon: '⚡' },
  { id: 'Feature', label: 'Tính năng mới', icon: '💡' },
  { id: 'Other', label: 'Khác', icon: '✨' },
];

const Feedback: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('Other');
  const [message, setMessage] = useState('');
  
  const { submitFeedback } = useFeedbackMutations();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md p-8 bg-[#16161a] border border-white/5 rounded-3xl"
        >
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Bạn cần đăng nhập</h2>
          <p className="text-gray-400 mb-8">Chỉ người dùng đã đăng nhập mới có thể gửi góp ý và đánh giá website.</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all"
          >
            Đăng nhập ngay
          </button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    await submitFeedback.mutateAsync({ rating, category, message });
    setMessage('');
    setRating(0);
  };

  const status = submitFeedback.status;
  const errorMsg = (submitFeedback.error as any)?.response?.data?.message || 'Có lỗi xảy ra khi gửi góp ý.';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-500/5"
      >
        <div className="p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Góp ý của bạn</h1>
              <p className="text-gray-400 text-lg">Chào <span className="text-blue-400 font-bold">{user?.username}</span>, ý kiến của bạn giúp chúng tôi hoàn thiện hơn.</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-6 py-4 flex items-center gap-3">
              <MessageSquare className="text-blue-500 w-6 h-6" />
              <span className="text-blue-400 font-medium">Hỗ trợ 24/7</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Rating Section */}
            <div className="space-y-4">
              <label className="text-xl font-bold text-white flex items-center gap-2">
                Mức độ hài lòng <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none"
                  >
                    <Star 
                      className={`w-12 h-12 transition-all ${
                        (hoverRating || rating) >= star 
                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                        : 'text-gray-700'
                      }`} 
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div className="space-y-4">
              <label className="text-xl font-bold text-white">Bạn muốn góp ý về...</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                      category === cat.id 
                      ? 'bg-blue-600/10 border-blue-500 text-white' 
                      : 'bg-[#0a0a0c] border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-medium text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Section */}
            <div className="space-y-4">
              <label className="text-xl font-bold text-white">Nội dung chi tiết</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hãy cho chúng tôi biết cảm nhận của bạn hoặc những vấn đề bạn gặp phải..."
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-3xl p-6 text-white min-h-[200px] focus:border-blue-500/50 outline-none transition-all resize-none text-lg"
                required
              />
            </div>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4"
                >
                  <CheckCircle2 className="text-green-500 w-8 h-8 flex-shrink-0" />
                  <p className="text-green-400 font-medium">Cảm ơn bạn! Góp ý đã được gửi đi thành công. Chúng tôi sẽ ghi nhận và cải thiện website.</p>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4"
                >
                  <AlertCircle className="text-red-500 w-8 h-8 flex-shrink-0" />
                  <p className="text-red-400 font-medium">{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitFeedback.isPending}
              className="w-full py-5 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {submitFeedback.isPending ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Gửi góp ý ngay
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Feedback;
