import Link from "next/link"

export function CtaBanner() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center md:flex-row md:text-left">
        <h3 className="text-pretty text-xl font-semibold">Book a free site visit this week</h3>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground hover:opacity-90"
        >
          Enquire Now
        </Link>
      </div>
    </section>
  )
}
