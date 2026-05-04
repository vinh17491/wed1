import { Product, CartItem } from '../types/shop';

/**
 * Centralized validation utilities for the application.
 * Used by stores during rehydration and by forms before submission.
 */

// ─── Product Validation ─────────────────────────────────────────────────

export const isValidProduct = (p: unknown): p is Product => {
  if (!p || typeof p !== 'object') return false;
  const obj = p as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number' &&
    obj.price >= 0 &&
    typeof obj.image === 'string'
  );
};

// ─── Cart Item Validation ───────────────────────────────────────────────

export const isValidCartItem = (item: unknown): item is CartItem => {
  if (!item || typeof item !== 'object') return false;
  const obj = item as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.productId === 'string' &&
    typeof obj.quantity === 'number' &&
    obj.quantity > 0 &&
    obj.quantity <= 99 &&
    isValidProduct(obj.product)
  );
};

// ─── Form Validation Helpers ────────────────────────────────────────────

/** Returns error message string or null if valid */
export const validateEmail = (email: string): string | null => {
  if (!email?.trim()) return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Invalid email format.';
  return null;
};

/** Returns error message string or null if valid */
export const validatePassword = (pw: string): string | null => {
  if (!pw) return 'Password is required.';
  if (pw.length < 6) return 'Password must be at least 6 characters.';
  return null;
};

/**
 * Validates a URL string.
 * Returns true if the string is a valid http/https URL.
 * Empty strings are considered valid (optional fields).
 */
export const validateUrl = (url: string): boolean => {
  if (!url?.trim()) return true; // Empty is OK for optional fields
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate a required text field.
 * Returns error message or null.
 */
export const validateRequired = (value: string | undefined | null, fieldName: string): string | null => {
  if (!value?.trim()) return `${fieldName} is required.`;
  return null;
};
