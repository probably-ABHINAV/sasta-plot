"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { buildApiUrl } from "@/lib/api"
import { getAdminToken } from "@/lib/admin-auth-client"

export default function AdminDeletePlotPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onDelete() {
    setLoading(true)
    setError("")
    try {
      const token = getAdminToken() || undefined
      const res = await fetch(buildApiUrl(`/admin/plots/${id}`), {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!res.ok) throw new Error(await res.text())
      router.replace("/admin")
    } catch (e: any) {
      setError(e?.message || "Failed to delete plot")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Delete Plot</h1>
      <p className="mt-2 text-muted-foreground">
        Are you sure you want to delete this plot? This action cannot be undone.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onDelete}
          disabled={loading}
          className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-70"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
        <button onClick={() => router.back()} className="rounded-md border px-4 py-2 text-sm hover:bg-accent/50">
          Cancel
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </main>
  )
}
