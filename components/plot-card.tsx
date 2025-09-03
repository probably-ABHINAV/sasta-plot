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
  image_url?: string // Added image_url to the interface
}

interface PlotCardProps {
  plot: Plot
}

export function PlotCard({ plot }: PlotCardProps) {
  const plotSlug = plot.slug || `plot-${plot.id}`

  return (
    <Link href={`/plots/${plotSlug}`} className="block group h-full">
      <article className="border-border bg-card text-card-foreground overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] h-full flex flex-col">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={plot.image_url || plot.image || "/placeholder.svg"}
            alt={plot.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg"; // Fallback to placeholder.svg if image_url or image fails
            }}
          />
        </div>
        <div className="space-y-4 p-6 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            <h3 className="text-xl font-bold leading-tight text-gray-900 line-clamp-2">{plot.title}</h3>
            <p className="text-muted-foreground text-base font-medium">{plot.location}</p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <div className="space-y-1">
              <p className="text-2xl font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">₹{typeof plot.price === 'string' ? plot.price : plot.price.toLocaleString()}</p>
              <p className="text-muted-foreground text-sm font-medium">
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