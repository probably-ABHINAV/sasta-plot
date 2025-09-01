"use client"

import Image from "next/image"
import Link from "next/link"
import { FadeInSection, Stagger, Item } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"

const plots = [
  {
    id: "1",
    title: "Green Valley Residency",
    location: "Sector 12, Gurgaon",
    size: "200 sq. yd.",
    price: "₹25,00,000",
    img: "/images/plots/plot-1.png",
  },
  {
    id: "2", 
    title: "Sunrise Heights",
    location: "New Town, Kolkata",
    size: "150 sq. yd.",
    price: "₹18,00,000",
    img: "/images/plots/plot-2.png",
  },
  {
    id: "3",
    title: "Palm Grove Estates",
    location: "Whitefield, Bangalore",
    size: "300 sq. yd.",
    price: "₹45,00,000", 
    img: "/images/plots/plot-3.png",
  },
]

export function HomeEnhanced() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <FadeInSection>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    Aam Admi Ki{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Pasand
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground sm:text-xl">
                    Find affordable residential plots with verified documentation, 
                    transparent pricing, and flexible payment options.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/plots"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                  >
                    Browse Plots
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Contact Us
                  </Link>
                </div>
                <ul className="grid grid-cols-2 gap-4 pt-4 text-sm text-muted-foreground sm:grid-cols-3">
                  <li>RERA-aligned listings</li>
                  <li>Zero hidden charges</li>
                  <li>Flexible payment plans</li>
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -left-6 -top-6 hidden h-20 w-20 opacity-10 sm:block">
                  <Image
                    src="/images/logo-sasta-plots.png"
                    alt="Sasta Plots logo watermark"
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative aspect-video">
                    <Image
                      src="/images/plots/plot-1.png"
                      alt="Featured plot 1"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="relative aspect-video">
                    <Image
                      src="/images/plots/plot-2.png"
                      alt="Featured plot 2"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="relative aspect-video">
                    <Image
                      src="/images/plots/plot-3.png"
                      alt="Featured plot 3"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Featured Plots */}
      <FadeInSection>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Featured Plots</h2>
            <Link href="/plots" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plots.map((p) => (
              <Item key={p.id}>
                <Link href={`/plots/plot-${p.id}`} className="block group">
                  <article className="overflow-hidden rounded-xl border bg-background transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="relative h-48 w-full sm:h-56 overflow-hidden">
                      <Image
                        src={p.img || "/placeholder.svg"}
                        alt={p.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1 p-4">
                      <h3 className="font-medium">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {p.location} • {p.size}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-primary">{p.price}</span>
                        <span className="text-sm text-primary hover:underline">
                          Details
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </Item>
            ))}
          </Stagger>
        </div>
      </FadeInSection>
    </main>
  )
}