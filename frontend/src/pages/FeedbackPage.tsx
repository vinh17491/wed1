import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { feedbackApi } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MemePage.css'; // Reuse some glass styles if available, or define new ones

export default function FeedbackPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await feedbackApi.submit(formData);
      setStatus('success');
      setFormData({ name: '', email: '', rating: 5, message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
              {t('feedback.title', 'Góp ý & Đánh giá')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('feedback.subtitle', 'Ý kiến của bạn giúp tôi hoàn thiện trang web này tốt hơn mỗi ngày.')}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass p-12 text-center rounded-3xl border border-white/10"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">{t('feedback.success_title', 'Cảm ơn bạn!')}</h2>
                <p className="text-gray-400 mb-8">{t('feedback.success_msg', 'Góp ý của bạn đã được ghi nhận.')}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  {t('feedback.send_another', 'Gửi thêm góp ý')}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="glass p-8 md:p-10 rounded-3xl border border-white/10 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">{t('feedback.name', 'Tên của bạn')}</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 ml-1">{t('feedback.email', 'Email')}</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="a@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">{t('feedback.rating', 'Đánh giá')}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 transition-transform hover:scale-125"
                      >
                        <svg
                          className={`w-8 h-8 ${
                            star <= (hoverRating || formData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">{t('feedback.message', 'Góp ý hoặc câu hỏi của bạn')}</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('feedback.placeholder', 'Trang web rất tuyệt, nhưng tôi nghĩ bạn nên thêm...')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                  />
                </div>

                <button
                  disabled={status === 'submitting'}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all disabled:opacity-50"
                >
                  {status === 'submitting' ? t('feedback.sending', 'Đang gửi...') : t('feedback.submit', 'Gửi góp ý ngay')}
                </button>
                
                {status === 'error' && (
                  <p className="text-red-400 text-center text-sm">{t('feedback.error', 'Có lỗi xảy ra, vui lòng thử lại sau.')}</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
