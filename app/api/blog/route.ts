
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    
    try {
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
        throw new Error(`Supabase error: ${error.message}`)
      }

      return NextResponse.json({ posts: posts || [] })
    } catch (supabaseError) {
      console.error("Supabase error fetching posts:", supabaseError)
      
      // Fallback to file storage
      try {
        const { fileStorage } = await import('@/lib/file-storage')
        const blogPosts = fileStorage.getBlogPosts()
        
        // Filter by published status if not admin
        const filteredPosts = admin ? blogPosts : blogPosts.filter(post => post.published)
        
        return NextResponse.json({ posts: filteredPosts })
      } catch (fallbackError) {
        console.error("File storage fallback failed:", fallbackError)
        return NextResponse.json({ posts: [] })
      }
    }
  } catch (error) {
    console.error("Unexpected error fetching posts:", error)
    
    // Final fallback to file storage
    try {
      const { fileStorage } = await import('@/lib/file-storage')
      const blogPosts = fileStorage.getBlogPosts()
      return NextResponse.json({ posts: blogPosts.filter(post => post.published) })
    } catch (fallbackError) {
      return NextResponse.json({ posts: [], error: "Failed to fetch posts" }, { status: 500 })
    }
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
