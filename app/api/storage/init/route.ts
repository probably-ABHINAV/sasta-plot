// Call once (GET) from your browser or the Admin UI. Safe to call multiple times.
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  // ensure bucket exists
  const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets()
  if (listErr) {
    return NextResponse.json({ ok: false, step: "listBuckets", error: listErr.message }, { status: 500 })
  }

  const exists = (buckets || []).some((b) => b.name === "plots")
  if (!exists) {
    const { error: createErr } = await supabaseAdmin.storage.createBucket("plots", {
      public: true,
      fileSizeLimit: "50MB",
    })
    if (createErr && createErr.message?.includes("already exists") === false) {
      return NextResponse.json({ ok: false, step: "createBucket", error: createErr.message }, { status: 500 })
    }
  } else {
    // make sure it's public
    const { error: updateErr } = await supabaseAdmin.storage.updateBucket("plots", { public: true })
    if (updateErr) {
      // not fatal; we still return ok but include warning
      return NextResponse.json({ ok: true, warning: `updateBucket: ${updateErr.message}` })
    }
  }

  return NextResponse.json({ ok: true, bucket: "plots" })
}
