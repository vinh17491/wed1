import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon, Product } from '../types/shop';
import { isValidProduct } from '../utils/validators';

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
        // Validate product before adding
        if (!isValidProduct(product)) {
          console.warn('[ExtraStore] Attempted to add invalid product to recently viewed.');
          return state;
        }
        const filtered = state.recentlyViewed.filter(p => p.id !== product.id);
        return {
          recentlyViewed: [product, ...filtered].slice(0, 10) // Keep last 10
        };
      }),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
      setFilters: (newFilters) => set((state) => {
        // Validate price range bounds
        const merged = { ...state.filters, ...newFilters };
        if (merged.priceRange) {
          merged.priceRange = [
            Math.max(0, merged.priceRange[0]),
            Math.max(merged.priceRange[0], merged.priceRange[1])
          ];
        }
        return { filters: merged };
      }),
      resetFilters: () => set({ filters: defaultFilters }),
      setOrderNote: (note) => set({ orderNote: note }),
    }),
    {
      name: 'shop-extra-storage',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Validate recentlyViewed items on rehydration
        if (Array.isArray(state.recentlyViewed)) {
          const valid = state.recentlyViewed.filter(isValidProduct);
          if (valid.length !== state.recentlyViewed.length) {
            console.warn(`[ExtraStore Rehydration] Removed ${state.recentlyViewed.length - valid.length} invalid items.`);
            useExtraStore.setState({ recentlyViewed: valid });
          }
        } else {
          useExtraStore.setState({ recentlyViewed: [] });
        }
        // Reset filters if corrupted
        if (!state.filters || typeof state.filters.search !== 'string') {
          useExtraStore.setState({ filters: defaultFilters });
        }
      }
    }
  )
);
