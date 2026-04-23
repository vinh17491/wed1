import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { feedbackApi } from '../../api';
import { Star, Trash2, CheckCircle, Clock, Filter, Search, User, Mail, MessageSquare } from 'lucide-react';

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ rating: '', category: '', username: '' });

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await feedbackApi.getAll(filters);
      setFeedbacks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filters]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await feedbackApi.updateStatus(id, status);
      setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status } : f));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa góp ý này?')) return;
    try {
      await feedbackApi.delete(id);
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý Góp ý</h1>
          <p className="text-gray-400">Xem và xử lý phản hồi từ người dùng hệ thống.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-[#16161a] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              placeholder="Tìm username..."
              className="bg-transparent border-none outline-none text-white text-sm"
              value={filters.username}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
            />
          </div>
          <select 
            className="bg-[#16161a] border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none"
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          >
            <option value="">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
          <select 
            className="bg-[#16161a] border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">Tất cả loại</option>
            <option value="Bug">Lỗi website</option>
            <option value="UI">Giao diện</option>
            <option value="Speed">Tốc độ</option>
            <option value="Feature">Tính năng mới</option>
            <option value="Other">Khác</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-[#16161a] border border-white/5 rounded-2xl h-64 animate-pulse" />
            ))
          ) : feedbacks.length === 0 ? (
            <div className="col-span-full py-20 text-center text-gray-500">Không tìm thấy góp ý nào.</div>
          ) : (
            feedbacks.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#16161a] border border-white/5 rounded-2xl p-6 flex flex-col relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= f.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'}`} />
                    ))}
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                    f.status === 'Processed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {f.status === 'Processed' ? 'Đã xử lý' : 'Chờ xử lý'}
                  </span>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="font-bold">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(f.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-sm text-gray-300 italic border border-white/5">
                    "{f.message}"
                  </div>
                  <div className="text-xs font-medium text-blue-400">
                    #{f.category}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  {f.status !== 'Processed' && (
                    <button 
                      onClick={() => handleUpdateStatus(f.id, 'Processed')}
                      className="flex-1 bg-green-600/10 hover:bg-green-600/20 text-green-500 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Xong
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(f.id)}
                    className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminFeedback;
