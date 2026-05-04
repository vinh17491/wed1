import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

if (!CONFIG.SUPABASE.URL || !CONFIG.SUPABASE.ANON_KEY) {
  const errorMsg = 'CRITICAL ERROR: Supabase credentials missing! Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.';
  console.error(errorMsg);
  throw new Error(errorMsg);
}

export const supabase = createClient(
  CONFIG.SUPABASE.URL, 
  CONFIG.SUPABASE.ANON_KEY
);
