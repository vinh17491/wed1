import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string; 
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedOptions?: Record<string, string>;
  note?: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const isSameConfig = (item1: Partial<CartItem>, item2: Partial<CartItem>) => {
  if (item1.productId !== item2.productId) return false;
  const note1 = (item1.note || '').trim();
  const note2 = (item2.note || '').trim();
  if (note1 !== note2) return false;
  const opt1 = item1.selectedOptions || {};
  const opt2 = item2.selectedOptions || {};
  const keys1 = Object.keys(opt1);
  const keys2 = Object.keys(opt2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every(key => opt1[key] === opt2[key]);
};

const STORAGE_KEY = "cart_v2";

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (newItem) => set((state) => {
        const existingItemIndex = state.cartItems.findIndex(item => isSameConfig(item, newItem));
        if (existingItemIndex > -1) {
          const updatedItems = state.cartItems.map((item, index) => {
            if (index === existingItemIndex) {
              return { ...item, quantity: item.quantity + (newItem.quantity || 1) };
            }
            return item;
          });
          return { cartItems: updatedItems };
        }
        const itemWithId: CartItem = {
          ...newItem,
          id: typeof crypto.randomUUID !== 'undefined' ? crypto.randomUUID() : Date.now().toString(),
          quantity: newItem.quantity || 1
        };
        return { cartItems: [...state.cartItems, itemWithId] };
      }),
      removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cartItems: state.cartItems.map(item => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state || !Array.isArray(state?.cartItems)) {
          state?.clearCart();
          return;
        }
        const isValid = state.cartItems.every(item => 
          item && typeof item.productId === 'string' && typeof item.quantity === 'number'
        );
        if (!isValid) state.clearCart();
      }
    }
  )
);
