import { createClient } from '@supabase/supabase-js'

// Get environment variables - NO FALLBACKS FOR SECRETS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate client-side environment variables (these are safe to expose)
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}
if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client-side Supabase client (for browser usage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for admin operations, uses service role key)
// This function creates the admin client and validates the service key only on server-side
export function createSupabaseAdmin() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// For backward compatibility, create admin client if we're on server-side
export const supabaseAdmin = typeof window === 'undefined' ? createSupabaseAdmin() : null

// Storage client (can use either regular or admin client depending on needs)
export const storage = supabase.storage
export const storageAdmin = supabaseAdmin?.storage
