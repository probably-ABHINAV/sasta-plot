"use client"
import { useIsAdmin } from "@/hooks/use-is-admin"

export default function AdminPage() {
  const { isAdmin, loading } = useIsAdmin()
  if (loading) return <main className="px-4 py-8">Checking permissions…</main>
  if (!isAdmin) return <main className="px-4 py-8">Not authorized.</main>
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-sm text-muted-foreground">Use this area to manage plots and posts.</p>
      <ul className="mt-4 list-disc pl-5">
        <li>
          <a className="text-primary underline" href="/admin/plots">
            Manage Plots
          </a>
        </li>
        <li>
          <a className="text-primary underline" href="/admin/blog">
            Manage Blog
          </a>
        </li>
      </ul>
    </main>
  )
}
