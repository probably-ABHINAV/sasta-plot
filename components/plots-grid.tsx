"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Square, DollarSign, Calendar } from "lucide-react"
import { FadeInSection, Stagger, Item } from "@/components/animated-section"
import { useState, useEffect } from "react"

interface Plot {
  id: string
  title: string
  slug: string
  description: string
  price: number
  location: string
  size_sqyd: number
  image_url?: string
  featured: boolean
  created_at: string
}

export function PlotsGrid() {
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

  if (loading) {
    return (
      <FadeInSection>
        <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>
    )
  }

  return (
    <FadeInSection>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {plots.map((plot, index) => (
            <Item key={plot.id}>
              <Link href={`/plots/${plot.slug}`} className="group block">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={plot.image_url || "/placeholder.svg"}
                      alt={plot.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {plot.featured && (
                      <Badge className="absolute left-3 top-3 bg-primary/90 text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {plot.title}
                    </h3>

                    <div className="space-y-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{plot.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4" />
                        <span>{plot.size_sqyd} sq. yd.</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        <span>₹{plot.price.toLocaleString()}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(plot.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Item>
          ))}
        </Stagger>
      </section>
    </FadeInSection>
  )
}