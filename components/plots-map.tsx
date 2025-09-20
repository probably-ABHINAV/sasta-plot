"use client"

import dynamic from "next/dynamic"
import { Plot } from "@/types"

// Dynamic import to avoid SSR issues with Leaflet
const MultiLocationMap = dynamic(() => import("@/components/ui/multi-location-map").then(mod => ({ default: mod.MultiLocationMap })), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">Loading map...</div>
})

interface PlotsMapProps {
  plots: Plot[]
  className?: string
}

export function PlotsMap({ plots, className = "" }: PlotsMapProps) {
  // Filter plots that have coordinates
  const plotsWithCoordinates = plots.filter(plot => 
    plot.latitude != null && plot.longitude != null
  )

  if (plotsWithCoordinates.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold mb-4">Plot Locations</h2>
      <MultiLocationMap plots={plotsWithCoordinates} />
    </div>
  )
}