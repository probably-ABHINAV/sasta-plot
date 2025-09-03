
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    
    const supabase = getServerSupabase()
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    // Only filter by published if not admin
    if (!admin) {
      query = query.eq('published', true)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error("Error fetching posts:", error)
      // Return empty posts array as fallback
      return NextResponse.json({ posts: [] })
    }

    return NextResponse.json({ posts: posts || [] })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ posts: [] })
  }
}

export async function POST(request: Request) {
  try {
    const { isAdminUser } = await import('@/lib/demo-auth')
    const { supabase: adminSupabase } = await import('@/lib/supabase/admin')

    // Check demo authentication for admin access
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, slug, published = false } = body
    
    const { data: post, error } = await adminSupabase
      .from('posts')
      .insert([
        {
          title,
          content,
          excerpt,
          slug,
          published,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating post:", error)
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
