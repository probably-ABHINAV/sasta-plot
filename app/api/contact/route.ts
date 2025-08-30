import { NextResponse } from "next/server"

// Ensure we don't duplicate exports if a GET already exists
export async function GET() {
  const enabled =
    !!process.env.SMTP_HOST &&
    !!process.env.SMTP_PORT &&
    !!process.env.SMTP_USER &&
    !!process.env.SMTP_PASS &&
    !!process.env.CONTACT_TO_EMAIL

  return NextResponse.json({ ok: true, enabled })
}
