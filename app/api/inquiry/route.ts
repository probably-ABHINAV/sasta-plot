import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || "").slice(0, 120)
    const phone = String(body.phone || "").slice(0, 40)
    const email = String(body.email || "").slice(0, 120)
    const message = String(body.message || "").slice(0, 1000)

    console.log("[v0] Inquiry received:", { name, phone, email, message })

    // TODO: integrate email or DB here if desired.
    return NextResponse.json({ success: true, message: "Inquiry received. Our team will contact you soon." })
  } catch (e) {
    console.error("[v0] Inquiry error:", e)
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 })
  }
}
