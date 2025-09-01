// This avoids SQL create_bucket issues by creating/updating the bucket via API.
import { createClient } from "@supabase/supabase-js"

// Only create admin client if environment variables are available
export const supabaseAdmin = (() => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY - admin client not available")
    return null
  }
  
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    db: { schema: "public" },
  })
})()
