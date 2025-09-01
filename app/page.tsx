import { Hero } from "@/components/hero"
import { FeatureCards } from "@/components/feature-cards"
import { PlotsGrid } from "@/components/plots-grid"
import { Testimonials } from "@/components/testimonials"
import { CtaBanner } from "@/components/cta-banner"
import { InquiryForm } from "@/components/inquiry-form"
import { FadeInSection } from "@/components/animated-section" // add animated wrappers

export default function HomePage() {
  return (
    <main>
      <FadeInSection as="section">
        <Hero />
      </FadeInSection>

      <FadeInSection as="section">
        <FeatureCards />
      </FadeInSection>

      <FadeInSection as="section">
        <PlotsGrid />
      </FadeInSection>

      <FadeInSection as="section">
        <Testimonials />
      </FadeInSection>

      <FadeInSection as="section" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div id="contact" className="sr-only">
          Contact form
        </div>
        <InquiryForm />
      </FadeInSection>

      <FadeInSection as="section">
        <CtaBanner />
      </FadeInSection>
    </main>
  )
}
