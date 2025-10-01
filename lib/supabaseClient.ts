import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fqzfhiybsyoalbhinegt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxemZoaXlic3lvYWxiaGluZWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzU5MzMsImV4cCI6MjA3NDcxMTkzM30.AxFpQUj-Dnr0vzhqwXZRhMs1pihPIgGo7UPwx25D6fA'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxemZoaXlic3lvYWxiaGluZWd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTEzNTkzMywiZXhwIjoyMDc0NzExOTMzfQ.H-k7j3Yl-JVFm_IYmaqwDZAuRwQoA0GgMwTLOEVkTJI'

// Client-side Supabase client (for browser usage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for admin operations, uses service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Storage client (can use either regular or admin client depending on needs)
export const storage = supabase.storage
export const storageAdmin = supabaseAdmin.storage
