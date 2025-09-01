import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge";

export interface Plot {
  id: string
  title: string
  location: string
  price: string
  size: string
  image?: string
  slug?: string
  area?: string
  type?: string
  available?: boolean
}

interface PlotCardProps {
  plot: Plot
}

export function PlotCard({ plot }: PlotCardProps) {
  const plotSlug = plot.slug || `plot-${plot.id}`

  return (
    <Link href={`/plots/${plotSlug}`} className="block group">
      <article className="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={plot.image || "/placeholder.svg"}
            alt={plot.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight">{plot.title}</h3>
            <p className="text-muted-foreground text-sm">{plot.location}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xl font-bold text-primary">₹{typeof plot.price === 'string' ? plot.price : plot.price.toLocaleString()}</p>
              <p className="text-muted-foreground text-xs">
                {plot.size}
              </p>
            </div>
            {plot.available && (
              <Badge variant="secondary" className="text-xs">
                Available
              </Badge>
            )}
          </div>
          <span className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium transition-colors">
            Enquire
          </span>
        </div>
      </article>
    </Link>
  )
}