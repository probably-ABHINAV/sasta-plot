"use client"

import { useEffect, useState } from "react"
import { getToken, clearToken } from "@/lib/auth-client"
import { useApi } from "@/lib/api"
import { DashboardFavorites } from "@/components/dashboard-favorites"

type Me = {
  _id: string
  name?: string
  email: string
  favorites?: string[]
}

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(getToken())
  }, [])

  const { data: me, isLoading, error } = useApi<Me>(token ? "/me" : "", token || undefined)

  if (!token) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-semibold">My Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          You’re not signed in. Please{" "}
          <a href="/auth/login" className="text-emerald-700 hover:underline">
            sign in
          </a>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Dashboard</h1>
        <button
          onClick={() => {
            clearToken()
            window.location.href = "/auth/login"
          }}
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
        >
          Sign out
        </button>
      </div>

      {isLoading && <p className="mt-4 text-muted-foreground">Loading...</p>}
      {error && <p className="mt-4 text-red-600">Failed to load your account</p>}
      {me && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Account</h2>
            <p className="text-sm text-muted-foreground">Name: {me.name || "—"}</p>
            <p className="text-sm text-muted-foreground">Email: {me.email}</p>
          </section>
          <section className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">Favorites</h2>
            <div className="mt-2">
              <DashboardFavorites />
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
