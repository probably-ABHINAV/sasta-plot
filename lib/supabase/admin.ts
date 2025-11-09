import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Real Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create a dummy client that will fail gracefully when credentials are missing
// This allows the app to use JSON file fallback without errors
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    // Return a client with dummy credentials that will fail on actual use
    // This prevents the error from being thrown on import
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          persistSession: false
        }
      }
    )
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false
      }
    }
  )
}

export const supabase = createSupabaseClient()