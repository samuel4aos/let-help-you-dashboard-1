import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aafbzgcfoqgbiupovbnr.supabase.co';
const supabaseAnonKey = 'sb_publishable_Sk0aUdW2OlV28gzCAJEQWQ_cBe40KDg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);