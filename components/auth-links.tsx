"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type DemoUser = { email: string; role: "admin" | "user" }

export default function AuthLinks({ mobile = false }: { mobile?: boolean }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/auth/mock", { cache: "no-store" })
        const j = await res.json()
        if (mounted) setUser(j.user ?? null)
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

  const linkBase = mobile ? "block rounded-md px-3 py-2 text-sm" : "text-sm font-medium"
  const primaryBtn = mobile
    ? "block rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
    : "inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"

  if (loading) {
    return (
      <span className={mobile ? "px-3 py-2 text-sm text-muted-foreground" : "text-sm text-muted-foreground"}>…</span>
    )
  }

  if (!user) {
    return (
      <div className={mobile ? "grid gap-1" : "flex items-center gap-3"}>
        <Link href="/sign-in" className={`${linkBase} ${mobile ? "hover:bg-secondary" : "hover:opacity-80"}`}>
          Sign in
        </Link>
        <Link href="/sign-up" className={primaryBtn}>
          Create account
        </Link>
      </div>
    )
  }

  return (
    <div className={mobile ? "grid gap-1" : "flex items-center gap-3"}>
      {!mobile && <span className="hidden sm:inline text-xs text-muted-foreground">{user.email}</span>}
      <Link
        href="/admin"
        className={`${linkBase} ${mobile ? "hover:bg-secondary" : "hover:opacity-80"} ${user.role === "admin" ? "" : ""}`}
      >
        {user.role === "admin" ? "Admin" : "Dashboard"}
      </Link>
      <button
        onClick={async () => {
          await fetch("/api/auth/mock", { method: "DELETE" })
          window.location.reload()
        }}
        className={`${linkBase} ${mobile ? "hover:bg-secondary" : "text-muted-foreground hover:text-foreground"}`}
      >
        Logout
      </button>
    </div>
  )
}
