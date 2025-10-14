
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface Plot {
  id: string
  title: string
  slug: string
  image_url?: string
  images?: string[]
}

export default function PlotsGallery() {
  const [plots, setPlots] = useState<Plot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlots() {
      try {
        const response = await fetch('/api/plots')
        if (response.ok) {
          const data = await response.json()
          setPlots(data.plots?.slice(0, 6) || [])
        }
      } catch (error) {
        console.error('Failed to fetch plots:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlots()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="aspect-square bg-white/10 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (plots.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[
          "/images/gallery/A_1760476152262.jpg",
          "/images/gallery/B_1760476152260.jpg", 
          "/images/gallery/C_1760476152261.jpg",
          "/images/gallery/D_1760476152258.jpg",
          "/images/gallery/E_1760476152255.jpg",
          "/images/gallery/F_1760476152257.jpg"
        ].map((src, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={src}
              alt={`Plot gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-xs font-medium">View Plot</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {plots.map((plot, index) => {
        // Prioritize images array, then image_url, then fallback
        const imageUrl = (plot.images && plot.images.length > 0) 
          ? plot.images[0] 
          : (plot.image_url || `/images/plots/plot-${(index % 6) + 1}.png`)
        
        return (
          <Link 
            key={plot.id} 
            href={`/plots/${plot.slug}`}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={imageUrl}
              alt={plot.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
              unoptimized={imageUrl.includes('supabase') || imageUrl.includes('storage')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-xs font-medium">{plot.title}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
