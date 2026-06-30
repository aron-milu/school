import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the Supabase client if both env vars are provided.
// Many development setups (local demos) intentionally omit these keys,
// so guard against calling createClient with empty values which throws.
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
	? createClient(supabaseUrl, supabaseAnonKey)
	: null;
