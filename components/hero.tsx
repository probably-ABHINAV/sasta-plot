import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">Explore Affordable Plots</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Invest confidently in land. Browse verified, DTCP/CMDA approved plots with clear titles, transparent
            pricing, and all key details in one place.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/plots"
              className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Browse Plots
            </Link>
            <Link href="/contact" className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-accent/50">
              Contact Us
            </Link>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li className="rounded-md border p-3">Verified approvals</li>
            <li className="rounded-md border p-3">Transparent pricing</li>
            <li className="rounded-md border p-3">Map & neighbourhood info</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
