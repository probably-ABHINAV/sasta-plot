
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'
    
    // Check admin authentication for admin requests
    if (isAdmin) {
      const { isAdminUser } = await import('@/lib/demo-auth')
      const adminCheck = await isAdminUser()
      if (!adminCheck) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = getServerSupabase()
    const { data: inquiries, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching inquiries:", error)
      
      // Fallback to file storage
      try {
        const { fileStorage } = await import('@/lib/file-storage')
        const fileInquiries = fileStorage.getInquiries()
        return NextResponse.json({ inquiries: fileInquiries })
      } catch (fallbackError) {
        console.error("File storage fallback failed:", fallbackError)
        return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
      }
    }

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || "").slice(0, 120)
    const phone = String(body.phone || "").slice(0, 40)
    const email = String(body.email || "").slice(0, 120)
    const message = String(body.message || "").slice(0, 1000)
    const plotId = body.plotId ? String(body.plotId) : null
    const status = body.status || 'pending'

    console.log("Inquiry received:", { name, phone, email, message })

    const supabase = getServerSupabase()
    
    const inquiryData = {
      name,
      email: email || null,
      phone: phone || null,
      message: message || null,
      plot_id: plotId || null,
      status: status || 'pending',
    }

    console.log('Attempting to insert inquiry:', inquiryData)

    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select()
      .single()

    if (error) {
      console.error("Supabase error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Fallback to file storage
      try {
        const { fileStorage } = await import('@/lib/file-storage')
        const inquiryData = {
          name,
          email: email || '',
          phone: phone || '',
          message: message || '',
          plot_id: plotId || null,
          status: status || 'pending',
        }
        const savedInquiry = fileStorage.createInquiry(inquiryData)
        console.log('Saved to file storage:', savedInquiry)
        return NextResponse.json({ 
          success: true, 
          message: "Inquiry received. Our team will contact you soon.", 
          inquiry: savedInquiry 
        })
      } catch (fallbackError) {
        console.error("File storage fallback failed:", fallbackError)
        return NextResponse.json({ success: false, error: "Failed to save inquiry." }, { status: 500 })
      }
    }

    console.log('Inquiry saved successfully:', inquiry)

    return NextResponse.json({ 
      success: true, 
      message: "Inquiry received. Our team will contact you soon.", 
      inquiry 
    })
  } catch (e) {
    console.error("Inquiry error:", e)
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 })
  }
}
