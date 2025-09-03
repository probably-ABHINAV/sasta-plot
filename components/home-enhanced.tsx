"use client"

import Image from "next/image"
import Link from "next/link"
import { FadeInSection, Stagger, Item } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface Plot {
  id: string
  title: string
  slug: string
  description: string
  price: number
  location: string
  size_sqyd: number
  image_url?: string
  featured: boolean
  created_at: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  published: boolean
  created_at: string
}

export function HomeEnhanced() {
  const [featuredPlots, setFeaturedPlots] = useState<Plot[]>([])
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured plots
        const plotsResponse = await fetch('/api/plots')
        const plotsData = await plotsResponse.json()
        const featured = (plotsData.plots || []).filter((plot: Plot) => plot.featured).slice(0, 3)
        setFeaturedPlots(featured)

        // Fetch latest blog posts
        const blogsResponse = await fetch('/api/blog')
        const blogsData = await blogsResponse.json()
        const latest = (blogsData.posts || []).slice(0, 3)
        setLatestBlogs(latest)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
                    className="inline-flex h-12 items-center justify-center rounded-md border border-primary px-8 text-sm font-medium text-primary hover:bg-primary/10"
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

      {/* Featured Plots Section */}
      <FadeInSection>
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Featured Plots
              </h2>
              <p className="text-muted-foreground">
                Handpicked premium locations with verified documentation
              </p>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.1}>
                {featuredPlots.map((plot, index) => (
                  <Item key={plot.id}>
                    <Link href={`/plots/${plot.slug}`} className="group block">
                      <div className="overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={plot.image_url || "/placeholder.svg"}
                            alt={plot.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <Badge className="absolute left-3 top-3 bg-primary">
                            Featured
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {plot.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {plot.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-primary">
                              ₹{typeof plot.price === 'number' ? plot.price.toLocaleString() : plot.price}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {plot.size_sqyd} sq. yd.
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Item>
                ))}
              </Stagger>
            )}

            <div className="text-center mt-10">
              <Link
                href="/plots"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                View All Plots
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Latest Blog Posts Section */}
      <FadeInSection>
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Latest Insights
              </h2>
              <p className="text-muted-foreground">
                Stay updated with real estate trends and buying guides
              </p>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : latestBlogs.length > 0 ? (
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.1}>
                {latestBlogs.map((post) => (
                  <Item key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <div className="overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                        <div className="p-6">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Item>
                ))}
              </Stagger>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>No blog posts available yet.</p>
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Read More Articles
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Contact Section */}
      <FadeInSection>
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Find Your Perfect Plot?
            </h2>
            <p className="text-muted-foreground mb-8">
              Get in touch with our experts for personalized assistance and site visits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Contact Us
              </Link>
              <Link
                href="/plots"
                className="inline-flex items-center justify-center rounded-md border border-primary px-8 py-3 text-sm font-medium text-primary hover:bg-primary/10"
              >
                Browse All Plots
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>
    </main>
  )
}