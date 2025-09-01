"use client"

import { PlotCard, type Plot } from "./plot-card"
import { Stagger } from "@/components/animate"
import Link from "next/link"

const plots: Plot[] = [
  {
    id: "p1",
    title: "Green View Residency",
    location: "NH-48 Corridor",
    price: "₹ 9.9 L onwards",
    size: "120–200 sq yd",
    image: "/images/plots/plot-2.png",
  },
  {
    id: "p2",
    title: "Sunrise Meadows",
    location: "Near Tech Park",
    price: "₹ 12.4 L onwards",
    size: "100–180 sq yd",
    image: "/images/plots/plot-3.png",
  },
  {
    id: "p3",
    title: "City Gate Enclave",
    location: "Ring Road",
    price: "₹ 15.0 L onwards",
    size: "140–220 sq yd",
    image: "/images/plots/plot-4.png",
  },
  {
    id: "p4",
    title: "Riverside Blocks",
    location: "Expressway Link",
    price: "₹ 11.2 L onwards",
    size: "90–150 sq yd",
    image: "/images/plots/plot-5.png",
  },
  {
    id: "p5",
    title: "Park View Sector",
    location: "University Road",
    price: "₹ 13.3 L onwards",
    size: "110–170 sq yd",
    image: "/images/plots/plot-6.png",
  },
  {
    id: "p6",
    title: "Garden County",
    location: "Industrial Hub",
    price: "₹ 10.1 L onwards",
    size: "100–160 sq yd",
    image: "/images/plots/plot-1.png",
  },
]

export function PlotsGrid() {
  return (
    <section id="plots" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-pretty text-2xl font-semibold md:text-3xl">Featured Plots</h2>
          <p className="text-muted-foreground">Handpicked options ready for site visit.</p>
        </div>
        <a
          href="/contact"
          className="hidden rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted sm:inline-flex"
        >
          Get Full Inventory
        </a>
      </div>
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" delay={0.1}>
        {plots.map((plot) => (
          <Link href={`/plots/plot-${plot.id}`} className="block" key={plot.id}>
            <PlotCard plot={plot} />
          </Link>
        ))}
      </Stagger>
    </section>
  )
}