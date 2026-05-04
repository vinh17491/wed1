import { create } from 'zustand';
import { Product } from '../types/shop';

interface UIState {
  isCartOpen: boolean;
  activeModal: 'add' | 'edit' | 'delete' | null;
  
  // Product Modal State
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  
  // Actions
  setCartOpen: (open: boolean) => void;
  openModal: (type: 'add' | 'edit' | 'delete') => void;
  closeModal: () => void;
  
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  clearSelectedProduct: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  activeModal: null,
  selectedProduct: null,
  isProductModalOpen: false,

  setCartOpen: (open) => set({ isCartOpen: open }),
  openModal: (type) => set({ activeModal: type }),
  closeModal: () => set({ activeModal: null }),
  
  openProductModal: (product) => set({ selectedProduct: product, isProductModalOpen: true }),
  closeProductModal: () => set({ isProductModalOpen: false }),
  // Delayed clear: call this AFTER exit animation completes to prevent UI flicker
  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
