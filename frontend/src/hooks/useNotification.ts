import { useState, useCallback } from 'react';

/**
 * Hook to manage temporary notifications/popups
 */
export const useNotification = (duration = 3000) => {
  const [message, setMessage] = useState<string | null>(null);

  const notify = useCallback((msg: string, customDuration?: number) => {
    setMessage(msg);
    const timer = setTimeout(() => {
      setMessage(null);
    }, customDuration || duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return { message, notify, setMessage };
};
