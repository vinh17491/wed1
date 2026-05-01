import { create } from 'zustand';
import { Product } from '../types/shop';

interface UIState {
  isCartOpen: boolean;
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  selectedProduct: null,
  isProductModalOpen: false,
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  openProductModal: (product) => set({ selectedProduct: product, isProductModalOpen: true }),
  closeProductModal: () => set({ isProductModalOpen: false, selectedProduct: null }),
}));
