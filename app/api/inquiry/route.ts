import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

// Mock data for inquiries since we don't have a real database
const mockInquiries = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 9876543210",
    message: "I'm interested in the Budget Plot near NH-48. Can we schedule a visit this weekend?",
    plot_id: "1",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 9876543211",
    message: "What are the payment options for the Corner Plot in Gated Community?",
    plot_id: "2",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    message: "Do you have any plots available in Noida? My budget is around 8-10 lakhs.",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
]

export async function GET() {
  try {
    return NextResponse.json({ inquiries: mockInquiries })
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
    const plotId = body.plotId ? Number(body.plotId) : null

    console.log("[v0] Inquiry received:", { name, phone, email, message })

    // Create new inquiry object
    const newInquiry = {
      id: (mockInquiries.length + 1).toString(),
      name,
      email,
      phone,
      message,
      plot_id: plotId?.toString(),
      created_at: new Date().toISOString()
    }

    // Add to mock data
    mockInquiries.unshift(newInquiry)

    // Try DB insert as fallback if Supabase is configured
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = getServerSupabase()
        await supabase.from("inquiries").insert({
          name,
          phone,
          email,
          message,
          plot_id: plotId,
        })
      }
    } catch (e) {
      console.log("[v0] DB insert failed, using mock data only:", e)
    }

    return NextResponse.json({ success: true, message: "Inquiry received. Our team will contact you soon." })
  } catch (e) {
    console.error("[v0] Inquiry error:", e)
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 })
  }
}