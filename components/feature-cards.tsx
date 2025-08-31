import type { ReactNode } from "react"

function Feature({ title, desc, icon }: { title: string; desc: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

export function FeatureCards() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8">
        <h2 className="font-heading text-pretty text-2xl font-semibold md:text-3xl">Why Sasta Plots?</h2>
        <p className="text-muted-foreground">Transparent pricing, verified documentation, and prime connectivity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Feature
          title="Verified Titles"
          desc="Every listing is vetted for ownership, encumbrances, and approvals."
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
              <path d="M9 12l2 2 4-4 2 2-6 6-4-4z" />
            </svg>
          }
        />
        <Feature
          title="Great Locations"
          desc="Close to schools, workplaces, and transit with planned growth."
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
              <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
          }
        />
        <Feature
          title="Flexible Payments"
          desc="Installments and financing support to fit your budget."
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current" aria-hidden="true">
              <path d="M3 6h18v12H3zM5 10h5v2H5z" />
            </svg>
          }
        />
      </div>
    </section>
  )
}
