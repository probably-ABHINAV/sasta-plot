
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const { data: plots, error } = await supabase
      .from('plots')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching plots:", error)
      return NextResponse.json({ plots: [] }, { status: 200 })
    }

    const normalized = plots.map((p) => ({
      id: p.id,
      title: p.title,
      location: p.location,
      price: p.price ? `₹${Number(p.price).toLocaleString()}` : 'Price on request',
      size: p.size_sqyd && p.size_unit ? `${p.size_sqyd} ${p.size_unit}` : 'Size TBD',
      description: p.description,
      featured: p.featured,
      slug: p.slug,
      image: p.image_url,
    }))

    return NextResponse.json({ plots: normalized })
  } catch (error) {
    console.error("Error fetching plots:", error)
    return NextResponse.json({ plots: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, location, price, size_sqyd, size_unit, description, featured, imageUrl } = await request.json()

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
    const supabase = getServerSupabase()

    const { data: plot, error } = await supabase
      .from('plots')
      .insert([
        {
          title,
          location,
          price,
          size_sqyd,
          size_unit: size_unit || 'sq.yd',
          description,
          featured,
          slug,
          image_url: imageUrl,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Plot creation error:", error)
      return NextResponse.json({ error: "Failed to create plot" }, { status: 500 })
    }

    return NextResponse.json({ id: plot.id }, { status: 201 })
  } catch (error) {
    console.error("Plot creation error:", error)
    return NextResponse.json({ error: "Failed to create plot" }, { status: 500 })
  }
}
