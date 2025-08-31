"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type Plot = {
  id: string
  title: string
  location?: string
  price?: string
  image?: string
  featured?: boolean
}

const initialRows: Plot[] = [
  {
    id: "1",
    title: "Sector 12 – Corner Plot",
    location: "Noida",
    price: "₹14.5L",
    image: "/images/plots/plot-1.png",
    featured: true,
  },
  {
    id: "2",
    title: "Phase 3 – Park Facing",
    location: "Greater Noida",
    price: "₹12.9L",
    image: "/images/plots/plot-2.png",
    featured: true,
  },
  {
    id: "3",
    title: "NH-9 – Main Road",
    location: "Ghaziabad",
    price: "₹10.9L",
    image: "/images/plots/plot-3.png",
    featured: false,
  },
]

export default function PlotsTable() {
  const [rows, setRows] = useState<Plot[]>([])

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("sasta:plots") : null
    setRows(saved ? (JSON.parse(saved) as Plot[]) : initialRows)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("sasta:plots", JSON.stringify(rows))
  }, [rows])

  function addRow() {
    const id = Math.random().toString(36).slice(2, 9)
    setRows((r) => [
      { id, title: "New Plot", location: "City", price: "₹—", image: "/images/plots/plot-4.png", featured: false },
      ...r,
    ])
  }
  function toggleFeatured(id: string) {
    setRows((r) => r.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)))
  }
  function remove(id: string) {
    setRows((r) => r.filter((p) => p.id !== id))
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Featured Plots</h2>
        <button onClick={addRow} className="rounded-md bg-primary px-3 py-1.5 text-white text-sm hover:opacity-90">
          Add plot
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th>Plot</th>
              <th>Location</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((p) => (
              <tr key={p.id} className="[&>td]:px-3 [&>td]:py-2">
                <td className="flex items-center gap-3">
                  <div className="relative h-12 w-16 overflow-hidden rounded bg-muted">
                    {p.image ? (
                      <Image src={p.image || "/placeholder.svg"} alt={p.title} fill className="object-cover" />
                    ) : null}
                  </div>
                  <input
                    className="min-w-40 rounded border bg-background px-2 py-1"
                    value={p.title}
                    onChange={(e) =>
                      setRows((r) => r.map((x) => (x.id === p.id ? { ...x, title: e.target.value } : x)))
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-full rounded border bg-background px-2 py-1"
                    value={p.location ?? ""}
                    onChange={(e) =>
                      setRows((r) => r.map((x) => (x.id === p.id ? { ...x, location: e.target.value } : x)))
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-full rounded border bg-background px-2 py-1"
                    value={p.price ?? ""}
                    onChange={(e) =>
                      setRows((r) => r.map((x) => (x.id === p.id ? { ...x, price: e.target.value } : x)))
                    }
                  />
                </td>
                <td>
                  <button
                    onClick={() => toggleFeatured(p.id)}
                    className={`rounded px-2 py-1 text-xs ${p.featured ? "bg-primary text-white" : "bg-muted text-foreground"}`}
                  >
                    {p.featured ? "Yes" : "No"}
                  </button>
                </td>
                <td>
                  <button onClick={() => remove(p.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground">
                  No plots yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Demo mode stores data in your browser. Connect a DB to persist for everyone.
      </p>
    </section>
  )
}
