import { type NextRequest, NextResponse } from "next/server"
import { clearSession, serializeSession, getDemoUser } from "@/lib/demo-auth"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}))
  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
  }
  // Demo rule: emails containing "admin" become admin
  const role = String(email).toLowerCase().includes("admin") ? "admin" : "user"

  const res = NextResponse.json({ ok: true, user: { email, role } })
  res.headers.set("Set-Cookie", serializeSession({ email, role }))
  return res
}

export async function GET() {
  const user = await getDemoUser()
  return NextResponse.json({ user })
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.headers.set("Set-Cookie", clearSession)
  return res
}
