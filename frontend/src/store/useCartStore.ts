import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types/shop';

// --- Constants & Utilities ---
const MAX_QUANTITY = 99;

/**
 * Debug Logger for Cart Actions
 */
const logCart = (action: string, payload: any, items: any[]) => {
  if (import.meta.env.PROD) return;
  console.groupCollapsed(`🛒 [CartStore] ${action}`);
  console.log('%cPayload:', 'color: #3b82f6; font-weight: bold;', payload);
  console.log('%cNew State:', 'color: #10b981; font-weight: bold;', items);
  console.groupEnd();
};

/**
 * Validate Product: Ensures product data is healthy.
 */
const isValidProduct = (p: any): p is Product => {
  return (
    p != null &&
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.price === 'number' &&
    p.price >= 0
  );
};

/**
 * Validate CartItem: Ensures the integrity of a cart row.
 */
const isValidCartItem = (item: any): item is CartItem => {
  return (
    item != null &&
    typeof item.id === 'string' &&
    typeof item.productId === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity >= 1 &&
    item.quantity <= MAX_QUANTITY &&
    isValidProduct(item.product)
  );
};

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
  setCartItems: (items: CartItem[]) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const STORAGE_KEY = "cart_v3";

/**
 * Robust ID Generator with fallback
 */
let idCounter = 0;
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  idCounter += 1;
  const timestamp = typeof performance !== 'undefined' 
    ? Math.floor(performance.now() * 1000).toString(36) 
    : Date.now().toString(36);
    
  let randomPart = '';
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    randomPart = array[0].toString(36);
  } else {
    randomPart = Math.random().toString(36).substring(2, 10);
  }
  return `id-${randomPart}-${timestamp}-${idCounter.toString(36)}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (newItem) => {
        if (!isValidProduct(newItem.product)) {
          console.warn('[Cart] Rejected: Invalid product data.', newItem.product);
          return;
        }

        set((state) => {
          const existingIndex = state.cartItems.findIndex(item => 
            item.productId === newItem.product.id && 
            JSON.stringify(item.selectedOptions) === JSON.stringify(newItem.selectedOptions) &&
            (item.note || '').trim() === (newItem.note || '').trim()
          );

          let nextItems: CartItem[];

          if (existingIndex > -1) {
            const updatedItems = [...state.cartItems];
            const currentItem = { ...updatedItems[existingIndex] };
            currentItem.quantity = Math.min(currentItem.quantity + (newItem.quantity || 1), MAX_QUANTITY);
            updatedItems[existingIndex] = currentItem;
            nextItems = updatedItems;
          } else {
            const itemWithId: CartItem = {
              ...newItem,
              id: generateId(),
              productId: newItem.product.id,
              quantity: Math.min(Math.max(1, newItem.quantity || 1), MAX_QUANTITY)
            };
            nextItems = [...state.cartItems, itemWithId];
          }

          logCart('addToCart', newItem, nextItems);
          return { cartItems: nextItems };
        });
      },

      updateQuantity: (id, quantity) => {
        const parsedQty = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
        if (isNaN(parsedQty) || typeof id !== 'string') return;

        set((state) => {
          let nextItems: CartItem[];
          if (parsedQty <= 0) {
            nextItems = state.cartItems.filter(item => item.id !== id);
          } else {
            const finalQty = Math.min(parsedQty, MAX_QUANTITY);
            nextItems = state.cartItems.map((item) =>
              item.id === id ? { ...item, quantity: finalQty } : item
            );
          }
          logCart('updateQuantity', { id, quantity: parsedQty }, nextItems);
          return { cartItems: nextItems };
        });
      },

      setCartItems: (items) => {
        const validItems = Array.isArray(items) ? items.filter(isValidCartItem) : [];
        set({ cartItems: validItems });
        logCart('setCartItems', items, validItems);
      },

      removeFromCart: (id) => set((state) => {
        const nextItems = state.cartItems.filter(item => item.id !== id);
        logCart('removeFromCart', { id }, nextItems);
        return { cartItems: nextItems };
      }),

      clearCart: () => {
        set({ cartItems: [] });
        logCart('clearCart', null, []);
      },

      getCartTotal: (): number => {
        const { cartItems } = get();
        if (!Array.isArray(cartItems)) return 0;
        return cartItems
          .filter(isValidCartItem)
          .reduce((acc, item) => {
            const price = item.product.price;
            const qty = item.quantity;
            if (!isFinite(price) || !isFinite(qty)) return acc;
            return acc + (price * qty);
          }, 0);
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!Array.isArray(state.cartItems)) {
          console.warn('[Cart Rehydration] cartItems data corrupted, resetting to empty array.');
          state.cartItems = [];
          return;
        }
        const originalCount = state.cartItems.length;
        const validItems = state.cartItems.filter(isValidCartItem);
        if (validItems.length !== originalCount) {
          console.warn(`[Cart Rehydration] Cleaned up ${originalCount - validItems.length} invalid items.`);
        }
        state.cartItems = validItems;
      }
    }
  )
);
