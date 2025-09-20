import Image from "next/image"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import InquiryForm from "@/components/inquiry-form"
import { formatPrice, getPriceFormatSuggestion } from "@/lib/utils/price"

// Dynamic import to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/ui/map").then(mod => ({ default: mod.Map })), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">Loading map...</div>
})

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} | Sasta Plots` }
}

export default async function PlotDetail({ params }: { params: { slug: string } }) {
  try {
    // Direct API call - let Next.js handle the routing internally
    const { getServerSupabase } = await import("@/lib/supabase/server");
    
    // Try Supabase first
    const supabase = getServerSupabase();
    const { data: plot, error } = await supabase
      .from("plots")
      .select(`
        id,
        title,
        location,
        price,
        size_sqyd,
        size_unit,
        description,
        featured,
        slug,
        image_url,
        latitude,
        longitude,
        created_at,
        plot_images (
          url
        )
      `)
      .eq("slug", params.slug)
      .single();

    let plotData = null;

    if (!error && plot) {
      plotData = {
        id: plot.id.toString(),
        title: plot.title,
        location: plot.location,
        price: plot.price,
        size_sqyd: plot.size_sqyd,
        size_unit: plot.size_unit || "sq.yd",
        size: plot.size_sqyd && plot.size_unit
          ? `${plot.size_sqyd} ${plot.size_unit}`
          : "Size TBD",
        description: plot.description,
        featured: plot.featured,
        slug: plot.slug,
        image: plot.image_url,
        image_url: plot.image_url,
        latitude: plot.latitude,
        longitude: plot.longitude,
        created_at: plot.created_at,
        plot_images: plot.plot_images || []
      };
    } else {
      // Fallback to file storage
      console.log('Supabase failed for plot slug, falling back to file storage:', error?.message || 'No data');
      
      try {
        const { fileStorage } = await import('@/lib/file-storage');
        const plots = fileStorage.getPlots();
        const foundPlot = plots.find(p => p.slug === params.slug);
        
        if (foundPlot) {
          plotData = {
            id: foundPlot.id.toString(),
            title: foundPlot.title || '',
            location: foundPlot.location || '',
            price: foundPlot.price || 0,
            size_sqyd: foundPlot.size_sqyd || 0,
            size_unit: foundPlot.size_unit || 'sq.yd',
            size: foundPlot.size_sqyd && foundPlot.size_unit 
              ? `${foundPlot.size_sqyd} ${foundPlot.size_unit}` 
              : 'Size TBD',
            description: foundPlot.description || '',
            featured: Boolean(foundPlot.featured),
            slug: foundPlot.slug || '',
            image: foundPlot.image || '',
            image_url: foundPlot.image || '',
            latitude: foundPlot.latitude,
            longitude: foundPlot.longitude,
            created_at: foundPlot.created_at || new Date().toISOString(),
            plot_images: foundPlot.image ? [{ url: foundPlot.image }] : []
          };
        }
      } catch (fileError) {
        console.error('File storage also failed:', fileError);
      }
    }
    
    if (!plotData) {
      return notFound()
    }
    
    const images: string[] = plotData.plot_images?.length 
      ? plotData.plot_images.map((img: any) => img.url) 
      : plotData.image 
        ? [plotData.image] 
        : ["/images/plots/plot-1.png"]

    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="grid gap-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border">
              <Image src={images[0] || "/placeholder.svg"} alt={plotData.title} fill className="object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1, 5).map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded border">
                  <Image src={src || "/placeholder.svg"} alt={`${plotData.title} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold md:text-3xl">{plotData.title}</h1>
            <p className="text-muted-foreground">{plotData.location}</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {plotData.size ? <span className="rounded bg-muted px-2 py-0.5">{plotData.size}</span> : null}
              {plotData.price ? (
                <span className="rounded bg-muted px-2 py-0.5">{formatPrice(Number(plotData.price), getPriceFormatSuggestion(Number(plotData.price)))}</span>
              ) : null}
            </div>
            <p>{plotData.description}</p>
            <InquiryForm plotId={plotData.id} />
          </div>
        </div>
        
        {/* Map Section */}
        {plotData.latitude != null && plotData.longitude != null && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <Map 
              latitude={plotData.latitude} 
              longitude={plotData.longitude}
              title={plotData.title}
              height="400px"
              className="w-full"
            />
          </div>
        )}
      </main>
    )
  } catch (error) {
    console.error('Error loading plot:', error)
    return notFound()
  }
}