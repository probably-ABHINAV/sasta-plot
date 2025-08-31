import { getServerSupabase } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function PlotDetailPage({ params }: { params: { id: string } }) {
  const supabase = getServerSupabase()
  const id = Number(params.id)
  const { data, error } = await supabase
    .from("plots")
    .select("id,title,location,price,size_sqyd,description,plot_images(url)")
    .eq("id", id)
    .single()

  if (error || !data) notFound()

  const image = (data as any).plot_images?.[0]?.url

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {image && (
        <img
          src={image || "/placeholder.svg"}
          alt={data.title as string}
          className="aspect-video w-full rounded object-cover"
        />
      )}
      <h1 className="mt-4 font-heading text-2xl font-semibold">{String(data.title)}</h1>
      <p className="text-sm">{String(data.location)}</p>
      <p className="text-sm">Size: {Number(data.size_sqyd)} sq. yd.</p>
      <p className="text-sm">₹ {Number(data.price).toLocaleString()}</p>
      {data.description && <p className="mt-4 text-pretty">{String(data.description)}</p>}
      <a className="mt-6 inline-block rounded bg-primary px-4 py-2 text-primary-foreground" href="/#contact">
        Enquire now
      </a>
    </main>
  )
}
