"use client"

import { AdminPlotForm } from "@/components/admin-plot-form"
import { useParams } from "next/navigation"

export default function AdminEditPlotPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Edit Plot</h1>
      <div className="mt-4">{id ? <AdminPlotForm mode="edit" plotId={id} /> : <p>Invalid plot ID.</p>}</div>
    </main>
  )
}
