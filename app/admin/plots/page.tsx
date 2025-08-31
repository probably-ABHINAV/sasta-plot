"use client"

import Link from "next/link"
import { useIsAdmin } from "@/hooks/use-is-admin"
import PlotsManager from "@/components/admin/plots-manager"

export default function AdminPlotsPage() {
  const { isAdmin, loading } = useIsAdmin()
  if (loading) return <main className="px-4 py-8">Checking permissions…</main>
  if (!isAdmin) return <main className="px-4 py-8">Not authorized.</main>

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Manage Plots</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, feature, or remove plots. Images upload to Supabase Storage.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-primary hover:opacity-90">
          ← Back to Admin
        </Link>
      </div>
      <PlotsManager />
    </main>
  )
}
