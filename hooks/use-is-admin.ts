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

  // TODO: read profiles.role when you want stricter admin-only access
  return { user, isAdmin: !!user, loading }
}
