import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Package, FileText, Upload } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
}

export default function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', category: 'General' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      await onSubmit({ ...formData, price: parseFloat(formData.price), imageFile });
      setFormData({ name: '', price: '', description: '', category: 'General' });
      setImageFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black text-white">Add New Product</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center bg-slate-950 overflow-hidden">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <Upload className="text-slate-700" />}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <input required placeholder="Product Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Price" type="number" step="0.01" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <textarea placeholder="Description" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <button disabled={loading} type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl">{loading ? 'Creating...' : 'Create Product'}</button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
