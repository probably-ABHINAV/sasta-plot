
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

    if (error || !plot) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 })
    }

    return NextResponse.json({ plot })
  } catch (error) {
    console.error("Error fetching plot:", error)
    return NextResponse.json({ error: "Failed to fetch plot" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { title, location, price, size_sqyd, description, featured, imageUrl } = body

    const supabase = getServerSupabase()
    
    const { data: plot, error } = await supabase
      .from('plots')
      .update({
        title,
        location,
        price,
        size_sqyd,
        description,
        featured,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', params.slug)
      .select()
      .single()

    if (error) {
      console.error("Error updating plot:", error)
      return NextResponse.json({ error: "Failed to update plot" }, { status: 500 })
    }

    return NextResponse.json({ plot })
  } catch (error) {
    console.error("Error updating plot:", error)
    return NextResponse.json({ error: "Failed to update plot" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = getServerSupabase()
    
    const { error } = await supabase
      .from('plots')
      .delete()
      .eq('slug', params.slug)

    if (error) {
      console.error("Error deleting plot:", error)
      return NextResponse.json({ error: "Failed to delete plot" }, { status: 500 })
    }

    return NextResponse.json({ message: "Plot deleted successfully" })
  } catch (error) {
    console.error("Error deleting plot:", error)
    return NextResponse.json({ error: "Failed to delete plot" }, { status: 500 })
  }
}
