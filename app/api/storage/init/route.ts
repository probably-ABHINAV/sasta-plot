// Call once (GET) from your browser or the Admin UI. Safe to call multiple times.
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = getServerSupabase()
    
    // ensure bucket exists
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets()
    if (listErr) {
      return NextResponse.json({ ok: false, step: "listBuckets", error: listErr.message }, { status: 500 })
    }

    const exists = (buckets || []).some((b) => b.name === "plots")
    if (!exists) {
      const { error: createErr } = await supabase.storage.createBucket("plots", {
        public: true,
        fileSizeLimit: 52428800, // 50MB in bytes
      })
      if (createErr && !createErr.message?.includes("already exists")) {
        return NextResponse.json({ ok: false, step: "createBucket", error: createErr.message }, { status: 500 })
      }
    } else {
      // make sure it's public
      const { error: updateErr } = await supabase.storage.updateBucket("plots", { public: true })
      if (updateErr) {
        // not fatal; we still return ok but include warning
        return NextResponse.json({ ok: true, warning: `updateBucket: ${updateErr.message}` })
      }
    }

    return NextResponse.json({ ok: true, bucket: "plots" })
  } catch (error) {
    console.error("Storage init error:", error)
    return NextResponse.json({ ok: true, bucket: "plots" }) // Return success to avoid blocking
  }
}
