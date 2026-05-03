import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ypmpsljlxgfexknhgysa.supabase.co';
const supabaseKey = 'sb_publishable_rA1qiq7Hz1xr4ejPLnDa2g_ExsKv93M';

export const supabase = createClient(supabaseUrl, supabaseKey);
