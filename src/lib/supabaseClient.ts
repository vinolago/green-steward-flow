import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined


// Flag consumers can check to know if env was provided at build/runtime
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
    // Do not throw here so components can import the module and show a friendly UI.
    // Log details to help debugging in development.
    // Avoid printing the full anon key to the console for security; only indicate presence.
    console.error(
        "Supabase environment variables are missing or empty.",
        { VITE_SUPABASE_URL: Boolean(supabaseUrl), VITE_SUPABASE_ANON_KEY: Boolean(supabaseAnonKey) }
    )
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
    auth: {
        persistSession: true,     // ✅ keep user logged in
        autoRefreshToken: true,   // ✅ refresh expired tokens automatically
        detectSessionInUrl: true, // ✅ handle OAuth redirects
    },
});
