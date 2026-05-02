/**
 * Global Error Handler Utility
 */

export const handleError = (error: any) => {
  const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
  
  // Log to console (or external service like Sentry)
  console.error('[Global Error]:', {
    message,
    status: error.response?.status,
    details: error.response?.data
  });

  // You can trigger global UI notifications here (e.g. toast.error(message))
  return message;
};
