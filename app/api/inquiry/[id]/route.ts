import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

// PUT: Update inquiry status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`[API] Updating inquiry ${params.id}...`)
  try {
    const { isAdminUser } = await import('@/lib/demo-auth')
    
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      console.warn(`[API] Unauthorized update attempt for inquiry ${params.id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body
    console.log(`[API] New status for ${params.id}: ${status}`)

    if (!['pending', 'seen', 'responded', 'closed'].includes(status)) {
      console.error(`[API] Invalid status: ${status}`)
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    try {
      const { supabase: adminSupabase } = await import('@/lib/supabase/admin')
      
      console.log(`[API] Attempting Supabase update...`)
      const { data, error } = await adminSupabase
        .from('inquiries')
        .update({ 
          status,
        })
        .eq('id', params.id)
        .select()
        .single()

      if (error) {
        console.error(`[API] Supabase update failed:`, error)
        throw new Error(`Supabase error: ${error.message}`)
      }

      console.log(`[API] Supabase update successful:`, data)
      return NextResponse.json({ success: true, inquiry: data })
    } catch (supabaseError) {
      console.error('Supabase inquiry update error:', supabaseError)
      
      // Fallback to file storage
      try {
        console.log(`[API] Falling back to file storage...`)
        const { fileStorage } = await import('@/lib/file-storage')
        const updatedInquiry = fileStorage.updateInquiry(params.id, { status })
        
        if (!updatedInquiry) {
          console.error(`[API] Inquiry not found in file storage`)
          return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
        }

        console.log(`[API] File storage update successful`)
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