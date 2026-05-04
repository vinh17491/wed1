/**
 * Global Error Handler Utility
 * Categorizes errors by type and provides structured error information.
 */

export interface AppError {
  message: string;
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
  status?: number;
  details?: Record<string, unknown>;
}

/**
 * Classify and handle errors from API calls or other async operations.
 * Returns a user-friendly message string for backwards compatibility,
 * and logs structured error information.
 */
export const handleError = (error: unknown): string => {
  const appError = classifyError(error);

  // Log structured error to console (or future external service like Sentry)
  console.error(`[${appError.type.toUpperCase()} Error]:`, {
    message: appError.message,
    status: appError.status,
    details: appError.details
  });

  return appError.message;
};

/**
 * Classify an unknown error into a structured AppError.
 */
export const classifyError = (error: unknown): AppError => {
  // Axios-style error
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    const serverMessage = axiosError.response?.data?.message;

    if (!axiosError.response && axiosError.request) {
      return {
        message: 'Network error. Please check your connection and try again.',
        type: 'network',
        details: { originalMessage: axiosError.message }
      };
    }

    if (status === 401 || status === 403) {
      return {
        message: status === 401 
          ? 'Your session has expired. Please log in again.' 
          : 'You do not have permission to perform this action.',
        type: 'auth',
        status,
        details: axiosError.response?.data
      };
    }

    if (status === 400 || status === 422) {
      return {
        message: serverMessage || 'Invalid input. Please check your data and try again.',
        type: 'validation',
        status,
        details: axiosError.response?.data
      };
    }

    if (status && status >= 500) {
      return {
        message: serverMessage || 'Server error. Please try again later.',
        type: 'server',
        status,
        details: axiosError.response?.data
      };
    }

    return {
      message: serverMessage || axiosError.message || 'An unexpected error occurred.',
      type: 'unknown',
      status,
      details: axiosError.response?.data
    };
  }

  // Timeout / network errors
  if (error && typeof error === 'object' && 'code' in error) {
    const coded = error as any;
    if (coded.code === 'ECONNABORTED' || coded.code === 'ERR_NETWORK') {
      return {
        message: 'Request timed out. Please try again.',
        type: 'network',
        details: { code: coded.code }
      };
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred.',
      type: 'unknown',
      details: { name: error.name, stack: error.stack }
    };
  }

  // Unknown shape
  return {
    message: typeof error === 'string' ? error : 'An unexpected error occurred.',
    type: 'unknown'
  };
};
