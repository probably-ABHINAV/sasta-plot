"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { getBrowserSupabase } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"

type PlotRow = {
  id: string
  title: string
  location: string
  price: number
  size: number
  description?: string
  featured?: boolean
  image?: string
  slug: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PlotsManager() {
  const { data, mutate, isLoading } = useSWR<{ plots: PlotRow[] }>("/api/plots", fetcher)
  const supabase = getBrowserSupabase()
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    size_sqyd: "",
    description: "",
    featured: false,
    file: null as File | null,
  })

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      let imageUrl: string | undefined
      if (form.file) {
        const formData = new FormData()
        formData.append('file', form.file)
        formData.append('prefix', 'plots')
        
        const uploadRes = await fetch('/api/storage/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!uploadRes.ok) {
          throw new Error('Upload failed')
        }
        
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.publicUrl
      }

      const res = await fetch("/api/plots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          price: Number(form.price),
          size_sqyd: Number(form.size_sqyd),
          description: form.description,
          featured: form.featured,
          imageUrl,
        }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t)
      }
      setForm({
        title: "",
        location: "",
        price: "",
        size_sqyd: "",
        description: "",
        featured: false,
        file: null,
      })
      mutate()
    } catch (err: any) {
      alert(`Create failed: ${err?.message || "unknown error"}`)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure?")) return
    // Assuming you want to use SWR's mutate for deletion as well
    // and manage loading state for the delete action.
    // The original code provided in the 'changes' was identical to itself,
    // and did not include any state management for delete loading or error.
    // I'm adding a placeholder for that, assuming it might be needed.
    // If you have specific loading/error states for delete, please provide them.
    try {
      const res = await fetch(`/api/plots/${slug}`, { method: "DELETE" })
      if (!res.ok) {
        alert("Delete failed")
        return
      }
      mutate() // Revalidate the SWR data to reflect the deletion
    } catch (error) {
      console.error("Delete error:", error)
      alert("Delete failed")
    }
  }

  const plots = data?.plots || []

  return (
    <section className="space-y-6">
      <form onSubmit={onCreate} className="grid gap-3 rounded-md border p-4">
        <div className="grid gap-2 md:grid-cols-2">
          <input
            className="rounded border px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            required
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="Price (INR)"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
          <input
            className="rounded border px-3 py-2"
            placeholder="Size (sq. yd.)"
            type="number"
            value={form.size_sqyd}
            onChange={(e) => setForm((f) => ({ ...f, size_sqyd: e.target.value }))}
            required
          />
        </div>
        <textarea
          className="rounded border px-3 py-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          Featured
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
        />
        <button
          className="mt-2 rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Plot"}
        </button>
      </form>

      <div>
        <h2 className="font-heading text-xl">Existing Plots</h2>
        {isLoading ? (
          <p className="mt-2 text-muted-foreground">Loading…</p>
        ) : plots.length === 0 ? (
          <p className="mt-2 text-muted-foreground">No plots yet. Create your first one above.</p>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plots.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-md border">
                {p.image ? (
                  <div className="relative aspect-video w-full">
                    <Image src={p.image || "/placeholder.svg"} alt={p.title} fill className="object-cover" />
                  </div>
                ) : null}
                <div className="p-4">
                  <div className="mb-1 text-xs text-muted-foreground">#{p.id}</div>
                  <h3 className="font-heading text-lg">{p.title}</h3>
                  <p className="text-sm">{p.location}</p>
                  <p className="text-sm">{typeof p.price === 'string' ? p.price : `₹${Number(p.price).toLocaleString()}`}</p>
                  <p className="text-sm">Size: {typeof p.size === 'string' ? p.size : `${p.size} sq. yd.`}</p>
                  <p className="text-sm">Slug: {p.slug}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(p.slug)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}