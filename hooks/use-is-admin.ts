"use client"

import { useEffect, useState } from "react"
import { getBrowserSupabase } from "@/lib/supabase/browser"

type SessionUser = { id: string; email?: string | null } | null

export function useIsAdmin() {
  const [user, setUser] = useState<SessionUser>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Skip if Supabase is not configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        const supabase = getBrowserSupabase()
        const { data, error } = await supabase.auth.getUser()
        if (mounted) setUser(error ? null : (data.user ?? null))
      } catch {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Check if user email is in admin list
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
  const isAdmin = !!user && adminEmails.includes(user.email || '')

  return { user, isAdmin, loading }
}
