
import { NextRequest, NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getServerSupabase()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ 
      authenticated: true, 
      user: {
        id: user.id,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
