
import { NextResponse } from "next/server"
import { getDemoUser, setDemoSession, clearSession } from "@/lib/demo-auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check admin credentials (server-side only)
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    
    if (email === adminEmail && password === adminPassword) {
      const user = { email, role: "admin" }
      const response = NextResponse.json({ user })
      response.headers.set("Set-Cookie", setDemoSession(user))
      return response
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getDemoUser()
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ user: null })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.headers.set("Set-Cookie", clearSession)
  return response
}
