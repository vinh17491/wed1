import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

if (!CONFIG.SUPABASE.URL || !CONFIG.SUPABASE.ANON_KEY) {
  const errorMsg = 'WARNING: Supabase credentials missing! Please check your .env file. API features using Supabase will not work.';
  console.error(errorMsg);
  // We don't throw here to allow the app to boot for UI/Local state testing.
}

const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'placeholder-key';

export const supabase = createClient(
  CONFIG.SUPABASE.URL || dummyUrl, 
  CONFIG.SUPABASE.ANON_KEY || dummyKey
);

