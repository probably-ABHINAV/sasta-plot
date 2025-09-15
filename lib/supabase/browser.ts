"use client"
import { createBrowserClient } from "@supabase/ssr"

export function getBrowserSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  // Log configuration in development only
  if (process.env.NODE_ENV === 'development') {
    console.log('Browser Supabase config:', { url: supabaseUrl, keyExists: !!supabaseAnonKey })
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
