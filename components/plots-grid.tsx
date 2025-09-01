import Link from "next/link"
import Image from "next/image"

export interface Plot {
  id: string
  title: string
  location: string
  price: string
  size: string
  image?: string
  slug?: stringimport Link from "next/link"
import Image from "next/image"

export interface Plot {
  id: string
  title: string
  location: string
  price: string
  size: string
  image?: string
  slug?: string
}

interface PlotCardProps {
  plot: Plot
}

export function PlotCard({ plot }: PlotCardProps) {
  const plotSlug = plot.slug || `plot-${plot.id}`
  
  return (
    <article className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      <Link href={`/plots/${plotSlug}`}>
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={plot.image || "/placeholder.svg"}
            alt={plot.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-1 p-4">
          <h3 className="text-base font-semibold">{plot.title}</h3>
          <p className="text-sm text-muted-foreground">
            {plot.location} • {plot.size}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium">{plot.price}</span>
            <Link href={`/plots/${plotSlug}#contact`} className="text-sm font-medium text-primary hover:underline">
              Enquire
            </Link>
          </div>
        </div>
      </Link>
    </article>
  )
}
}

interface PlotCardProps {
  plot: Plot
}

export function PlotCard({ plot }: PlotCardProps) {
  const plotSlug = plot.slug || `plot-${plot.id}`
  
  return (
    <article className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      <Link href={`/plots/${plotSlug}`}>
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={plot.image || "/placeholder.svg"}
            alt={plot.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-1 p-4">
          <h3 className="text-base font-semibold">{plot.title}</h3>
          <p className="text-sm text-muted-foreground">
            {plot.location} • {plot.size}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium">{plot.price}</span>
            <Link href={`/plots/${plotSlug}#contact`} className="text-sm font-medium text-primary hover:underline">
              Enquire
            </Link>
          </div>
        </div>
      </Link>
    </article>
  )
}