// Accepts multipart/form-data: field "file" (File) and optional "prefix".
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export const maxDuration = 60

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file") as File | null
  const prefix = (form.get("prefix") as string) || "uploads"

  if (!file) {
    return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 })
  }

  const ext = file.name.split(".").pop() || "bin"
  const ts = Date.now()
  const key = `${prefix}/${ts}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: upErr } = await supabaseAdmin.storage.from("plots").upload(key, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  })
  if (upErr) {
    return NextResponse.json({ ok: false, step: "upload", error: upErr.message }, { status: 500 })
  }

  // For a public bucket, this is the public URL:
  const publicUrl = `${process.env.SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public/plots/${encodeURI(key)}`

  return NextResponse.json({ ok: true, key, publicUrl })
}
