
import { Metadata } from 'next'
import Image from 'next/image'
import { FadeInSection } from "@/components/animated-section"

export const metadata: Metadata = {
  title: 'About Us - Sasta Plot',
  description: 'Learn about Sasta Plot, our mission to make property ownership accessible for every Indian family, and our commitment to transparency and affordability.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <FadeInSection>
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl font-semibold md:text-4xl mb-4">About Sasta Plot</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Aam Admi Ki Pasand - Making property ownership accessible for every Indian family
          </p>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="grid gap-8 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground">
              At Sasta Plot, we believe that every family deserves the opportunity to own their piece of land. 
              We're committed to breaking down the barriers that make property investment seem impossible for the common man.
            </p>
            <p className="text-muted-foreground">
              Our platform connects you with verified, affordable plots in prime locations across India, 
              with transparent pricing and flexible payment options that work for your budget.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border">
            <Image
              src="/images/plots/plot-1.png"
              alt="Beautiful residential plots"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="bg-muted/50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose Sasta Plot?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Verified Properties</h3>
              <p className="text-sm text-muted-foreground">
                Every plot is thoroughly verified with clear documentation and legal compliance.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold">Transparent Pricing</h3>
              <p className="text-sm text-muted-foreground">
                No hidden costs, no surprise fees. What you see is what you pay.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Flexible Payment</h3>
              <p className="text-sm text-muted-foreground">
                Easy EMI options and flexible payment plans to suit your financial situation.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="overflow-hidden rounded-lg border order-2 md:order-1">
            <Image
              src="/images/plots/plot-3.png"
              alt="Our team helping families"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-2xl font-semibold">Our Commitment</h2>
            <p className="text-muted-foreground">
              We understand that buying land is one of the biggest decisions in your life. 
              That's why we're committed to providing end-to-end support throughout your journey.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free site visits and expert guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Complete legal documentation assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Post-purchase support and guidance</span>
              </li>
            </ul>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="text-center mt-16 p-8 bg-primary/5 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Ready to Find Your Plot?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of families who have found their dream plots with Sasta Plot. 
            Let us help you take the first step towards property ownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/plots"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse Available Plots
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </FadeInSection>
    </main>
  )
}
