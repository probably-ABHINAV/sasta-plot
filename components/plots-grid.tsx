"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Square, Calendar } from "lucide-react"
import { FadeInSection, Stagger, Item } from "@/components/animated-section"
import { formatPrice, getPriceFormatSuggestion } from "@/lib/utils/price"

import { Plot } from "@/types"

interface PlotsGridProps {
  plots: Plot[]
  loading: boolean
}

export function PlotsGrid({ plots, loading }: PlotsGridProps) {

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
        <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" delay={0.05}>
          {plots.map((plot) => {
            // Prioritize uploaded images from database
            const imageUrl = (plot.images && plot.images.length > 0)
              ? plot.images[0]
              : plot.image ||
                `/images/plots/plot-${(plots.indexOf(plot) % 6) + 1}.png`
            return (
            <Item key={plot.id}>
              <Link href={`/plots/${plot.slug || plot.id}`} className="group block">
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] h-full flex flex-col rounded-xl shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={plot.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
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
                        <span>{plot.size_sqyd ? `${plot.size_sqyd} sq. yd.` : plot.size || 'Size TBD'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 font-bold text-xl text-primary">
                        <span>{plot.price ? formatPrice(Number(plot.price), getPriceFormatSuggestion(Number(plot.price))) : 'Price on request'}</span>
                      </div>
                      {plot.price && plot.size_sqyd && plot.size_sqyd > 0 && (
                        <div className="text-xs text-muted-foreground">
                          ₹{Math.round(Number(plot.price) / plot.size_sqyd).toLocaleString('en-IN')}/sq.yd
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Item>
          )})}
        </Stagger>
      </section>
    </FadeInSection>
  )
}