import React from "react"
import { PlotsPageClient } from "@/components/plots-page-client"

export const metadata = { 
  title: "Plots - Sasta Plots"
}

export default function Page() { 
  return ( 
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            Available Plots
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover our handpicked selection of premium plots in prime locations
          </p>
        </div>

        {/* Dynamic Plots Content */}
        <PlotsPageClient />
      </div>
    </main> 
  )
}
