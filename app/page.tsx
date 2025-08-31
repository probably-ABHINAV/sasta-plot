import { Hero } from "@/components/hero"
import { FeatureCards } from "@/components/feature-cards"
import { PlotsGrid } from "@/components/plots-grid"
import { Testimonials } from "@/components/testimonials"
import { CtaBanner } from "@/components/cta-banner"
import { InquiryForm } from "@/components/inquiry-form"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <PlotsGrid />
      <Testimonials />
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <InquiryForm />
      </section>
      <CtaBanner />
    </main>
  )
}
