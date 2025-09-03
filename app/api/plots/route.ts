
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = getServerSupabase()
    
    if (!supabase) {
      console.error("Supabase client not initialized")
      return NextResponse.json({ plots: [], error: "Database connection failed" }, { status: 500 })
    }

    const { data: plots, error } = await supabase
      .from('plots')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Supabase error fetching plots:", error)
      return NextResponse.json({ plots: [], error: error.message }, { status: 500 })
    }

    if (!plots) {
      return NextResponse.json({ plots: [] }, { status: 200 })
    }

    const normalized = plots.map((p) => ({
      id: p.id.toString(),
      title: p.title || '',
      location: p.location || '',
      price: p.price || 0,
      size_sqyd: p.size_sqyd || 0,
      size_unit: p.size_unit || 'sq.yd',
      size: p.size_sqyd && p.size_unit ? `${p.size_sqyd} ${p.size_unit}` : 'Size TBD',
      description: p.description || '',
      featured: Boolean(p.featured),
      slug: p.slug || '',
      image: p.image_url || '',
      image_url: p.image_url || '',
      created_at: p.created_at || new Date().toISOString()
    }))

    return NextResponse.json({ plots: normalized })
  } catch (error) {
    console.error("Unexpected error fetching plots:", error)
    return NextResponse.json({ 
      plots: [], 
      error: "Failed to fetch plots" 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, location, price, size_sqyd, size_unit, description, featured, imageUrl } = body

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (!location?.trim()) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 })
    }
    if (!size_sqyd || isNaN(Number(size_sqyd)) || Number(size_sqyd) <= 0) {
      return NextResponse.json({ error: "Valid size is required" }, { status: 400 })
    }

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

    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Check if slug already exists
    const { data: existingPlot } = await supabase
      .from('plots')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingPlot) {
      return NextResponse.json({ error: "A plot with this title already exists" }, { status: 400 })
    }

    const { data: plot, error } = await supabase
      .from('plots')
      .insert([
        {
          title: title.trim(),
          location: location.trim(),
          price: Number(price),
          size_sqyd: Number(size_sqyd),
          size_unit: size_unit || 'sq.yd',
          description: description?.trim() || '',
          featured: Boolean(featured),
          slug,
          image_url: imageUrl || null,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase plot creation error:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ 
      id: plot.id, 
      message: "Plot created successfully",
      slug: plot.slug 
    }, { status: 201 })
  } catch (error) {
    console.error("Unexpected plot creation error:", error)
    return NextResponse.json({ error: "Failed to create plot" }, { status: 500 })
  }
}
