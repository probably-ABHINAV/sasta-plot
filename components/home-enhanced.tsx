"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FadeInSection, Stagger, Item } from "@/components/animated-section"
import { MapPin, Square, Sparkles, Shield, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import PlotsGallery from "@/components/plots-gallery"
import { formatPrice, getPriceFormatSuggestion } from "@/lib/utils/price"
import dynamic from "next/dynamic"

// Dynamic import to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/ui/map").then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">Loading map...</div>
})
import { Testimonials } from "@/components/testimonials"
import { CtaBanner } from "@/components/cta-banner"

interface Plot {
  id: string
  title: string
  slug: string
  description: string
  price: number
  location: string
  size_sqyd: number
  image_url?: string
  images?: string[]; // Add this if your Supabase schema includes multiple images
  featured: boolean
  created_at: string
}

export default function HomeEnhanced() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [featuredPlots, setFeaturedPlots] = useState<Plot[]>([])
  const [allPlots, setAllPlots] = useState<Plot[]>([])
  const [loading, setLoading] = useState(true)
 useEffect(() => {
    const fetchData = async () => {
      try {
        const plotsResponse = await fetch('/api/plots', {
          cache: 'no-store'
        })
        const plotsData = await plotsResponse.json()
        const allPlotsData = plotsData.plots || []
        const featured = allPlotsData.filter((plot) => plot.featured).slice(0, 6)
        setFeaturedPlots(featured)
        setAllPlots(allPlotsData)
      } catch (error) {
        console.error('Error fetching data:', error)
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
          {/* Your content */}
        </section>
      </FadeInSection>
    </div>
  )
}
 
      {/* Hero Section */}
      <FadeInSection>
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-red-50 min-h-[90vh] flex items-center">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(251,146,60,.03)_25%,rgba(251,146,60,.03)_26%,transparent_27%,transparent_74%,rgba(251,146,60,.03)_75%,rgba(251,146,60,.03)_76%,transparent_77%,transparent)] bg-[length:30px_30px]"></div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800 ring-1 ring-orange-200">
                  <span className="relative flex h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
                  Trusted & Affordable Plots
                </div>

                <h1 className="text-5xl font-black tracking-tight lg:text-7xl">
                  <span className="text-gray-900">Premium</span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Plot Ownership
                  </span>
                  <br />
                  <span className="text-orange-700 text-3xl lg:text-4xl font-bold">
                    Made Simple
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Discover verified residential and commercial plots in prime locations.
                  Clear titles, competitive prices, and hassle-free documentation.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/plots"
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 text-lg font-bold text-white shadow-xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    Browse All Plots
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl border-2 border-orange-600 bg-background px-8 py-4 text-lg font-bold text-orange-600 hover:bg-orange-50 transform hover:scale-105 transition-all duration-300"
                  >
                    Schedule Site Visit
                  </Link>
                </div>

                {/* Trust Indicators */}
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

              {/* Hero Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <Image
                    src="/images/plots/plot-1.png"
                    alt="Premium residential plot"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2">
                    <div className="text-orange-600 font-bold text-lg">Starting from ₹16500 per sq/yd </div>
                    <div className="text-sm text-gray-600">Verified plots with clear titles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Why Choose Us Section */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Why Choose Sasta Plots?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We make land ownership accessible with transparent processes, verified documentation, and unbeatable prices
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-6 p-8 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto">
                  💰
                </div>
                <h3 className="text-xl font-bold text-gray-900">Affordable Pricing</h3>
                <p className="text-gray-600">
                  Premium plots at 30% below market rates with flexible payment options
                </p>
              </div>

              <div className="text-center space-y-6 p-8 rounded-2xl bg-red-50 hover:bg-red-100 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto">
                  📋
                </div>
                <h3 className="text-xl font-bold text-gray-900">Clear Documentation</h3>
                <p className="text-gray-600">
                  All legal documents verified and ready for immediate transfer
                </p>
              </div>

              <div className="text-center space-y-6 p-8 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-all duration-300 transform hover:scale-105">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto">
                  🏗️
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ready Infrastructure</h3>
                <p className="text-gray-600">
                  Complete infrastructure with roads, electricity, and water connections
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Featured Plots Section (Static) */}
      <FadeInSection>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Featured Properties
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Discover our handpicked selection of premium plots in prime locations
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Plot 1 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/plots/plot-1.png"
                  alt="Zams Gardenia"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Zams Gardenia</h3>
                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Bihta – Greater Patna Corridor</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">
                    ₹16,500 per sq/ft
                  </span>
                  <Link href="/plots/zams-gardenia">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Plot 2 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/plots/plot-2.png"
                  alt="Bajrang Vatika"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Bajrang Vatika</h3>
                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dehradun</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">
                    ₹16,500 per sq/yd
                  </span>
                  <Link href="/plots/bajrang-vatika">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Plot 3 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/plots/plot-3.png"
                  alt="Friends Colony Phase 1"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Friends Colony Phase 1</h3>
                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dehradun</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">
                    ₹16,000 per sq/yd
                  </span>
                  <Link href="/plots/friends-colony-phase-1">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </FadeInSection>

      {/* Latest Properties Section (Same Static) */}
      <FadeInSection>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Latest Properties
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Fresh opportunities just added to our collection
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Just reuse the same 3 static plots */}
            <Link href="/plots/zams-gardenia">
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/plots/plot-1.png"
                    alt="Zams Gardenia"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">Zams Gardenia</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>Bihta – Greater Patna Corridor</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-600">
                      ₹1550 per sq/ft
                    </span>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/plots/bajrang-vatika">
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/plots/plot-2.png"
                    alt="Bajrang Vatika"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">Bajrang Vatika</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>Dehradun</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-600">
                      ₹16,500 per sq/yd
                    </span>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/plots/friends-colony-phase-1">
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/plots/plot-3.png"
                    alt="Friends Colony Phase 1"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">Friends Colony Phase 1</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>Dehradun</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-600">
                      ₹16,000 per sq/yd
                    </span>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </FadeInSection>

      {/* How It Works Section */}
      <FadeInSection>
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
              <p className="text-lg text-gray-600">
                Three simple steps to own your dream plot
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Browse & Select</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore our curated collection of verified plots. Filter by location,
                  price, and size to find your perfect match.
                </p>
              </div>

              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Site Inspection</h3>
                <p className="text-gray-600 leading-relaxed">
                  Schedule a free site visit with our experts. Verify all documents
                  and inspect the plot thoroughly before making a decision.
                </p>
              </div>

              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Secure & Own</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete the payment process and legal formalities.
                  Get your registered documents and start building your future.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Plot Gallery Section */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center space-y-6 mb-16">
              <h2 className="text-4xl font-bold text-white">Our Plot Gallery</h2>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Take a visual tour of our available plots across different locations
              </p>
            </div>

            <PlotsGallery />

            <div className="text-center mt-12">
              <Link
                href="/plots"
                className="inline-flex items-center justify-center rounded-2xl bg-white text-orange-600 px-8 py-4 text-lg font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
              >
                View Complete Gallery
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Value Proposition */}
      <FadeInSection>
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-gray-900">
                    Your Trusted Partner in
                    <span className="text-orange-600"> Land Investment</span>
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    At Sasta Plots, we believe everyone deserves to own a piece of land.
                    That's why we've simplified the entire process, making it transparent,
                    affordable, and stress-free.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-3xl font-black text-orange-600">15+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-black text-orange-600">₹25Cr+</div>
                    <div className="text-sm text-gray-600">Property Value</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-black text-orange-600">Zero</div>
                    <div className="text-sm text-gray-600">Hidden Charges</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-black text-orange-600">100%</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg rounded-xl"
                  >
                    <Link href="/about">Learn More About Us</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg rounded-xl"
                  >
                    <Link href="/contact">Get Free Consultation</Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src="/images/gallery/plot-gallery-1.jpg"
                      alt="Premium plotted development with boundary walls"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image
                      src="/images/gallery/plot-gallery-2.jpg"
                      alt="Aerial view of residential plots"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image
                      src="/images/gallery/plot-gallery-3.jpg"
                      alt="Constructed property on plot"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    /></div>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src="/images/gallery/D_1760476152258.jpg"
                      alt="Investment plot"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Call to Action */}
      <FadeInSection>
        <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center space-y-8">
            <h2 className="text-4xl font-bold">Ready to Own Your Dream Plot?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their perfect plot with us.
              Start your journey towards land ownership today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link
                href="/plots"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 px-10 py-4 text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[250px]"
              >
                Explore Available Plots
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl border-2 border-white bg-transparent text-white px-10 py-4 text-lg font-bold hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 min-w-[250px]"
              >
                Schedule Site Visit
              </Link>
            </div>

            <div className="pt-8 text-center">
              <p className="text-orange-400 font-medium">📞 Call us: +91-9876543210 | ✉️ Email: sales@sastaplots.in</p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Map Section */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">Our Location</h2>
          <p className="mt-2 text-muted-foreground">Find us on the map</p>
        </div>
        <Map
          latitude={30.402437}
          longitude={77.750105}
          zoom={16}
          title="Our Office Location"
          height="400px"
        />
      </section>

      {/* CTA Banner */}
      <CtaBanner />
    </div>
  )
}
