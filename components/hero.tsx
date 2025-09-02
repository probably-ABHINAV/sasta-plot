"use client"

import Image from "next/image"
import Link from "next/link"
import { FadeIn, HoverLift, Stagger } from "@/components/animate"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:py-16">
        <FadeIn className="space-y-5" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            Trusted affordable plots
          </div>
          <h1 className="font-heading text-pretty text-3xl font-semibold leading-tight md:text-4xl">
            Own Your Plot with Confidence
          </h1>
          <p className="text-pretty text-muted-foreground md:text-base">
            At Sasta Plots, we believe land ownership should be simple, secure, and affordable. Our mission is to help everyday families and first-time buyers invest in plots that are not only budget-friendly but also verified, well-connected, and future-ready.
          </p>
          <Stagger className="flex flex-col gap-3 sm:flex-row" delay={0.15}>
            <Link
              href="/plots"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Browse Plots
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Talk to Sales
            </Link>
          </Stagger>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <li>Clear titles</li>
            <li>Prime locations</li>
            <li>Flexible payment</li>
            <li>RERA guidance</li>
            <li>Legal support</li>
            <li>Hassle-free process</li>
          </ul>
        </FadeIn>

        <FadeIn delay={0.1} className="relative">
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl bg-primary/5" />
          <HoverLift>
            <div className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
              <Image
                src="/images/plots/plot-1.png"
                alt="Featured residential plot"
                width={800}
                height={600}
                className="h-auto w-full rounded-md object-cover"
                priority
              />
            </div>
          </HoverLift>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <Image src="/images/logo-sasta-plots.png" alt="" width={20} height={20} className="h-5 w-5" />
            AAM AADMI KI PASAND
          </div>
        </FadeIn>
      </div>
    </section>
  )
}