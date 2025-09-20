"use client"

import { PlotsGrid } from "@/components/plots-grid"
import { PlotsMap } from "@/components/plots-map"
import { useState, useEffect } from "react"
import { Plot } from "@/types"

export function PlotsPageClient() {
  const [plots, setPlots] = useState<Plot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await fetch('/api/plots')
        const data = await response.json()
        setPlots(data.plots || [])
      } catch (error) {
        console.error('Error fetching plots:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlots()
  }, [])

  return (
    <>
      {/* Map Section */}
      {!loading && plots.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <PlotsMap plots={plots} />
        </section>
      )}
      
      <PlotsGrid plots={plots} loading={loading} />
    </>
  )
}