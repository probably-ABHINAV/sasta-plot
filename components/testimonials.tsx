"use client"

import { Stagger } from "@/components/animate"

export function Testimonials() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="font-heading text-pretty text-2xl font-semibold md:text-3xl">Happy Customers</h2>
        <Stagger className="mt-6 grid gap-4 md:grid-cols-3" delay={0.05}>
          {[
            { name: "Rahul & Priya", text: "Transparent process and perfect location. Registration done within days!" },
            { name: "Sanjay", text: "Got a clear-title plot with easy installment options. Highly recommended." },
            { name: "Farzana", text: "They handled documentation and site visits very professionally." },
          ].map((t) => (
            <blockquote key={t.name} className="rounded-lg border bg-card p-5 text-sm">
              “{t.text}”<footer className="mt-3 text-xs text-muted-foreground">— {t.name}</footer>
            </blockquote>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
