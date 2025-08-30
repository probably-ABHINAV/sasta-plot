import Link from "next/link"
import type { Plot } from "@/types"
import { FavoriteButton } from "@/components/favorite-button"

export function PlotCard({ plot }: { plot: Plot }) {
  const cover = plot.images?.[0] || "/plot-cover-photo.png"
  return (
    <div className="group overflow-hidden rounded-lg border bg-card transition hover:shadow-sm">
      <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={cover || "/placeholder.svg"}
          alt={plot.title}
          width={640}
          height={400}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-base font-semibold text-foreground">{plot.title}</h3>
        <p className="text-sm text-muted-foreground">{plot.location}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-emerald-700">₹{plot.price.toLocaleString()}</span>
          <span className="text-muted-foreground">{plot.sizeSqft} sqft</span>
        </div>
        <Link
          aria-label={`View details for ${plot.title}`}
          href={`/plots/${plot._id}`}
          className="inline-flex w-full items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-accent/50"
        >
          View Details
        </Link>
        <Link
          aria-label={`Enquire now about ${plot.title}`}
          href={`/plots/${plot._id}#enquiry`}
          className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
        >
          Enquire Now
        </Link>
        <FavoriteButton plotId={plot._id} className="w-full" />
      </div>
    </div>
  )
}
