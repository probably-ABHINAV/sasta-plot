"use client"

import Link from "next/link"
import { useIsAdmin } from "@/hooks/use-is-admin"

export default function AdminBlogPage() {
  const { isAdmin, loading } = useIsAdmin()
  if (loading) return <main className="px-4 py-8">Checking permissions…</main>
  if (!isAdmin) return <main className="px-4 py-8">Not authorized.</main>

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manage Blog</h1>
          <p className="text-sm text-muted-foreground">Create and edit blog posts. (Demo placeholder)</p>
        </div>
        <Link href="/admin" className="text-sm text-primary hover:opacity-90">
          ← Back to Admin
        </Link>
      </div>

      <div className="rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">
          This is a demo-only page. Connect a database (e.g., Supabase) to enable real blog CRUD. Until then, this
          section is a visual placeholder so your client can navigate the full admin experience.
        </p>
      </div>
    </main>
  )
}
