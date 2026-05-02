import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { useUIStore } from '../../../store/useUIStore';
import { useCartStore } from '../../../store/useCartStore';
import { FakeStarRating } from './FakeStarRating';

export function ProductDetailModal() {
  const { selectedProduct, isProductModalOpen, closeProductModal } = useUIStore();
  const { addToCart } = useCartStore();
  
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '50% 50%' });
  const imageRef = useRef<HTMLImageElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProductModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeProductModal]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isProductModalOpen) {
        setTimeout(() => {
          setActiveImage(0);
          setIsAdded(false);
          setIsAdding(false);
          setQuantity(1);
        }, 300);
    }
  }, [isProductModalOpen]);

  if (!selectedProduct) return null;

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return;
    
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
    
    addToCart({
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity: quantity
    });
    
    setIsAdding(false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
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
    setZoomStyle({ display: 'none', backgroundPosition: '50% 50%' });
  };

  return (
    <AnimatePresence>
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeProductModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={closeProductModal}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-slate-800 text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image Gallery */}
            <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col gap-6 bg-slate-950/50">
              <div 
                className="relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in group border border-slate-800/50 bg-slate-900"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  ref={imageRef}
                  src={selectedProduct.gallery[activeImage] || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {/* Zoom Lens overlay (Desktop only) */}
                <div 
                  className="absolute inset-0 pointer-events-none hidden md:block transition-all duration-75"
                  style={{
                    ...zoomStyle,
                    backgroundImage: `url(${selectedProduct.gallery[activeImage] || selectedProduct.image})`,
                    backgroundSize: '130%', // Premium 1.3x zoom as requested
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>
              
              {/* Thumbnails */}
              {selectedProduct.gallery.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {selectedProduct.gallery.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === idx 
                          ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-[40%] p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="mb-3 text-emerald-400 font-bold text-sm tracking-widest uppercase">
                {selectedProduct.category}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                {selectedProduct.name}
              </h2>
              
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800">
                <FakeStarRating rating={selectedProduct.rating} />
                <div className="w-px h-6 bg-slate-800" />
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Guaranteed Premium
                </div>
              </div>

              <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-8 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                ${selectedProduct.price.toFixed(2)}
              </div>

              <div className="prose prose-lg prose-invert prose-emerald mb-8 text-slate-300 leading-relaxed">
                <p>{selectedProduct.description}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-800/50">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-slate-400 font-medium">Quantity:</span>
                  <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                    <motion.button
                      whileTap={{ scale: quantity > 1 ? 0.95 : 1 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </motion.button>
                    <div className="w-12 text-center font-bold text-white text-lg select-none">
                      {quantity}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </motion.button>
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: (isAdding || isAdded) ? 1 : 0.95 }}
                    onClick={handleAddToCart}
                    disabled={isAdding || isAdded}
                    className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                      isAdded 
                        ? 'bg-emerald-600 text-white' 
                        : isAdding
                        ? 'bg-emerald-500/50 text-emerald-100 cursor-wait'
                        : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" /> Processing...
                      </>
                    ) : isAdded ? (
                      <>
                        <Check className="w-6 h-6" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6" /> Add to Cart
                      </>
                    )}
                  </motion.button>
                  <p className="text-center text-sm text-slate-500 mt-4">
                    Instant digital delivery to your email
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
