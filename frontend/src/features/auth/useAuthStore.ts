import { create } from 'zustand';
import { authService } from '../dulieu/authService';
import { User } from '@supabase/supabase-js';
import { supabase } from '../dulieu/config';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  signOut: async () => {
    await authService.signOut();
    set({ user: null });
  },
}));

// Setup real-time listener for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null);
});
