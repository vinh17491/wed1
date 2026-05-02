import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

if (!CONFIG.SUPABASE.URL || !CONFIG.SUPABASE.ANON_KEY) {
  console.warn('Supabase credentials missing! Check your .env file.');
}

export const supabase = createClient(CONFIG.SUPABASE.URL, CONFIG.SUPABASE.ANON_KEY);
