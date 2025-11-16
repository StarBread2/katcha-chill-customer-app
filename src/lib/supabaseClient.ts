import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: 
    {
        persistSession: true,    // keep session in localStorage
        autoRefreshToken: true,  // auto-refresh access token with refresh token
        detectSessionInUrl: true // helpful for OAuth flows (optional)
    },
});
