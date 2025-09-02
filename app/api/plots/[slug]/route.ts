import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/file-storage"

export async function DELETE(_: Request, { params }: { params: { slug: string } }) {
  try {
    const success = fileStorage.deletePlot(params.slug)
    if (!success) {
      return NextResponse.json({ error: "Plot not found" }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Plot deletion error:", error)
    return NextResponse.json({ error: "Failed to delete plot" }, { status: 500 })
  }
}
