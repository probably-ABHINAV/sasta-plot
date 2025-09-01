import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  const { data: plots, error } = await supabase
    .from("plots")
    .select("id,title,location,price,size_sqyd,description,featured,slug,plot_images(url)")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ plots: [], warning: error.message }, { status: 200 })

  const normalized = (plots || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.price ? `₹${Number(p.price).toLocaleString()}` : 'Price on request',
    size: p.size_sqyd ? `${p.size_sqyd} sq.yd` : 'Size TBD',
    description: p.description,
    featured: p.featured,
    slug: p.slug,
    image: p.plot_images?.[0]?.url,
  }))

  return NextResponse.json({ plots: normalized })
}

export async function POST(request: Request) {
  const supabase = getServerSupabase()
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { title, location, price, size_sqyd, description, featured, imageUrl } = await request.json()

    // Generate slug from title
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    const slug = generateSlug(title)

    const { data, error } = await supabase
      .from("plots")
      .insert({ title, location, price, size_sqyd, description, featured, slug, created_by: user.id })
      .select("id")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    if (imageUrl) {
      await supabase.from("plot_images").insert({ plot_id: data.id, url: imageUrl })
    }

    return NextResponse.json({ id: data.id }, { status: 201 })
  } catch (error) {
    console.error("Plot creation error:", error)
    return NextResponse.json({ error: "Failed to create plot" }, { status: 500 })
  }
}
