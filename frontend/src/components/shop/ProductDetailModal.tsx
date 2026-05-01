import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Check, ShieldCheck } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useCartStore } from '../../store/useCartStore';
import { FakeStarRating } from './FakeStarRating';

export function ProductDetailModal() {
  const { selectedProduct, isProductModalOpen, closeProductModal } = useUIStore();
  const { addToCart } = useCartStore();
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const imageRef = useRef<HTMLImageElement>(null);

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart({
      id: crypto.randomUUID(),
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity: 1
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  return (
    <AnimatePresence>
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProductModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={closeProductModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-slate-800 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 bg-slate-950/50">
              <div 
                className="relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  ref={imageRef}
                  src={selectedProduct.gallery[activeImage] || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {/* Zoom Lens overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none hidden md:block"
                  style={{
                    ...zoomStyle,
                    backgroundImage: `url(${selectedProduct.gallery[activeImage] || selectedProduct.image})`,
                    backgroundSize: '200%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>
              
              {/* Thumbnails */}
              {selectedProduct.gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {selectedProduct.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === idx ? 'border-emerald-500' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="mb-2 text-emerald-400 font-medium text-sm tracking-wider uppercase">
                {selectedProduct.category}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {selectedProduct.name}
              </h2>
              
              <div className="flex items-center gap-4 mb-6">
                <FakeStarRating rating={selectedProduct.rating} />
                <span className="text-slate-500 text-sm">|</span>
                <div className="flex items-center gap-1 text-slate-300 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Guaranteed
                </div>
              </div>

              <div className="text-3xl font-bold text-white mb-6">
                ${selectedProduct.price.toFixed(2)}
              </div>

              <div className="prose prose-invert prose-emerald mb-8 text-slate-300">
                <p>{selectedProduct.description}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-800">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    isAdded 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
