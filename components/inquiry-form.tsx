"use client"

import type React from "react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function InquiryForm() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<null | { ok: boolean; message: string }>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") || "").trim()
    const phone = String(data.get("phone") || "").trim()
    const email = String(data.get("email") || "").trim()
    const msg = String(data.get("message") || "").trim()

    if (!name || !phone) {
      setStatus({ ok: false, message: "Please enter your name and phone." })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message: msg }),
      })
      const payload = await res.json()
      if (res.ok) {
        setStatus({ ok: true, message: payload.message || "Thanks! We will contact you shortly." })
        form.reset()
      } else {
        setStatus({ ok: false, message: payload.error || "Something went wrong." })
      }
    } catch {
      setStatus({ ok: false, message: "Network error. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-card p-5" id="contact">
      <div>
        <h2 className="text-lg font-semibold">Get a Call Back</h2>
        <p className="text-sm text-muted-foreground">Share your details and we’ll reach out.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          placeholder="Full name"
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Full name"
          required
        />
        <input
          name="phone"
          placeholder="Phone number"
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Phone number"
          required
        />
      </div>
      <input
        name="email"
        placeholder="Email (optional)"
        type="email"
        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label="Email"
      />
      <textarea
        name="message"
        placeholder="Tell us your preferred location or budget"
        className="min-h-[88px] w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label="Message"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Sending..." : "Request Callback"}
      </button>
      <AnimatePresence>
        {status && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className={status.ok ? "text-sm text-emerald-600" : "text-sm text-red-600"}
          >
            {status.message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

export default InquiryForm