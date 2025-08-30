"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

export function PlotFilters() {
  const sp = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const initial = useMemo(
    () => ({
      location: sp.get("location") || "",
      minPrice: sp.get("minPrice") || "",
      maxPrice: sp.get("maxPrice") || "",
      minSize: sp.get("minSize") || "",
      maxSize: sp.get("maxSize") || "",
      facing: sp.get("facing") || "",
      approvalType: sp.get("approvalType") || "",
    }),
    [sp],
  )

  const [state, setState] = useState(initial)

  function setParam(name: string, value: string) {
    setState((s) => ({ ...s, [name]: value }))
  }

  function apply() {
    const params = new URLSearchParams()
    Object.entries(state).forEach(([k, v]) => {
      if (v) params.set(k, v as string)
    })
    params.set("page", "1")
    params.set("limit", "24")
    router.push(`${pathname}?${params.toString()}`)
  }

  function clear() {
    setState({
      location: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
      facing: "",
      approvalType: "",
    })
    router.push(pathname)
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Location"
          value={state.location}
          onChange={(e) => setParam("location", e.target.value)}
          aria-label="Filter by location"
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Min Price"
          inputMode="numeric"
          value={state.minPrice}
          onChange={(e) => setParam("minPrice", e.target.value)}
          aria-label="Filter by min price"
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Max Price"
          inputMode="numeric"
          value={state.maxPrice}
          onChange={(e) => setParam("maxPrice", e.target.value)}
          aria-label="Filter by max price"
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Min Size"
          inputMode="numeric"
          value={state.minSize}
          onChange={(e) => setParam("minSize", e.target.value)}
          aria-label="Filter by min size"
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Max Size"
          inputMode="numeric"
          value={state.maxSize}
          onChange={(e) => setParam("maxSize", e.target.value)}
          aria-label="Filter by max size"
        />
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={state.facing}
          onChange={(e) => setParam("facing", e.target.value)}
          aria-label="Filter by plot facing"
        >
          <option value="">Facing</option>
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
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-6">
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={state.approvalType}
          onChange={(e) => setParam("approvalType", e.target.value)}
          aria-label="Filter by approval type"
        >
          <option value="">Approval</option>
          <option>DTCP</option>
          <option>CMDA</option>
          <option>Panchayat</option>
          <option>Other</option>
        </select>
        <div className="md:col-span-4" />
        <div className="flex items-center justify-end gap-2 md:col-span-2">
          <button onClick={clear} className="rounded-md border px-3 py-2 text-sm hover:bg-accent/50">
            Clear
          </button>
          <button
            onClick={apply}
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
