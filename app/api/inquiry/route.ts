import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/file-storage"

export async function GET() {
  try {
    const inquiries = fileStorage.getInquiries()
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
    const plotId = body.plotId ? String(body.plotId) : undefined

    console.log("Inquiry received:", { name, phone, email, message })

    const inquiry = fileStorage.createInquiry({
      name,
      email,
      phone,
      message,
      plot_id: plotId,
    })

    return NextResponse.json({ success: true, message: "Inquiry received. Our team will contact you soon.", inquiry })
  } catch (e) {
    console.error("Inquiry error:", e)
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 })
  }
}