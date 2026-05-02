import { supabase } from '../core/supabaseClient';

export const productApi = {
  fetchList: () => 
    supabase.from('products').select('*').order('created_at', { ascending: false }),

  create: (data: any) => 
    supabase.from('products').insert(data).select().single(),

  update: (id: string, data: any) => 
    supabase.from('products').update(data).eq('id', id).select().single(),

  delete: (id: string) => 
    supabase.from('products').delete().eq('id', id),

  uploadStorage: (path: string, file: File) => 
    supabase.storage.from('products').upload(path, file),

  getPublicUrl: (path: string) => 
    supabase.storage.from('products').getPublicUrl(path),
};
