import { Metadata } from 'next'
import { Hero } from "@/components/hero"
import { FeatureCards } from "@/components/feature-cards"
import { PlotsGrid } from "@/components/plots-grid"
import { Testimonials } from "@/components/testimonials"
import { CtaBanner } from "@/components/cta-banner"
import { InquiryForm } from "@/components/inquiry-form"
import { FadeInSection } from "@/components/animated-section"

export const metadata: Metadata = {
  title: 'Sasta Plot - Affordable Plots in Your Area',
  description: 'Find affordable residential and commercial plots in prime locations. Browse our selection of verified properties with clear titles.',
  keywords: ['plots', 'real estate', 'property', 'land', 'affordable plots'],
  openGraph: {
    title: 'Sasta Plot - Affordable Plots in Your Area',
    description: 'Find affordable residential and commercial plots in prime locations',
    type: 'website',
  }
}

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <FadeInSection as="div" role="region" aria-label="Hero section">
        <Hero />
      </FadeInSection>

      <FadeInSection as="div" role="region" aria-label="Features">
        <FeatureCards />
      </FadeInSection>

      <FadeInSection as="div" role="region" aria-label="Available plots">
        <PlotsGrid />
      </FadeInSection>

      <FadeInSection as="div" role="region" aria-label="Testimonials">
        <Testimonials />
      </FadeInSection>

      <FadeInSection 
        as="div" 
        role="region" 
        aria-labelledby="contact" 
        className="mx-auto max-w-6xl px-4 py-12 md:py-16"
      >
        <h2 id="contact" className="sr-only">Contact form</h2>
        <InquiryForm />
      </FadeInSection>

      <FadeInSection as="div" role="region" aria-label="Call to action">
        <CtaBanner />
      </FadeInSection>
    </main>
  )
}