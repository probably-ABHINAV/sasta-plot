// components/cta-banner.tsx
"use client"

import React from "react"
import Link from "next/link"

export default function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Own Your Dream Plot?</h3>
        <p className="mb-6 text-md sm:text-lg text-orange-100">
          Join thousands of customers who found the perfect plot with us. Personalized assistance & verified documentation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/plots"
            className="inline-flex items-center justify-center rounded-2xl bg-white text-orange-600 px-8 py-3 text-lg font-semibold shadow"
          >
            Explore Plots
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-2xl border border-white text-white px-8 py-3 text-lg font-semibold"
          >
            Schedule a Visit
          </Link>
        </div>

        <p className="mt-6 text-sm text-orange-200">📞 +91-9876543210 • ✉️ sales@sastaplots.in</p>
      </div>
    </section>
  )
}
