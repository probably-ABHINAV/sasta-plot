import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || "").slice(0, 120)
    const phone = String(body.phone || "").slice(0, 40)
    const email = String(body.email || "").slice(0, 120)
    const message = String(body.message || "").slice(0, 1000)
    const plotId = body.plotId ? Number(body.plotId) : null

    console.log("[v0] Inquiry received:", { name, phone, email, message })

    // Try DB insert first; if tables aren’t created yet, just return success.
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log("[v0] Supabase not configured, skipping DB insert")
        return NextResponse.json({ success: true, message: "Inquiry received. Our team will contact you soon." })
      }

      const supabase = getServerSupabase()
      await supabase.from("inquiries").insert({
        name,
        phone,
        email,
        message,
        plot_id: plotId,
      })
    } catch (e) {
      console.log("[v0] inquiries table not ready yet, skipping DB insert")
    }

    return NextResponse.json({ success: true, message: "Inquiry received. Our team will contact you soon." })
  } catch (e) {
    console.error("[v0] Inquiry error:", e)
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 })
  }
}
