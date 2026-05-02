import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Product } from '../../types/shop';
import { FakeStarRating } from './FakeStarRating';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { useExtraStore } from '../../store/useExtraStore';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = memo(function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const { openProductModal } = useUIStore();
  const { addRecentlyViewed } = useExtraStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleProductClick = () => {
    addRecentlyViewed(product);
    openProductModal(product);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;
    
    setIsAdding(true);
    
    // Simulated network delay (600ms) for premium feel
    await new Promise(resolve => setTimeout(resolve, 600));
    
    addToCart({
      id: crypto.randomUUID(),
      productId: product.id,
      product: product,
      quantity: 1
    });
    
    setIsAdding(false);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      onClick={handleProductClick}
      whileHover={{ scale: 1.05 }}
      className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/20">
          {product.category}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <FakeStarRating rating={product.rating} className="mb-4" />
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-xl font-bold text-emerald-400">
            ${product.price.toFixed(2)}
          </div>
          <motion.button
            whileTap={{ scale: isAdding ? 1 : 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`p-2 rounded-xl transition-all flex items-center justify-center ${
              isAdding 
                ? 'bg-emerald-500/50 text-emerald-200 cursor-not-allowed' 
                : 'bg-slate-800 text-slate-300 hover:bg-emerald-500 hover:text-white group-hover:scale-110'
            }`}
            aria-label="Add to cart"
          >
            {isAdding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
