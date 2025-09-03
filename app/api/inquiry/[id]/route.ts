import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

// PUT: Update inquiry status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAdminUser } = await import('@/lib/demo-auth')
    
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!['pending', 'seen', 'responded', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    try {
      const { supabase: adminSupabase } = await import('@/lib/supabase/admin')
      
      const { data, error } = await adminSupabase
        .from('inquiries')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      return NextResponse.json({ success: true, inquiry: data })
    } catch (supabaseError) {
      console.error('Supabase inquiry update error:', supabaseError)
      
      // Fallback to file storage
      try {
        const { fileStorage } = await import('@/lib/file-storage')
        const updatedInquiry = fileStorage.updateInquiry(params.id, { status })
        
        if (!updatedInquiry) {
          return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, inquiry: updatedInquiry })
      } catch (fallbackError) {
        console.error('File storage fallback failed:', fallbackError)
        return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
      }
    }
  } catch (error: any) {
    console.error('Unexpected inquiry update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAdminUser } = await import('@/lib/demo-auth')
    
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const { supabase: adminSupabase } = await import('@/lib/supabase/admin')
      
      const { error } = await adminSupabase
        .from('inquiries')
        .delete()
        .eq('id', params.id)

      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      return NextResponse.json({ success: true })
    } catch (supabaseError) {
      console.error('Supabase inquiry delete error:', supabaseError)
      
      // Fallback to file storage
      try {
        const { fileStorage } = await import('@/lib/file-storage')
        const deleted = fileStorage.deleteInquiry(params.id)
        
        if (!deleted) {
          return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true })
      } catch (fallbackError) {
        console.error('File storage fallback failed:', fallbackError)
        return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
      }
    }
  } catch (error: any) {
    console.error('Unexpected inquiry delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}