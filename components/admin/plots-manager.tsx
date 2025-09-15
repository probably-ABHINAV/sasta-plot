"use client"

import type React from "react"

import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { getBrowserSupabase } from "@/lib/supabase/browser"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ImageUploader from "../image-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice, calculatePriceFromFormatted, getPriceFormatSuggestion, type PriceFormat } from "@/lib/utils/price"

type PlotRow = {
  id: string
  title: string
  location: string
  price: number
  size: number
  size_sqyd: number
  size_unit?: string
  description?: string
  featured?: boolean
  image?: string
  image_url?: string
  images?: string[] // Added to handle multiple images
  slug: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PlotsManager() {
  const { data, mutate, isLoading } = useSWR<{ plots: PlotRow[] }>("/api/plots", fetcher)
  const supabase = getBrowserSupabase()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    title: string
    location: string
    price: string
    priceFormat: PriceFormat
    size_sqyd: string
    size_unit: string
    description: string
    featured: boolean
    images: string[]
  }>({
    title: "",
    location: "",
    price: "",
    priceFormat: "lakh" as PriceFormat,
    size_sqyd: "",
    size_unit: "sq.yd",
    description: "",
    featured: false,
    images: []
  })
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    priceFormat: "lakh" as PriceFormat,
    size_sqyd: "",
    size_unit: "sq.yd",
    description: "",
    featured: false,
    file: null as File | null, // This will be replaced by ImageUploader's output
    images: [] as string[], // To store multiple image URLs from ImageUploader
  })

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      let primaryImage: string | undefined;
      let uploadedImageUrls: string[] = [];

      // Use images from ImageUploader
      if (form.images.length > 0) {
        primaryImage = form.images[0]; // Set the first uploaded image as primary
        uploadedImageUrls = form.images;
      } else {
        throw new Error('Please upload at least one image')
      }


      const res = await fetch("/api/plots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          price: calculatePriceFromFormatted(form.price, form.priceFormat),
          size_sqyd: Number(form.size_sqyd),
          description: form.description,
          featured: form.featured,
          image_url: primaryImage, // Use the primary image URL
          images: uploadedImageUrls, // Use the array of image URLs
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
        priceFormat: "lakh" as PriceFormat,
        size_sqyd: "",
        size_unit: "sq.yd",
        description: "",
        featured: false,
        file: null,
        images: [], // Reset images
      })
      mutate()
    } catch (err: any) {
      alert(`Create failed: ${err?.message || "unknown error"}`)
    } finally {
      setCreating(false)
    }
  }

  const handleEdit = (plot: PlotRow) => {
    setEditForm({
      title: plot.title,
      location: plot.location,
      price: (plot.price / 100000).toFixed(2), // Convert to lakh format for editing
      priceFormat: getPriceFormatSuggestion(plot.price),
      size_sqyd: plot.size_sqyd.toString(),
      size_unit: "sq.yd",
      description: plot.description || "",
      featured: plot.featured || false,
      images: plot.images || []
    })
    setEditing(plot.id)
  }

  const handleUpdate = async (e: React.FormEvent, plotId: string) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/plots/${plotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          location: editForm.location,
          price: calculatePriceFromFormatted(editForm.price, editForm.priceFormat),
          size_sqyd: Number(editForm.size_sqyd),
          size_unit: editForm.size_unit,
          description: editForm.description,
          featured: editForm.featured,
          images: editForm.images,
        }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText)
      }
      setEditing(null)
      mutate()
    } catch (err: any) {
      alert(`Update failed: ${err?.message || "unknown error"}`)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure?")) return
    try {
      const res = await fetch(`/api/plots/${slug}`, { method: "DELETE" })
      if (!res.ok) {
        alert("Delete failed")
        return
      }
      mutate()
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
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border px-3 py-2"
              placeholder="Price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
            <select
              className="rounded border px-3 py-2 bg-background"
              value={form.priceFormat}
              onChange={(e) => setForm((f) => ({ ...f, priceFormat: e.target.value as PriceFormat }))}
            >
              <option value="lakh">Lakh</option>
              <option value="crore">Crore</option>
              <option value="thousand">Thousand</option>
              <option value="raw">Raw (₹)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border px-3 py-2"
              placeholder="Size"
              type="number"
              value={form.size_sqyd}
              onChange={(e) => setForm((f) => ({ ...f, size_sqyd: e.target.value }))}
              required
            />
            <select
              className="rounded border px-3 py-2 bg-background"
              value={form.size_unit}
              onChange={(e) => setForm((f) => ({ ...f, size_unit: e.target.value }))}
            >
              <option value="sq.yd">sq.yd</option>
              <option value="sq.ft">sq.ft</option>
              <option value="sq.m">sq.m</option>
              <option value="acres">acres</option>
              <option value="bigha">bigha</option>
              <option value="katha">katha</option>
            </select>
          </div>
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
        {/* Replaced the single file input with ImageUploader */}
        <div className="grid w-full items-center gap-1.5">
          <Label className="text-white">Plot Images</Label>
          <ImageUploader
            onUpload={(urls: string[]) => setForm(prev => ({ ...prev, images: urls }))}
            currentImages={form.images}
            maxFiles={5}
          />
        </div>
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
                {editing === p.id ? (
                  // Edit form
                  <form onSubmit={(e) => handleUpdate(e, p.id)} className="p-4 space-y-3">
                    <input
                      className="w-full rounded border px-3 py-2"
                      placeholder="Title"
                      value={editForm.title}
                      onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                    <input
                      className="w-full rounded border px-3 py-2"
                      placeholder="Location"
                      value={editForm.location}
                      onChange={(e) => setEditForm(f => ({ ...f, location: e.target.value }))}
                      required
                    />
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded border px-3 py-2"
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))}
                        required
                      />
                      <select
                        className="rounded border px-3 py-2 bg-background"
                        value={editForm.priceFormat}
                        onChange={(e) => setEditForm(f => ({ ...f, priceFormat: e.target.value as PriceFormat }))}
                      >
                        <option value="lakh">Lakh</option>
                        <option value="crore">Crore</option>
                        <option value="thousand">Thousand</option>
                        <option value="raw">Raw (₹)</option>
                      </select>
                    </div>
                    <input
                      className="w-full rounded border px-3 py-2"
                      placeholder="Size"
                      type="number"
                      value={editForm.size_sqyd}
                      onChange={(e) => setEditForm(f => ({ ...f, size_sqyd: e.target.value }))}
                      required
                    />
                    <textarea
                      className="w-full rounded border px-3 py-2"
                      placeholder="Description"
                      value={editForm.description}
                      onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editForm.featured}
                        onChange={(e) => setEditForm(f => ({ ...f, featured: e.target.checked }))}
                      />
                      Featured
                    </label>
                    <div>
                      <Label className="text-white">Update Images</Label>
                      <ImageUploader
                        onUpload={(urls: string[]) => setEditForm(prev => ({ ...prev, images: urls }))}
                        currentImages={editForm.images}
                        maxFiles={5}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 rounded bg-green-600 px-4 py-2 text-white"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded bg-gray-600 px-4 py-2 text-white"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  // Display mode
                  <>
                    {(p.images && p.images.length > 0) ? (
                      <div className="relative aspect-video w-full">
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      </div>
                    ) : (p.image_url || p.image) ? (
                      <div className="relative aspect-video w-full">
                        <Image src={p.image_url || p.image || "/placeholder.svg"} alt={p.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="relative aspect-video w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="mb-1 text-xs text-muted-foreground">#{p.id}</div>
                      <h3 className="font-heading text-lg">{p.title}</h3>
                      <p className="text-sm">{p.location}</p>
                      <p className="text-sm">{typeof p.price === 'string' ? p.price : formatPrice(Number(p.price), getPriceFormatSuggestion(Number(p.price)))}</p>
                      <p className="text-sm">Size: {typeof p.size_sqyd === 'string' ? p.size_sqyd : `${p.size_sqyd} sq.yd`}</p>
                      <p className="text-sm">Slug: {p.slug}</p>
                      <p className="text-sm">Images: {p.images?.length || 0}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(p.slug)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}