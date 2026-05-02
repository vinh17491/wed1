import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload } from 'lucide-react';

interface EditProductModalProps {
  product: any | null;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', category: '' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({ name: product.name, price: product.price.toString(), description: product.description || '', category: product.category || 'General' });
      setPreviewUrl(product.image_url);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ ...product, ...formData, price: parseFloat(formData.price), imageFile });
      onClose();
    } catch (err) {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black text-white">Edit Product</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="relative aspect-video rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 group">
                <img src={previewUrl || ''} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                  <Upload className="text-white mb-2" />
                  <p className="text-white text-[10px] font-bold">CHANGE IMAGE</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="number" step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <button disabled={loading} type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
