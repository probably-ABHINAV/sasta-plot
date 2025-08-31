import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { name, email, message, plotId } = await req.json()

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_TO_EMAIL,
      subject: `Sasta Plots inquiry from ${name}${plotId ? ` (plot: ${plotId})` : ""}`,
      html: `<p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>`,
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("[contact] error:", e?.message)
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 })
  }
}
