
"use client"
import { useEffect, useState } from "react"

export function useIsAdmin() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/mock", {
          method: "GET",
          credentials: "include",
          cache: "no-store"
        })
        
        const data = await response.json()
        
        if (mounted) {
          if (data.user && data.user.role === 'admin') {
            setUser({ id: data.user.email, email: data.user.email })
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [])

  const isAdmin = user !== null
  
  return { isAdmin, user, loading }
}
