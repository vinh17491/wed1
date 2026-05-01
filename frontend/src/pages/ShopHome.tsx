import { useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useCartStore } from '../store/useCartStore';

import { ShopHero } from '../components/shop/ShopHero';
import { SearchFilterPanel } from '../components/shop/SearchFilterPanel';
import { ProductGrid } from '../components/shop/ProductGrid';
import { ProductDetailModal } from '../components/shop/ProductDetailModal';
import { CartDrawer } from '../components/shop/CartDrawer';
import { RecentlyViewed } from '../components/shop/RecentlyViewed';

export default function ShopHome() {
  const { setCartOpen } = useUIStore();
  const { cartItems } = useCartStore();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Set the dark background for the whole shop page
  useEffect(() => {
    document.body.style.backgroundColor = '#020617'; // slate-950
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30">
      {/* Navbar specific to Shop */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-emerald-500">Shop</span>
            <span className="text-white">Premium</span>
          </div>
          
          <button 
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-slate-300" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <ShopHero />
        <SearchFilterPanel />
        <ProductGrid />
        <RecentlyViewed />
      </main>

      {/* Overlays */}
      <ProductDetailModal />
      <CartDrawer />
    </div>
  );
}
