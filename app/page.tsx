import Link from "next/link"
import { Hero } from "@/components/hero"
import { PlotCard } from "@/components/plot-card"
import { useApi } from "@/lib/api"
import type { Plot, ApiListResponse } from "@/types"

function FeaturedPlotsClient() {
  const { data, isLoading } = useApi<ApiListResponse<Plot>>("/plots?featured=true&limit=6")
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-balance text-2xl font-semibold">Featured Plots</h2>
        <Link href="/plots" className="text-sm text-emerald-700 hover:underline">
          See all
        </Link>
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map((p) => (
            <PlotCard key={p._id} plot={p} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function HomePage() {
  // add siteUrl for JSON-LD
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Prime Plots in Coimbatore",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
  }
  const webSiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Prime Plots in Coimbatore",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/plots?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <main>
      <Hero />
      {/* add Organization & WebSite structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
      <FeaturedPlotsClient />
    </main>
  )
}
