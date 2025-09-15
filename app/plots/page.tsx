import { PlotsGrid } from "@/components/plots-grid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Available Plots",
  description: "Browse our collection of plots for sale"
}

export default function PlotsPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <h1 className="font-heading text-3xl font-semibold md:text-4xl">Explore Plots</h1>
        <p className="mt-2 text-muted-foreground">Handpicked projects with clear documentation and great access.</p>
      </section>
      <PlotsGrid />
    </main>
  )
}