import Image from "next/image"
import { notFound } from "next/navigation"
import InquiryForm from "@/components/inquiry-form"
import { formatPrice, getPriceFormatSuggestion } from "@/lib/utils/price"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} | Sasta Plots` }
}

export default async function PlotDetail({ params }: { params: { slug: string } }) {
  try {
    // Use the API route with fallback mechanism
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000'}/api/plots/${params.slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return notFound()
    }
    
    const { plot } = await response.json()
    
    if (!plot) {
      return notFound()
    }

    const images: string[] = plot.plot_images?.length 
      ? plot.plot_images.map((img: any) => img.url) 
      : plot.image 
        ? [plot.image] 
        : ["/images/plots/plot-1.png"]

    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="grid gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border">
              <Image src={images[0] || "/placeholder.svg"} alt={plot.title} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded border">
                  <Image src={src || "/placeholder.svg"} alt={`${plot.title} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold md:text-3xl">{plot.title}</h1>
            <p className="text-muted-foreground">{plot.location}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {plot.size ? <span className="rounded bg-muted px-2 py-0.5">{plot.size}</span> : null}
              {plot.price ? (
                <span className="rounded bg-muted px-2 py-0.5">{formatPrice(Number(plot.price), getPriceFormatSuggestion(Number(plot.price)))}</span>
              ) : null}
            </div>
            <p>{plot.description}</p>
            <InquiryForm plotId={plot.id} />
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading plot:', error)
    return notFound()
  }
}