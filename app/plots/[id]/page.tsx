import { EnquiryForm } from "@/components/enquiry-form"
import { FavoriteButton } from "@/components/favorite-button"
import type { Plot, ApiItemResponse } from "@/types"
import type { Metadata } from "next"

async function getPlot(id: string): Promise<Plot | null> {
  const base = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
  const res = await fetch(`${base}/plots/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  const json = (await res.json()) as ApiItemResponse<Plot>
  return json.data
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseSite = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  // Reuse the same fetch shape as getPlot()
  const backend = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
  try {
    const res = await fetch(`${backend}/plots/${params.id}`, { cache: "no-store" })
    if (!res.ok) {
      return {
        title: "Plot details",
        description: "View plot details and make an enquiry.",
        alternates: { canonical: `/plots/${params.id}` },
      }
    }
    const json = await res.json()
    const plot = json?.data as {
      title?: string
      description?: string
      images?: string[]
      price?: number
      sizeSqft?: number
    }
    const title = plot?.title ? `${plot.title} — Plot Details` : "Plot details"
    const desc =
      plot?.description ||
      `Residential plot details and enquiry. ${plot?.sizeSqft ? `${plot.sizeSqft} sqft.` : ""} ${plot?.price ? `Price: ₹${Number(plot.price).toLocaleString()}.` : ""}`
    const ogImage = plot?.images?.[0] || "/plot-detail-open-graph.png"
    return {
      title,
      description: desc,
      alternates: { canonical: `/plots/${params.id}` },
      openGraph: {
        title,
        description: desc,
        url: `${baseSite}/plots/${params.id}`,
        type: "article",
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
        images: [ogImage],
      },
    }
  } catch {
    return {
      title: "Plot details",
      description: "View plot details and make an enquiry.",
      alternates: { canonical: `/plots/${params.id}` },
    }
  }
}

function buildWhatsAppLink(plotTitle: string, plotId: string) {
  const num = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "")
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const text = encodeURIComponent(`Hi, I'm interested in the plot "${plotTitle}". ${site}/plots/${plotId}`)
  // only return a link if number exists; otherwise return null so we can hide the CTA
  return num ? `https://wa.me/${num}?text=${text}` : null
}

export default async function PlotDetailPage({ params }: { params: { id: string } }) {
  const plot = await getPlot(params.id)
  if (!plot) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Plot not found</h1>
        <p className="mt-2 text-muted-foreground">Please try another listing.</p>
      </main>
    )
  }

  const images = plot.images?.length ? plot.images : ["/plot-gallery.png"]

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
            <img
              src={images[0] || "/placeholder.svg"}
              alt={plot.title}
              width={1280}
              height={720}
              loading="eager"
              fetchpriority="high"
              decoding="async"
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {images.slice(1).map((src, i) => (
                <img
                  key={i}
                  src={src || "/placeholder.svg"}
                  alt={`Image ${i + 2} of ${plot.title}`}
                  width={320}
                  height={180}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 22vw, 33vw"
                  className="aspect-video w-full rounded-md border object-cover"
                />
              ))}
            </div>
          )}
          <article className="prose prose-slate max-w-none dark:prose-invert">
            <h2 className="text-xl font-semibold">About this plot</h2>
            <p>{plot.description || "No description provided."}</p>
            <ul>
              {plot.facing && <li>Facing: {plot.facing}</li>}
              {plot.approvalType && <li>Approval: {plot.approvalType}</li>}
              <li>Size: {plot.sizeSqft} sqft</li>
              <li>Price: ₹{plot.price.toLocaleString()}</li>
              {plot.isCornerPlot && <li>Corner plot</li>}
            </ul>
          </article>
          {plot.mapEmbedUrl && (
            <div className="mt-4">
              <h3 className="mb-2 text-lg font-semibold">Location</h3>
              <div className="aspect-[16/9] overflow-hidden rounded-lg border">
                <iframe
                  src={plot.mapEmbedUrl}
                  title={`Map for ${plot.title}`}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-lg border p-4">
              <h1 className="text-xl font-semibold">{plot.title}</h1>
              <p className="text-sm text-muted-foreground">{plot.location}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-medium text-emerald-700">₹{plot.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">{plot.sizeSqft} sqft</span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <FavoriteButton plotId={plot._id} />
                {/* conditionally render WhatsApp CTA only if a number is configured */}
                {(() => {
                  const waLink = buildWhatsAppLink(plot.title, plot._id)
                  if (!waLink) return null
                  return (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
                      aria-label={`Chat on WhatsApp about ${plot.title}`}
                    >
                      Chat on WhatsApp
                    </a>
                  )
                })()}
              </div>
            </div>
            <div id="enquiry" className="scroll-mt-24">
              <EnquiryForm plotId={plot._id} plotTitle={plot.title} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
