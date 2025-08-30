"use client"

import type React from "react"
import { useEffect, useState, useMemo, useRef } from "react"
import { postJson, getJson, buildApiUrl } from "@/lib/api"
import { getAdminToken } from "@/lib/admin-auth-client"
import type { ApiItemResponse, BlogPost } from "@/types"
import { useRouter } from "next/navigation"

type Props = {
  mode: "create" | "edit"
  postId?: string
}

type FormState = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  publishedAt: string
}

const emptyState: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  publishedAt: "",
}

export function AdminBlogForm({ mode, postId }: Props) {
  const [state, setState] = useState<FormState>(emptyState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const token = getAdminToken() || undefined
  const originalRef = useRef<FormState | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      if (mode === "edit" && postId && token) {
        try {
          const res = await getJson<ApiItemResponse<BlogPost>>(`/admin/blog/${postId}`, token)
          if (!active) return
          const p = res.data
          setState({
            title: p.title || "",
            slug: p.slug || "",
            excerpt: p.excerpt || "",
            content: p.content || "",
            coverImage: p.coverImage || "",
            publishedAt: p.publishedAt || "",
          })
          originalRef.current = {
            title: p.title || "",
            slug: p.slug || "",
            excerpt: p.excerpt || "",
            content: p.content || "",
            coverImage: p.coverImage || "",
            publishedAt: p.publishedAt || "",
          }
        } catch (e: any) {
          setError(e?.message || "Failed to load post")
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
  }, [mode, postId, token])

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

  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }))
  }

  function slugify(input: string) {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  }

  async function uploadCover(file: File | null) {
    if (!file || !token) return
    try {
      const form = new FormData()
      form.append("files", file)
      const res = await fetch(buildApiUrl("/admin/upload"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const json = (await res.json()) as { files: string[] }
      const first = json.files?.[0]
      if (first) setState((s) => ({ ...s, coverImage: first }))
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
        slug: state.slug ? slugify(state.slug) : undefined,
        excerpt: state.excerpt.trim(),
        content: state.content.trim(),
        coverImage: state.coverImage.trim() || undefined,
        publishedAt: state.publishedAt || undefined,
      }
      if (mode === "create") {
        await postJson("/admin/blog", payload, token)
      } else if (mode === "edit" && postId) {
        await fetch(buildApiUrl(`/admin/blog/${postId}`), {
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
      setError(e?.message || "Failed to save post")
    } finally {
      setLoading(false)
    }
  }

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
          <label className="block text-sm font-medium">Slug</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              value={state.slug}
              onChange={(e) => setField("slug", e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="my-first-post"
              aria-label="Post slug"
            />
            <button
              type="button"
              onClick={() => setField("slug", slugify(state.title || state.slug))}
              className="rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
              aria-label="Generate slug from title"
              title="Generate slug from title"
            >
              Generate
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Excerpt</label>
          <textarea
            value={state.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Cover Image URL</label>
          <input
            value={state.coverImage}
            onChange={(e) => setField("coverImage", e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            placeholder="https://..."
          />
          <div className="mt-2 flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadCover(e.target.files?.[0] || null)}
              className="block text-sm"
            />
            {state.coverImage ? (
              <img
                src={state.coverImage || "/placeholder.svg"}
                alt="Cover preview"
                className="h-12 w-20 rounded-md border object-cover"
              />
            ) : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Paste a URL or upload a file to set the cover image.</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Published At</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="date"
              value={state.publishedAt}
              onChange={(e) => setField("publishedAt", e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
              aria-label="Published date"
            />
            <button
              type="button"
              onClick={() => {
                const d = new Date()
                const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0, 10)
                setField("publishedAt", iso)
              }}
              className="rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
              aria-label="Publish now"
              title="Publish now"
            >
              Publish now
            </button>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Content</label>
        <textarea
          value={state.content}
          onChange={(e) => setField("content", e.target.value)}
          rows={10}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={handleCancel} className="rounded-md border px-4 py-2 text-sm hover:bg-accent/50">
          Cancel
        </button>
        <button
          disabled={loading}
          className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-70"
        >
          {loading ? "Saving..." : mode === "create" ? "Create Post" : "Save Changes"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
