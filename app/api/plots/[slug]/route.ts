import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = getServerSupabase()
    const { data: plot, error } = await supabase
      .from('plots')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error) {
      console.error("Error fetching plot:", error)
      return NextResponse.json({ error: "Plot not found" }, { status: 404 })
    }

    const normalized = {
      id: plot.id.toString(),
      title: plot.title,
      location: plot.location,
      price: plot.price,
      size_sqyd: plot.size_sqyd,
      size_unit: plot.size_unit || 'sq.yd',
      size: plot.size_sqyd && plot.size_unit ? `${plot.size_sqyd} ${plot.size_unit}` : 'Size TBD',
      description: plot.description,
      featured: plot.featured,
      slug: plot.slug,
      image: plot.image_url,
      image_url: plot.image_url,
      created_at: plot.created_at
    }

    return NextResponse.json({ plot: normalized })
  } catch (error) {
    console.error("Error fetching plot:", error)
    return NextResponse.json({ error: "Failed to fetch plot" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { supabase: adminSupabase } = await import('@/lib/supabase/admin')
    const supabase = getServerSupabase()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, location, price, size_sqyd, size_unit, description, featured, image_url } = body

    // Generate new slug if title changed
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Use admin client to bypass RLS issues
    const { data: plot, error } = await adminSupabase
      .from('plots')
      .update({
        title,
        location,
        price: parseFloat(price),
        size_sqyd: parseInt(size_sqyd),
        size_unit: size_unit || 'sq.yd',
        description,
        featured: Boolean(featured),
        image_url,
        slug: newSlug,
      })
      .eq('slug', params.slug)
      .select()
      .single()

    if (error) {
      console.error("Supabase plot update error:", error)
      return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ 
      id: plot.id, 
      message: "Plot updated successfully",
      slug: plot.slug 
    }, { status: 200 })
  } catch (error) {
    console.error("Unexpected plot update error:", error)
    return NextResponse.json({ error: "Failed to update plot" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { supabase: adminSupabase } = await import('@/lib/supabase/admin')
    const supabase = getServerSupabase()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use admin client to bypass RLS issues
    const { error } = await adminSupabase
      .from('plots')
      .delete()
      .eq('slug', params.slug)

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json({ error: "Failed to delete plot" }, { status: 500 })
    }

    return NextResponse.json({ message: "Plot deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete plot" }, { status: 500 })
  }
}
