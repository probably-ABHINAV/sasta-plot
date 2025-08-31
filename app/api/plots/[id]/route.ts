import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = Number(params.id)
  const { error } = await supabase.from("plots").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
