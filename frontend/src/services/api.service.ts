import axios from 'axios';
import { CONFIG } from '../core/config';
import { handleError } from '../core/errorHandler';

const api = axios.create({
  baseURL: CONFIG.API.BASE_URL,
  timeout: CONFIG.API.TIMEOUT,
});

/**
 * Basic JWT format check — verifies the token has 3 dot-separated base64 segments.
 * This is NOT cryptographic verification; it prevents obviously corrupt values 
 * from being sent as Authorization headers (e.g. after localStorage corruption).
 */
const isValidJWT = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(p => p.length > 0);
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && isValidJWT(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Prevent multiple simultaneous 401 redirects */
let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleError(error); // Global logging

    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
      // Reset flag after a short delay to allow subsequent 401s if needed
      setTimeout(() => { isRedirecting = false; }, 2000);
    }
    return Promise.reject(error);
  }
);

export default api;
