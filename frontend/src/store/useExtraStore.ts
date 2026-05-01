import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon, Product } from '../types/shop';

interface ExtraState {
  recentlyViewed: Product[];
  coupon: Coupon | null;
  filters: {
    search: string;
    category: string;
    priceRange: [number, number];
  };
  orderNote: string;
  addRecentlyViewed: (product: Product) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  setFilters: (filters: Partial<ExtraState['filters']>) => void;
  resetFilters: () => void;
  setOrderNote: (note: string) => void;
}

const defaultFilters = { search: '', category: 'All', priceRange: [0, 500] as [number, number] };

export const useExtraStore = create<ExtraState>()(
  persist(
    (set) => ({
      recentlyViewed: [],
      coupon: null,
      filters: defaultFilters,
      orderNote: '',
      addRecentlyViewed: (product) => set((state) => {
        const filtered = state.recentlyViewed.filter(p => p.id !== product.id);
        return {
          recentlyViewed: [product, ...filtered].slice(0, 10) // Keep last 10
        };
      }),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      setFilters: (newFilters) => set((state) => ({ 
        filters: { ...state.filters, ...newFilters } 
      })),
      resetFilters: () => set({ filters: defaultFilters }),
      setOrderNote: (note) => set({ orderNote: note }),
    }),
    {
      name: 'shop-extra-storage',
    }
  )
);
