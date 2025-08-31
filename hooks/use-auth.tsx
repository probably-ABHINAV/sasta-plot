"use client"
import { useEffect, useState } from "react"
import { getBrowserSupabase } from "@/lib/supabase/browser"

export function useAuth() {
  const supabase = getBrowserSupabase()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription?.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function signUp(email: string, password: string) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
      },
    })
  }
  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }
  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }
  return { user, loading, signUp, signIn, signOut }
}
