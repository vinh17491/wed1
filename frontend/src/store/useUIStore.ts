import { create } from 'zustand';

interface UIState {
  isCartOpen: boolean;
  activeModal: 'add' | 'edit' | 'delete' | null;
  
  // Actions
  setCartOpen: (open: boolean) => void;
  openModal: (type: 'add' | 'edit' | 'delete') => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  activeModal: null,

  setCartOpen: (open) => set({ isCartOpen: open }),
  openModal: (type) => set({ activeModal: type }),
  closeModal: () => set({ activeModal: null }),
}));
