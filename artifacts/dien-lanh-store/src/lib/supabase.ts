import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ypmpsljlxgfexknhgysa.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rA1qiq7Hz1xr4ejPLnDa2g_ExsKv93M';

export const supabase = createClient(supabaseUrl, supabaseKey);
