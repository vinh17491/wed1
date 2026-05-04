import { useState, useCallback } from 'react';
import { handleError } from '../core/errorHandler';

/**
 * Generic hook for async operations with built-in:
 * - Loading state
 * - Error state
 * - Double-click / double-submit prevention
 * - Centralized error handling
 *
 * Usage:
 * ```tsx
 * const { execute, loading, error } = useAsyncAction();
 * const handleSave = () => execute(async () => {
 *   await api.save(data);
 *   toast.success('Saved!');
 * });
 * ```
 */
export function useAsyncAction<T = void>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (fn: () => Promise<T>): Promise<T | null> => {
    if (loading) return null; // Prevent double-click
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err: unknown) {
      const msg = handleError(err);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const clearError = useCallback(() => setError(null), []);

  return { execute, loading, error, clearError };
}
