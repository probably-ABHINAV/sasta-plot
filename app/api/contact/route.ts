import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, plotSlug } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Save inquiry to Supabase
    const supabase = getServerSupabase()
    
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: String(name).slice(0, 120),
          email: String(email).slice(0, 120),
          phone: phone ? String(phone).slice(0, 40) : null,
          message: String(message).slice(0, 1000),
          plot_id: plotSlug || null,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error saving contact inquiry:", error)
    }

    // Only send email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        } as any)

        const mailOptions = {
          from: process.env.SMTP_FROM,
          to: process.env.SMTP_USER,
          subject: `Contact Form - ${plotSlug ? `Plot Inquiry: ${plotSlug}` : 'General Contact'}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Plot:</strong> ${plotSlug || 'General inquiry'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
        }

        await transporter.sendMail(mailOptions)
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Contact form submitted successfully. Our team will contact you soon.",
      inquiry 
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { success: true, message: "Contact form submitted successfully" },
      { status: 200 }
    )
  }
}
