import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Tag, ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { useExtraStore } from '../../store/useExtraStore';
import { Coupon } from '../../types/shop';

const VALID_COUPONS: Coupon[] = [
  { code: 'MINECRAFT20', type: 'percent', value: 20 },
  { code: 'MINUS10', type: 'fixed', value: 10 },
];

export function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const { coupon, applyCoupon, removeCoupon, orderNote, setOrderNote } = useExtraStore();
  
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getCartTotal();
  
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percent') {
      discount = subtotal * (coupon.value / 100);
    } else {
      discount = coupon.value;
    }
  }
  
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    
    const valid = VALID_COUPONS.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (valid) {
      applyCoupon(valid);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulated checkout delay
    // Navigate to checkout or show success modal here
    setIsCheckingOut(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
              <h2 className="text-2xl font-bold text-white">Your Cart</h2>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center text-slate-400 mt-32 flex flex-col items-center">
                  <ShoppingCart className="w-20 h-20 mb-6 opacity-20" />
                  <p className="text-lg">Your cart is empty.</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="mt-6 px-6 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-5 items-center group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/50 flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-lg line-clamp-1 mb-1">{item.product.name}</h4>
                      <div className="text-emerald-400 font-bold mb-3">${item.product.price.toFixed(2)}</div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-950 rounded-xl overflow-hidden border border-slate-700">
                          <motion.button 
                            whileTap={{ scale: item.quantity > 1 ? 0.9 : 1 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                          <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors ml-auto"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-md">
                
                <div className="p-6 pb-0">
                  {/* Order Note */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="order-note" className="text-sm font-medium text-slate-300">Order Note (Optional)</label>
                      <span className={`text-xs ${orderNote.length >= 200 ? 'text-red-400' : 'text-slate-500'}`}>
                        {orderNote.length}/200
                      </span>
                    </div>
                    <textarea
                      id="order-note"
                      rows={2}
                      maxLength={200}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Special instructions or preferences..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none custom-scrollbar transition-colors"
                    />
                  </div>

                  {/* Coupon Section */}
                  <div className="mb-6">
                    {coupon ? (
                      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl">
                        <div className="flex items-center gap-3 text-emerald-400 font-bold">
                          <Tag className="w-5 h-5" />
                          {coupon.code} <span className="text-emerald-500/80 font-medium">(-{coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`})</span>
                        </div>
                        <button onClick={removeCoupon} className="text-slate-400 hover:text-red-400 transition-colors p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Promo code"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors uppercase"
                          />
                          <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={handleApplyCoupon}
                            className="px-5 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
                          >
                            Apply
                          </motion.button>
                        </div>
                        {couponError && <p className="text-red-400 text-xs mt-2 ml-1">{couponError}</p>}
                      </div>
                    )}
                  </div>

                  {/* Summary Totals */}
                  <div className="space-y-3 mb-6 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                    <div className="flex justify-between text-slate-400 text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-300">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400 text-sm font-medium">
                        <span>Discount applied</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white font-black text-2xl pt-3 border-t border-slate-800">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <motion.button 
                    whileTap={{ scale: isCheckingOut ? 1 : 0.98 }}
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 transition-all duration-300 ${
                      isCheckingOut 
                        ? 'bg-emerald-500/50 text-emerald-100 cursor-wait' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                    }`}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing Secure Checkout...
                      </>
                    ) : (
                      'Proceed to Secure Checkout'
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
