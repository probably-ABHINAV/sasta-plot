"use client"

import useSWR from "swr"
import type { Plot } from "@/types"
import { getToken } from "@/lib/auth-client"
import { buildApiUrl } from "@/lib/api"
import { PlotCard } from "@/components/plot-card"

type FavoritesResponse = { favorites: Plot[] }

async function fetcher(url: string) {
  const token = getToken()
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load favorites")
  return res.json()
}

export function DashboardFavorites() {
  const token = getToken()
  const { data, error, isLoading } = useSWR<FavoritesResponse>(token ? buildApiUrl("/favorites") : null, fetcher)

  if (!token) return <p className="text-sm text-muted-foreground">Sign in to view your favorites.</p>
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading favorites…</p>
  if (error) return <p className="text-sm text-red-600">Could not load favorites.</p>

  const items = data?.favorites || []
  if (items.length === 0) return <p className="text-sm text-muted-foreground">You have no favorites yet.</p>

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((p) => (
        <PlotCard key={p._id} plot={p} />
      ))}
    </div>
  )
}
