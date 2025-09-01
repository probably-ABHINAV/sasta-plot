"use client"

import Image from "next/image"
import Link from "next/link"
import { FadeInSection, Stagger, Item, HoverLift } from "./animated-section"

const plots = [
  {
    id: 1,
    title: "Green Valley Enclave",
    price: "₹7.5 Lakh",
    size: "1200 sq ft",
    img: "/images/plots/plot-1.png",
    location: "Yamuna Expressway",
  },
  {
    id: 2,
    title: "Sunrise Meadows",
    price: "₹6.9 Lakh",
    size: "1000 sq ft",
    img: "/images/plots/plot-2.png",
    location: "Noida Extension",
  },
  {
    id: 3,
    title: "Lakeview Residency",
    price: "₹8.2 Lakh",
    size: "1500 sq ft",
    img: "/images/plots/plot-3.png",
    location: "Greater Noida",
  },
  {
    id: 4,
    title: "Palm County",
    price: "₹5.9 Lakh",
    size: "900 sq ft",
    img: "/images/plots/plot-4.png",
    location: "Yamuna City",
  },
  {
    id: 5,
    title: "Harmony Hills",
    price: "₹7.2 Lakh",
    size: "1100 sq ft",
    img: "/images/plots/plot-5.png",
    location: "Sector 150",
  },
  {
    id: 6,
    title: "Riverview Farms",
    price: "₹9.0 Lakh",
    size: "1800 sq ft",
    img: "/images/plots/plot-6.png",
    location: "Jewar Corridor",
  },
]

export default function HomeEnhanced() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <FadeInSection className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-24">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Aam Admi Ki Pasand
              </div>
              <h1 className="text-pretty text-4xl font-semibold leading-tight sm:text-5xl">
                Sasta Plots — Own land in prime locations at honest prices
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Budget-friendly residential plots carefully curated for families and first-time buyers. Transparent
                pricing, verified titles, and simple documentation.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/plots"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-white hover:opacity-90"
                >
                  Browse Plots
                </Link>
                <Link href="#contact" className="inline-flex items-center justify-center rounded-md border px-5 py-2.5">
                  Get a Call Back
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-4 pt-4 text-sm text-muted-foreground sm:grid-cols-3">
                <li>RERA-aligned listings</li>
                <li>Zero hidden charges</li>
                <li>Flexible payment plans</li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -left-6 -top-6 hidden h-20 w-20 opacity-10 sm:block">
                <Image
                  src="/images/logo-sasta-plots.png"
                  alt="Sasta Plots logo watermark"
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Image
                  src="/images/plots/plot-1.png"
                  alt="Featured plot 1"
                  width={400}
                  height={260}
                  className="rounded-lg"
                />
                <Image
                  src="/images/plots/plot-2.png"
                  alt="Featured plot 2"
                  width={400}
                  height={260}
                  className="rounded-lg"
                />
                <Image
                  src="/images/plots/plot-3.png"
                  alt="Featured plot 3"
                  width={400}
                  height={260}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Features */}
      <FadeInSection className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Verified Titles", d: "Every plot is vetted for clean ownership and documentation." },
              { t: "Prime Corridors", d: "Near metro, schools, and upcoming infrastructure projects." },
              { t: "Budget Friendly", d: "Transparent, EMI-friendly pricing. No surprises." },
              { t: "Guided Buy", d: "From site visit to registry—our team stays with you." },
            ].map((f, i) => (
              <Item key={i}>
                <div className="rounded-lg border bg-background p-5">
                  <h3 className="mb-1 font-medium">{f.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </FadeInSection>

      {/* Featured Plots */}
      <FadeInSection>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Featured Plots</h2>
            <Link href="/plots" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plots.map((p) => (
              <Item key={p.id}>
                <HoverLift>
                  <article className="group overflow-hidden rounded-xl border bg-background">
                    <div className="relative h-48 w-full sm:h-56">
                      <Image
                        src={p.img || "/placeholder.svg"}
                        alt={p.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="space-y-1 p-4">
                      <h3 className="font-medium">{p.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {p.location} • {p.size}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-primary">{p.price}</span>
                        <Link href={`/plots/plot-${p.id}`} className="text-sm underline underline-offset-4">
                          Details
                        </Link>
                      </div>
                    </div>
                  </article>
                </HoverLift>
              </Item>
            ))}
          </Stagger>
        </div>
      </FadeInSection>

      {/* Testimonials */}
      <FadeInSection className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h2 className="mb-6 text-2xl font-semibold">What buyers say</h2>
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "Rohit S.", c: "Clean documentation and quick registry. Best value near Yamuna Expressway!" },
              { n: "Neha & Ankit", c: "Team guided us through bank loan and site visits. Smooth process." },
              { n: "Kiran M.", c: "Genuine pricing—no hidden charges. Highly recommended for first-time buyers." },
            ].map((t, i) => (
              <Item key={i}>
                <blockquote className="rounded-lg border bg-background p-5">
                  <p className="text-pretty leading-relaxed">“{t.c}”</p>
                  <footer className="mt-2 text-sm text-muted-foreground">— {t.n}</footer>
                </blockquote>
              </Item>
            ))}
          </Stagger>
        </div>
      </FadeInSection>

      {/* CTA */}
      <FadeInSection>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="rounded-2xl border bg-primary/5 p-6 sm:p-10">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-pretty text-xl font-semibold sm:text-2xl">Ready to visit a site this week?</h3>
                <p className="text-muted-foreground">Share your details. Our advisor will call you within 24 hours.</p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-white hover:opacity-90"
              >
                Request a Call Back
              </a>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Contact */}
      <FadeInSection>
        <div id="contact" className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="mb-4 text-2xl font-semibold">Get in touch</h2>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget as HTMLFormElement
              const data = Object.fromEntries(new FormData(form).entries())
              try {
                const res = await fetch("/api/inquiry", { method: "POST", body: JSON.stringify(data) })
                if (!res.ok) throw new Error("Failed")
                alert("Thanks! We will contact you shortly.")
                form.reset()
              } catch {
                alert("Message sent locally. Connect email/DB later for production.")
              }
            }}
          >
            <input required name="name" placeholder="Full name" className="rounded-md border px-3 py-2" />
            <input required name="phone" placeholder="Phone number" className="rounded-md border px-3 py-2" />
            <input name="email" placeholder="Email (optional)" className="rounded-md border px-3 py-2 sm:col-span-2" />
            <textarea
              name="message"
              placeholder="Message"
              className="min-h-[100px] rounded-md border px-3 py-2 sm:col-span-2"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-white hover:opacity-90 sm:col-span-2"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </FadeInSection>
    </main>
  )
}