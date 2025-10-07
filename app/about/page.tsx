

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
          <h1 className="font-heading text-3xl font-semibold md:text-4xl mb-4">About Us – Affordable Plots</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Aam Aadmi Ki Pasand – Affordable plots designed for modern families, with clear titles, great connectivity, and flexible payments.
          </p>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="grid gap-8 md:grid-cols-2 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Welcome to Sasta Plots</h2>
            <p className="text-muted-foreground">
             Sasta Plots was created with a single, clear purpose: to make land ownership reliable, accessible, and affordable for everyone. Real estate is one of the most powerful ways to build long-term wealth, but it can be confusing and risky- especially for first-time buyers. We started Sasta Plots to change that.
We are a team of property professionals, legal advisors, and local area specialists who scout, verify, and list only those plots that meet strict quality and legal standards. Our buying process removes the common pain points: unclear titles, hidden fees, and poor infrastructure. Every plot that appears on our platform has been vetted for clear ownership papers, verified boundaries, and basic infrastructure readiness.
Our process is simple and buyer-first. We source plots in high-potential and up-and-coming pockets, negotiate pricing with developers and owners, and run thorough legal and technical checks. When we list a property, our documents are verified and our team is available for site inspections. We walk with you from the first enquiry all the way through registration and handover.

            </p>
            <p className="text-muted-foreground">
           At Sasta Plots, land ownership is not just a transaction- it’s a step toward financial security and a better future. Whether you want to buy to build, invest, or hold, we’re here to make the journey transparent, simple, and rewarding.
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
          <h2 className="text-2xl font-semibold mb-6 text-center">Our Values</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transparency: Accurate listings and clear pricing- what you see is what you pay. We never hide charges or attach surprise fees during the purchase process
          </p>
              <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Integrity: We verify legal titles and public records before listing any plot. Our legal partners conduct title searches and ensure transferability.
          </p>
              <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Affordability: We negotiate aggressively and optimize costs so we can offer plots at attractive price points without compromising quality or compliance.
          </p>
              <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
            Support: Buying land is a big decision. Our team offers site visits, documentation assistance, and post-sale support so you move from ownership to development smoothly.
          </p>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Our Identity</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center space-y-3 p-6 bg-card rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                No hidden charges, no false promises. Complete transparency in every transaction.
              </p>
            </div>
            <div className="text-center space-y-3 p-6 bg-card rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Verified Plots</h3>
              <p className="text-sm text-muted-foreground">
                Every property is legally vetted and tested with clean documentation.
              </p>
            </div>
            <div className="text-center space-y-3 p-6 bg-card rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold">Customer Support</h3>
              <p className="text-sm text-muted-foreground">
                From site visits to legal help, we're there for you every step of the way.
              </p>
            </div>
            <div className="text-center space-y-3 p-6 bg-card rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold">Flexible Payouts</h3>
              <p className="text-sm text-muted-foreground">
                Easy installments so that budget doesn't become a constraint.
              </p>
            </div>
            <div className="text-center space-y-3 p-6 bg-card rounded-lg border md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Trusting Relationships</h3>
              <p className="text-sm text-muted-foreground">
                For us, customers are not just buyers, but long-term partners.
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="grid gap-8 md:grid-cols-2 items-center mb-16">
          <div className="overflow-hidden rounded-lg border order-2 md:order-1">
            <Image
              src="/images/plots/plot-3.png"
              alt="Our commitment to families"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-2xl font-semibold">Why Choose Sasta Plots?</h2>
            <p className="text-muted-foreground">
              Every listing is accompanied by a clear documentation pack and an option for a free site visit. Our local teams coordinate with municipal bodies, utility providers, and legal firms so the purchase you make is safe, documented, and ready for the next steps.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Clean titles and verified documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Great connectivity and future-ready locations</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Budget-friendly prices within your reach</span>
              </li>
            </ul>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="bg-primary/5 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-center">A future-focused approach</h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
           We identify locations with strong growth potential based on infrastructure projects, transport improvements, and urban expansion trends. Our goal is to help buyers obtain plots that balance immediate affordability with long-term value appreciation.

          </p>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className="text-center mt-16 p-8 bg-primary/5 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">📞 Join us today and achieve your dream plot with ease</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Ready to take the first step towards owning your plot? Contact us today and let us help you 
            find the perfect piece of land for your future.
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
