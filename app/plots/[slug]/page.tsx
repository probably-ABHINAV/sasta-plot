import Image from "next/image"
import { notFound } from "next/navigation"
import { getServerSupabase } from "@/lib/supabase/server"
import InquiryForm from "@/components/inquiry-form"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} | Sasta Plots` }
}

export default async function PlotDetail({ params }: { params: { slug: string } }) {
  const supabase = getServerSupabase()
  const { data, error } = await supabase.from("plots").select("*").eq("slug", params.slug).single()
  if (error || !data) return notFound()

  const images: string[] = data.images?.length ? data.images : ["/images/plots/plot-1.png"]

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="grid gap-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border">
            <Image src={images[0] || "/placeholder.svg"} alt={data.title} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded border">
                <Image src={src || "/placeholder.svg"} alt={`${data.title} ${i + 2}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold md:text-3xl">{data.title}</h1>
          <p className="text-muted-foreground">{data.location}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            {data.size ? <span className="rounded bg-muted px-2 py-0.5">{data.size} sq.yd</span> : null}
            {data.price ? (
              <span className="rounded bg-muted px-2 py-0.5">₹ {Number(data.price).toLocaleString()}</span>
            ) : null}
            {data.approval_type ? <span className="rounded bg-muted px-2 py-0.5">{data.approval_type}</span> : null}
          </div>
          <p>{data.description}</p>
          <InquiryForm plotId={data.id} />
        </div>
      </div>
    </main>
  )
}
