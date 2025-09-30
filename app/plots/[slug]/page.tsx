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
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl leading-tight">{plotData.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p className="text-base">{plotData.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                <div className="text-sm text-orange-700 font-medium mb-1">Total Price</div>
                <div className="text-2xl font-bold text-orange-900">
                  {plotData.price ? formatPrice(Number(plotData.price), getPriceFormatSuggestion(Number(plotData.price))) : 'Contact Us'}
                </div>
                {plotData.price && plotData.size_sqyd > 0 && (
                  <div className="text-xs text-orange-600 mt-1">
                    ₹{Math.round(Number(plotData.price) / plotData.size_sqyd).toLocaleString('en-IN')}/sq.yd
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="text-sm text-blue-700 font-medium mb-1">Plot Size</div>
                <div className="text-2xl font-bold text-blue-900">
                  {plotData.size_sqyd || 'TBD'} <span className="text-lg">sq.yd</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 space-y-5">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3 border-b pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Property Details
              </h2>
              
              {(() => {
                const description = plotData.description || '';
                const parts = description.split('Highlights:');
                const mainDescription = parts[0]?.trim();
                const highlights = parts[1]?.trim();
                
                return (
                  <>
                    {mainDescription && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-100">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M12 16v-4"/>
                              <path d="M12 8h.01"/>
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Overview</h3>
                        </div>
                        <div className="space-y-4">
                          {mainDescription.split('. ').filter(sentence => sentence.trim()).map((sentence, idx, arr) => {
                            const fullSentence = sentence.trim() + (idx < arr.length - 1 && !sentence.endsWith('.') ? '.' : '');
                            return fullSentence ? (
                              <p key={idx} className="text-gray-700 leading-relaxed text-base pl-4 border-l-2 border-blue-200">
                                {fullSentence}
                              </p>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    
                    {highlights && (
                      <div className="bg-white rounded-lg p-5 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Key Highlights
                        </h3>
                        <div className="space-y-4">
                          {highlights.split('\n').filter(line => line.trim()).map((line, idx) => {
                            const trimmedLine = line.trim();
                            if (trimmedLine.match(/^[A-Z][^:]+:/)) {
                              const [heading, ...rest] = trimmedLine.split(':');
                              return (
                                <div key={idx} className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded-r">
                                  <h4 className="font-semibold text-orange-900 mb-1">{heading}</h4>
                                  <p className="text-gray-700 text-sm">{rest.join(':').trim()}</p>
                                </div>
                              );
                            }
                            return trimmedLine ? (
                              <p key={idx} className="text-gray-700 text-sm pl-4">{trimmedLine}</p>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

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