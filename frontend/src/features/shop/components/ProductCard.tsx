import React from 'react';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Product } from '../../../services/productService';
import { useCartStore } from '../../../store/useCartStore';

export default function ProductCard({ product, onQuickView }: { product: Product, onQuickView?: () => void }) {
  const addToCart = useCartStore(state => state.addToCart);

  // Safe Data Defaults
  const name = (product.name || 'Unnamed Product').trim();
  const price = Number(product.price || 0);
  const description = (product.description?.trim()) || 'No description available for this item.';
  const imageUrl = product.image_url || 'https://images.unsplash.com/photo-1581235720704-06d3acfc1366?w=600&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: name,
      price: price,
      image: imageUrl
    });
  };

  return (
    <div className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer" onClick={onQuickView}>
      <div className="aspect-square relative overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-6 gap-3">
          <button onClick={handleAddToCart} className="bg-emerald-500 text-slate-950 p-3 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"><ShoppingCart className="w-5 h-5" /></button>
          <button className="bg-white/10 backdrop-blur-md text-white p-3 rounded-xl hover:bg-white/20 transition-all"><Eye className="w-5 h-5" /></button>
          <button className="bg-white/10 backdrop-blur-md text-white p-3 rounded-xl hover:bg-white/20 transition-all"><Heart className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors line-clamp-1">{name}</h3>
          <span className="text-emerald-400 font-black text-lg font-mono">${price.toFixed(2)}</span>
        </div>
        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800" />)}
          </div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">+12 Sold Today</span>
        </div>
      </div>
    </div>
  );
}
