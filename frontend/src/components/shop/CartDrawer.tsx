import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, Tag, ShoppingCart } from 'lucide-react';
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
  const { coupon, applyCoupon, removeCoupon } = useExtraStore();
  
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

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

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Your Cart</h2>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center text-slate-400 mt-20">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-800"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium line-clamp-1">{item.product.name}</h4>
                      <div className="text-emerald-400 font-bold mb-2">${item.product.price.toFixed(2)}</div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                {/* Coupon Section */}
                <div className="mb-6">
                  {coupon ? (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl mb-4">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium">
                        <Tag className="w-4 h-4" />
                        {coupon.code} (-{coupon.type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`})
                      </div>
                      <button onClick={removeCoupon} className="text-slate-400 hover:text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code..."
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button 
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-red-400 text-sm mt-1">{couponError}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-xl pt-3 border-t border-slate-800">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
