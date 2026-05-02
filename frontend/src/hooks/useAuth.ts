import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { handleError } from '../core/errorHandler';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signIn(email, password);
      navigate('/shop');
    } catch (err: any) {
      const msg = handleError(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signUp(email, password);
      alert('Check your email for the confirmation link!');
      navigate('/login');
    } catch (err: any) {
      const msg = handleError(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return { login, register, logout, loading, error };
};
