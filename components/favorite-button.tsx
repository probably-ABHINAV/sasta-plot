"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { getToken } from "@/lib/auth-client"
import { buildApiUrl } from "@/lib/api"
import { cn } from "@/lib/utils"
import { track } from "@vercel/analytics" // add analytics event

async function fetcher(url: string) {
  const token = getToken()
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed")
  return res.json()
}

export function FavoriteButton({ plotId, className }: { plotId: string; className?: string }) {
  const token = getToken()
  const { data, mutate } = useSWR(token ? buildApiUrl("/favorites") : null, fetcher)
  const [loading, setLoading] = useState(false)

  const isFav = !!data?.favorites?.some?.((p: any) => (p._id || p) === plotId)

  async function toggle() {
    if (!token) {
      window.location.href = "/auth/login"
      return
    }
    try {
      setLoading(true)
      const res = await fetch(buildApiUrl(`/favorites/${plotId}`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to toggle")
      try {
        track("favorite_toggle", { plotId }) // custom event
      } catch {}
      await mutate()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={isFav ? "default" : "outline"}
      onClick={toggle}
      disabled={loading}
      className={cn("gap-2", className)}
      aria-pressed={isFav}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("h-4 w-4", isFav ? "fill-current" : "")} />
      {isFav ? "Favorited" : "Favorite"}
    </Button>
  )
}
