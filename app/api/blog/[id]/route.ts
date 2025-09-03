
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabase()
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error("Error fetching post:", error)
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { supabase: adminSupabase } = await import('@/lib/supabase/admin')
    const { isAdminUser } = await import('@/lib/demo-auth')

    // Check demo authentication for admin access
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, slug, published } = body
    
    const { data: post, error } = await adminSupabase
      .from('posts')
      .update({
        title,
        content,
        excerpt,
        slug,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating post:", error)
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { supabase: adminSupabase } = await import('@/lib/supabase/admin')
    const { isAdminUser } = await import('@/lib/demo-auth')

    // Check demo authentication for admin access
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }
    
    const { error } = await adminSupabase
      .from('posts')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error("Error deleting post:", error)
      return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
