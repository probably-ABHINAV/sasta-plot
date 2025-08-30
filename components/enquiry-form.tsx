"use client"

import type React from "react"
import { track } from "@vercel/analytics" // add analytics event
import useSWR from "swr"
import { useState } from "react"
import type { ContactPayload } from "@/types"

export function EnquiryForm(props: { plotId?: string; plotTitle?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const { data: contactConfig, isLoading: contactLoading } = useSWR<{ ok: boolean; enabled: boolean }>(
    "/api/contact",
    (url) => fetch(url).then((r) => r.json()),
    { revalidateOnFocus: false },
  )
  const contactEnabled = !!contactConfig?.enabled

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!contactEnabled) {
      setError("Enquiries are temporarily unavailable. Please try again later.")
      setStatus("error")
      return
    }
    setStatus("submitting")
    setError("")
    const fd = new FormData(e.currentTarget)

    const website = String(fd.get("website") || "")

    const payload: ContactPayload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
      subject: `Plot enquiry: ${props.plotTitle || ""}`,
      plotId: props.plotId,
      plotTitle: props.plotTitle,
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website }),
      })
      if (!res.ok) throw new Error(await res.text())
      try {
        track("enquiry_submitted", { plotId: props.plotId || null }) // custom event
      } catch {}
      setStatus("success")
      e.currentTarget.reset()
    } catch (err: any) {
      setError(err?.message || "Failed to send")
      setStatus("error")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border p-4">
      {!contactLoading && !contactEnabled && (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Enquiries are currently unavailable. Please check back later or contact us via another channel.
        </p>
      )}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset disabled={status === "submitting" || (!contactLoading && !contactEnabled)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea name="message" rows={4} required className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <button
          disabled={status === "submitting" || (!contactLoading && !contactEnabled)}
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-70"
        >
          {status === "submitting" ? "Sending..." : "Enquire Now"}
        </button>
      </fieldset>

      {status === "success" && <p className="text-sm text-emerald-700">Thanks! We will get back to you shortly.</p>}
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
