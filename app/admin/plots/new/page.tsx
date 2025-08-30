"use client"

import { AdminPlotForm } from "@/components/admin-plot-form"

export default function AdminNewPlotPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Add New Plot</h1>
      <div className="mt-4">
        <AdminPlotForm mode="create" />
      </div>
    </main>
  )
}
