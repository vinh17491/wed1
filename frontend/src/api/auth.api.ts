import { supabase } from '../core/supabaseClient';

export const authApi = {
  signUp: (email: string, password: string) => 
    supabase.auth.signUp({ email, password }),

  signIn: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => 
    supabase.auth.signOut(),

  getSession: () => 
    supabase.auth.getSession(),
};
