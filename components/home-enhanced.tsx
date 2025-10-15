// /components/home-enhanced.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeInSection, Stagger, Item } from "@/components/animated-section"
import { MapPin } from "lucide-react"
import PlotsGallery from "@/components/plots-gallery"
import dynamic from "next/dynamic"
import { Testimonials } from "@/components/testimonials"
import CtaBanner from "@/components/cta-banner" // <-- default import (fixed)

const Map = dynamic(() => import("@/components/ui/map").then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">Loading map...</div>
})

interface Plot {
  id: string
  title: string
  slug: string
  description: string
  price: number
  location: string
  size_sqyd: number
  image_url?: string
  images?: string[]
  featured: boolean
  created_at: string
}

export default function HomeEnhanced() {
  const [featuredPlots, setFeaturedPlots] = useState<Plot[]>([])
  const [allPlots, setAllPlots] = useState<Plot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plotsResponse = await fetch("/api/plots", { cache: "no-store" })
        const plotsData = await plotsResponse.json()
        const allPlotsData = plotsData.plots || []
        const featured = allPlotsData.filter((plot: Plot) => plot.featured).slice(0, 6)
        setFeaturedPlots(featured)
        setAllPlots(allPlotsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <FadeInSection>
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-red-50 min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(251,146,60,.03)_25%,rgba(251,146,60,.03)_26%,transparent_27%,transparent_74%,rgba(251,146,60,.03)_75%,rgba(251,146,60,.03)_76%,transparent_77%,transparent)] bg-[length:30px_30px]" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800 ring-1 ring-orange-200">
                  <span className="relative flex h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
                  Trusted & Affordable Plots
                </div>

                <h1 className="text-5xl font-black tracking-tight lg:text-7xl">
                  <span className="text-gray-900">Premium</span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Plot Ownership</span>
                  <br />
                  <span className="text-orange-700 text-3xl lg:text-4xl font-bold">Made Simple</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Discover verified residential and commercial plots in prime locations.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/plots" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 text-lg font-bold text-white shadow-xl hover:shadow-orange-500/25">Browse All Plots</Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border-2 border-orange-600 bg-background px-8 py-4 text-lg font-bold text-orange-600">Schedule Site Visit</Link>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-2xl font-black text-orange-600">100%</div>
                    <div className="text-sm text-gray-600">Verified Docs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-orange-600">50+</div>
                    <div className="text-sm text-gray-600">Prime Locations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-orange-600">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-3xl blur-xl" />
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <Image src="/images/plots/plot-1.png" alt="Premium residential plot" width={600} height={400} className="w-full h-auto object-cover" priority />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2">
                    <div className="text-orange-600 font-bold text-lg">Starting from ₹16500 per sq/yd</div>
                    <div className="text-sm text-gray-600">Verified plots with clear titles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Featured Plots Section */}
      <FadeInSection>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Featured Properties</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Discover our handpicked selection of premium plots in prime locations</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Plot 1 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/images/plots/plot-1.png" alt="Zams Gardenia" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Zams Gardenia</h3>
                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Bihta – Greater Patna Corridor</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">₹16,500 per sq/ft</span>
                  <Link href="/plots/zams-gardenia">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Plot 2 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/images/plots/plot-2.png" alt="Bajrang Vatika" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Bajrang Vatika</h3>
                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dehradun</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">₹16,500 per sq/yd</span>
                  <Link href="/plots/bajrang-vatika">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Plot 3 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/images/plots/plot-3.png" alt="Friends Colony Phase 1" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Friends Colony Phase 1</h3>
                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dehradun</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">₹16,000 per sq/yd</span>
                  <Link href="/plots/friends-colony-phase-1">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </FadeInSection>

      {/* Latest Properties, How It Works, Plot Gallery, Value Prop etc. */}
      {/* ...the rest of your sections (as in your original) ... */}

      <PlotsGallery />

      {/* Map Section */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">Our Location</h2>
          <p className="mt-2 text-muted-foreground">Find us on the map</p>
        </div>
        <Map latitude={30.402437} longitude={77.750105} zoom={16} title="Our Office Location" height="400px" />
      </section>

      {/* CTA Banner */}
      <CtaBanner />
    </div>
  )
}
