import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { Product } from '../types/shop';

export interface CartItem {
  id: string; 
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>;
  note?: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const MAX_QUANTITY = 99;

/**
 * Deep validation for a cart item – used during rehydration and operations.
 * Ensures all required fields exist with correct types.
 */
const isValidCartItem = (item: any): item is CartItem => {
  return (
    item != null &&
    typeof item.id === 'string' &&
    typeof item.productId === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0 &&
    item.quantity <= MAX_QUANTITY &&
    item.product != null &&
    typeof item.product.id === 'string' &&
    typeof item.product.name === 'string' &&
    typeof item.product.price === 'number' &&
    item.product.price >= 0
  );
};

/**
 * Generate a robust unique ID that avoids collision even under spam-click.
 * Prefers crypto.randomUUID when available; falls back to a composite
 * random string that combines Math.random, timestamp, and a monotonic counter.
 */
let idCounter = 0;
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  idCounter += 1;
  const part1 = Math.random().toString(36).substring(2, 9);
  const part2 = Date.now().toString(36);
  const part3 = idCounter.toString(36);
  return `${part1}-${part2}-${part3}`;
};

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
    (set, get) => ({
      cartItems: [] as CartItem[],
      addToCart: (newItem) => set((state) => {
        // Guard: product must be valid
        if (!newItem.product || typeof newItem.product.price !== 'number' || newItem.product.price < 0) {
          console.warn('[Cart] Attempted to add invalid product:', newItem);
          return state;
        }

        const existingItemIndex = state.cartItems.findIndex(item => isSameConfig(item, newItem));
        if (existingItemIndex > -1) {
          const updatedItems = state.cartItems.map((item, index) => {
            if (index === existingItemIndex) {
              const newQty = Math.min(item.quantity + (newItem.quantity || 1), MAX_QUANTITY);
              return { ...item, quantity: newQty };
            }
            return item;
          });
          return { cartItems: updatedItems };
        }

        const itemWithId: CartItem = {
          ...newItem,
          id: generateId(),
          quantity: Math.min(Math.max(1, newItem.quantity || 1), MAX_QUANTITY)
        };
        return { cartItems: [...state.cartItems, itemWithId] };
      }),
      removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cartItems: state.cartItems.map(item => 
          item.id === id ? { ...item, quantity: Math.min(Math.max(1, quantity), MAX_QUANTITY) } : item
        )
      })),
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: (): number => {
        const state = get();
        return (state.cartItems || []).reduce((acc: number, item: CartItem) => {
          const price = Number(item.product?.price || 0);
          const qty = Number(item.quantity || 0);
          if (isNaN(price) || isNaN(qty)) return acc;
          return acc + (price * qty);
        }, 0);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state || !Array.isArray(state?.cartItems)) {
          state?.clearCart();
          return;
        }
        // Deep validate every item — remove corrupted entries instead of clearing all
        const validItems = state.cartItems.filter(isValidCartItem);
        if (validItems.length !== state.cartItems.length) {
          console.warn(
            `[Cart Rehydration] Removed ${state.cartItems.length - validItems.length} invalid cart items.`
          );
          // Use direct state mutation since we're inside rehydration callback
          useCartStore.setState({ cartItems: validItems });
        }
      }
    }
  )
);
