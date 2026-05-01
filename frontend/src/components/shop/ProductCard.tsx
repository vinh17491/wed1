import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types/shop';
import { FakeStarRating } from './FakeStarRating';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { useExtraStore } from '../../store/useExtraStore';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const { openProductModal } = useUIStore();
  const { addRecentlyViewed } = useExtraStore();

  const handleProductClick = () => {
    addRecentlyViewed(product);
    openProductModal(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: crypto.randomUUID(),
      productId: product.id,
      product: product,
      quantity: 1
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={handleProductClick}
      className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-300"
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
          <div className="text-xl font-bold text-white">
            ${product.price.toFixed(2)}
          </div>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-emerald-500 hover:text-white transition-all group-hover:scale-110"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
