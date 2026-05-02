/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

/**
 * Standard Error Structure
 */
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
