// Lightweight demo auth helpers using a cookie. Upgradeable to Supabase later.
import { cookies } from "next/headers"

export type DemoUser = {
  email: string
  role: "admin" | "user"
}

const COOKIE = "demo_session"

function encode(obj: unknown) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url")
}

function decode<T>(val: string): T | null {
  try {
    return JSON.parse(Buffer.from(val, "base64url").toString()) as T
  } catch {
    return null
  }
}

export async function getDemoUser(): Promise<DemoUser | null> {
  const c = await cookies()
  const raw = c.get(COOKIE)?.value
  if (!raw) return null
  return decode<DemoUser>(raw)
}

export function serializeSession(user: DemoUser) {
  // 7 days
  const maxAge = 60 * 60 * 24 * 7
  return `${COOKIE}=${encode(user)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
}

export const clearSession = `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
