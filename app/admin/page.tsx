"use client"

import { useEffect, useState } from "react"
import { useApi } from "@/lib/api"
import { getAdminToken, clearAdminToken } from "@/lib/admin-auth-client"
import { useRouter } from "next/navigation"
import type { Plot, ApiListResponse, BlogPost } from "@/types"

function useToken() {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  useEffect(() => {
    const t = getAdminToken()
    setToken(t)
    if (!t) {
      router.replace("/admin/login")
    }
  }, [router])
  return token
}

export default function AdminDashboardPage() {
  const token = useToken()
  const { data: plots } = useApi<ApiListResponse<Plot>>(token ? "/admin/plots" : "", token || undefined)
  const { data: posts } = useApi<ApiListResponse<BlogPost>>(token ? "/admin/blog" : "", token || undefined)

  if (!token) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="mt-2">Redirecting to login…</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => {
            clearAdminToken()
            window.location.href = "/admin/login"
          }}
          className="rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
        >
          Sign out
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Listings</h2>
            <a
              href="/admin/plots/new"
              className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
            >
              Add Plot
            </a>
          </div>
          <ul className="space-y-2">
            {plots?.data?.map((p) => (
              <li key={p._id} className="flex items-center justify-between rounded-md border p-2">
                <div>
                  <p className="font-medium">
                    {p.title}
                    {(p as any)?.featured ? (
                      <span className="ml-2 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Featured
                      </span>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted-foreground">{p.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/plots/${p._id}/edit`}
                    className="rounded-md border px-3 py-1 text-sm hover:bg-accent/50"
                  >
                    Edit
                  </a>
                  <a
                    href={`/admin/plots/${p._id}/delete`}
                    className="rounded-md border px-3 py-1 text-sm text-red-600 hover:bg-accent/50"
                  >
                    Delete
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Blog Posts</h2>
            <a
              href="/admin/blog/new"
              className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
            >
              New Post
            </a>
          </div>
          <ul className="space-y-2">
            {posts?.data?.map((b) => (
              <li key={b._id} className="flex items-center justify-between rounded-md border p-2">
                <div>
                  <p className="font-medium">{b.title}</p>
                  <p className="text-sm text-muted-foreground">{b.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/blog/${b._id}/edit`}
                    className="rounded-md border px-3 py-1 text-sm hover:bg-accent/50"
                  >
                    Edit
                  </a>
                  <a
                    href={`/admin/blog/${b._id}/delete`}
                    className="rounded-md border px-3 py-1 text-sm text-red-600 hover:bg-accent/50"
                  >
                    Delete
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
