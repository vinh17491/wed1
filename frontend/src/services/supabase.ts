import { createClient } from '@supabase/supabase-js';

// ĐÂY LÀ FILE RIÊNG TƯ - CHỈ DÙNG CHO CÁ NHÂN
// Vui lòng không chia sẻ các thông tin bên dưới
export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL || '',
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export const supabase = createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
