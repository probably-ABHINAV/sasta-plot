
import { PlotCard, type Plot } from "./plot-card"

const DUMMY_PLOTS: Plot[] = [
  {
    id: "1",
    title: "Sample Plot",
    location: "Sample Location",
    price: "$100,000",
    size: "1000 sq ft",
    image: "/placeholder.svg",
    slug: "sample-plot"
  }
]

export function PlotsGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DUMMY_PLOTS.map((plot) => (
          <PlotCard key={plot.id} plot={plot} />
        ))}
      </div>
    </section>
  )
}
