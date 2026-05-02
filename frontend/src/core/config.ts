/**
 * Centralized Application Configuration
 * Focus: Scalability & Maintainability
 */

export const CONFIG = {
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    TIMEOUT: 15000,
  },
  SUPABASE: {
    URL: import.meta.env.VITE_SUPABASE_URL || '',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  APP: {
    NAME: 'Portfolio Premium',
    VERSION: '1.2.0',
  }
};

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  LOGIN: '/login',
  ADMIN: {
    DASHBOARD: '/admin',
    FEEDBACK: '/admin/feedback',
    // Add other admin routes here
  }
};
