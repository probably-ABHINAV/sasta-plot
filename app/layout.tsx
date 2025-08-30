import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prime Plots in Coimbatore",
    template: "%s | Prime Plots in Coimbatore",
  },
  description:
    "Discover verified residential plots in and around Coimbatore. Transparent pricing, approvals, and sizes with quick enquiry.",
  keywords: ["plots", "real estate", "residential plots", "Coimbatore", "DTCP", "land for sale"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Prime Plots in Coimbatore",
    description: "Discover verified residential plots in and around Coimbatore. Transparent pricing and quick enquiry.",
    images: [
      {
        url: "/open-graph-image-for-plots-website.png",
        width: 1200,
        height: 630,
        alt: "Plots website preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Plots in Coimbatore",
    description: "Discover verified residential plots in and around Coimbatore. Transparent pricing and quick enquiry.",
    images: ["/twitter-card-image-for-plots-website.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 rounded bg-primary px-3 py-2 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>

        <Suspense fallback={null}>
          <main id="main-content" tabIndex={-1} className="min-h-screen">
            {children}
          </main>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
