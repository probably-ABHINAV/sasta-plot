import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = getServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { error } = await supabase.from("plots").delete().eq("slug", params.slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Plot deletion error:", error)
    return NextResponse.json({ error: "Failed to delete plot" }, { status: 500 })
  }
}
