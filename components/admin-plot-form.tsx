"use client"

import type React from "react"

import { useEffect, useState, useMemo, useRef } from "react"
import { postJson, buildApiUrl, getJson } from "@/lib/api"
import { getAdminToken } from "@/lib/admin-auth-client"
import type { Plot, ApiItemResponse } from "@/types"
import { useRouter } from "next/navigation"

type Props = {
  mode: "create" | "edit"
  plotId?: string
}

type FormState = {
  title: string
  location: string
  price: string
  sizeSqft: string
  facing: Plot["facing"] | ""
  approvalType: Plot["approvalType"] | ""
  isCornerPlot: boolean
  description: string
  images: string[]
  mapEmbedUrl: string
  featured: boolean
}

const emptyState: FormState = {
  title: "",
  location: "",
  price: "",
  sizeSqft: "",
  facing: "",
  approvalType: "",
  isCornerPlot: false,
  description: "",
  images: [""],
  mapEmbedUrl: "",
  featured: false,
}

export function AdminPlotForm({ mode, plotId }: Props) {
  const [state, setState] = useState<FormState>(emptyState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const token = getAdminToken() || undefined
  const originalRef = useRef<FormState | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      if (mode === "edit" && plotId && token) {
        try {
          const res = await getJson<ApiItemResponse<Plot>>(`/admin/plots/${plotId}`, token)
          if (!active) return
          const p = res.data
          setState({
            title: p.title || "",
            location: p.location || "",
            price: p.price?.toString() || "",
            sizeSqft: p.sizeSqft?.toString() || "",
            facing: (p.facing as any) || "",
            approvalType: (p.approvalType as any) || "",
            isCornerPlot: !!p.isCornerPlot,
            description: p.description || "",
            images: p.images && p.images.length ? p.images : [""],
            mapEmbedUrl: p.mapEmbedUrl || "",
            featured: !!(p as any)?.featured,
          })
          originalRef.current = {
            title: p.title || "",
            location: p.location || "",
            price: p.price?.toString() || "",
            sizeSqft: p.sizeSqft?.toString() || "",
            facing: (p.facing as any) || "",
            approvalType: (p.approvalType as any) || "",
            isCornerPlot: !!p.isCornerPlot,
            description: p.description || "",
            images: p.images && p.images.length ? p.images : [""],
            mapEmbedUrl: p.mapEmbedUrl || "",
            featured: !!(p as any)?.featured,
          }
        } catch (e: any) {
          setError(e?.message || "Failed to load plot")
        }
      }
    }
    load()
    if (mode === "create") {
      originalRef.current = emptyState
    }
    return () => {
      active = false
    }
  }, [mode, plotId, token])

  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }))
  }

  function updateImage(i: number, v: string) {
    setState((s) => {
      const next = [...s.images]
      next[i] = v
      return { ...s, images: next }
    })
  }

  function addImageField() {
    setState((s) => ({ ...s, images: [...s.images, ""] }))
  }

  function removeImageField(i: number) {
    setState((s) => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }))
  }

  async function uploadImages(files: FileList | null) {
    if (!files || !files.length || !token) return
    try {
      const form = new FormData()
      Array.from(files).forEach((f) => form.append("files", f))
      const res = await fetch(buildApiUrl("/admin/upload"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const json = (await res.json()) as { files: string[] }
      setState((s) => ({ ...s, images: [...s.images.filter(Boolean), ...(json.files || [])] }))
    } catch (e: any) {
      setError(e?.message || "Upload failed")
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const payload = {
        title: state.title.trim(),
        location: state.location.trim(),
        price: Number(state.price) || 0,
        sizeSqft: Number(state.sizeSqft) || 0,
        facing: state.facing || undefined,
        approvalType: state.approvalType || undefined,
        isCornerPlot: !!state.isCornerPlot,
        description: state.description.trim(),
        images: state.images.filter(Boolean),
        mapEmbedUrl: state.mapEmbedUrl.trim() || undefined,
        featured: !!state.featured,
      }
      if (mode === "create") {
        await postJson("/admin/plots", payload, token)
      } else if (mode === "edit" && plotId) {
        await fetch(buildApiUrl(`/admin/plots/${plotId}`), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        }).then(async (r) => {
          if (!r.ok) throw new Error(await r.text())
        })
      }
      router.push("/admin")
    } catch (e: any) {
      setError(e?.message || "Failed to save plot")
    } finally {
      setLoading(false)
    }
  }

  const isDirty = useMemo(() => {
    if (!originalRef.current) return false
    try {
      return JSON.stringify({ ...state }) !== JSON.stringify({ ...originalRef.current })
    } catch {
      return false
    }
  }, [state])

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  function handleCancel() {
    if (isDirty && !confirm("You have unsaved changes. Discard and leave?")) return
    window.location.href = "/admin"
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            value={state.title}
            onChange={(e) => setField("title", e.target.value)}
            required
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            value={state.location}
            onChange={(e) => setField("location", e.target.value)}
            required
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (₹)</label>
          <input
            value={state.price}
            onChange={(e) => setField("price", e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Size (sqft)</label>
          <input
            value={state.sizeSqft}
            onChange={(e) => setField("sizeSqft", e.target.value)}
            inputMode="numeric"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Facing</label>
          <select
            value={state.facing || ""}
            onChange={(e) => setField("facing", e.target.value as any)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Select Facing</option>
            <option>East</option>
            <option>West</option>
            <option>North</option>
            <option>South</option>
            <option>Northeast</option>
            <option>Northwest</option>
            <option>Southeast</option>
            <option>Southwest</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Approval Type</label>
          <select
            value={state.approvalType || ""}
            onChange={(e) => setField("approvalType", e.target.value as any)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Select Approval</option>
            <option>DTCP</option>
            <option>CMDA</option>
            <option>Panchayat</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="isCornerPlot"
            type="checkbox"
            checked={state.isCornerPlot}
            onChange={(e) => setField("isCornerPlot", e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="isCornerPlot" className="text-sm">
            Corner Plot
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={state.featured}
            onChange={(e) => setField("featured", e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="featured" className="text-sm">
            Featured
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={state.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Map Embed URL</label>
        <input
          value={state.mapEmbedUrl}
          onChange={(e) => setField("mapEmbedUrl", e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="https://maps.google.com/..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">Image URLs</label>
          <button type="button" onClick={addImageField} className="text-sm text-emerald-700 hover:underline">
            + Add image
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {state.images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="https://..."
              />
              {img ? (
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Preview ${i + 1}`}
                  className="h-10 w-16 rounded-md border object-cover"
                />
              ) : null}
              {state.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(i)}
                  className="rounded-md border px-2 py-2 text-sm hover:bg-accent/50"
                  aria-label={`Remove image ${i + 1}`}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium">Or upload files</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => uploadImages(e.target.files)}
            className="mt-1 block w-full text-sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            You can mix URLs and uploads. Uploaded files will append to the list above.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={handleCancel} className="rounded-md border px-4 py-2 text-sm hover:bg-accent/50">
          Cancel
        </button>
        <button
          disabled={loading}
          className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-70"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Plot" : "Save Changes"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
