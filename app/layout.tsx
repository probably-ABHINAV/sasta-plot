import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Property in Uttrakhand - Premium Hill Station Land Plots | 2025",
  description:
    "Leading property developer offering premium land plots in Uttrakhand's pristine hill stations. RERA approved, legal clarity guaranteed, prime locations with exceptional ROI. Mussoorie, Rishikesh, Nainital, Dehradun plots available.",
  keywords:
    "Uttrakhand plots 2025, RERA approved plots, hill station land investment, Mussoorie plots, Rishikesh land, Nainital property, Dehradun plots, mountain view plots, legal property Uttrakhand, hill station investment",
  authors: [{ name: "Property in Uttrakhand" }],
  creator: "Property in Uttrakhand",
  publisher: "Property in Uttrakhand",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Property in Uttrakhand - Premium Hill Station Land Plots | 2025",
    description:
      "Leading property developer in Uttrakhand offering RERA approved plots with guaranteed legal clarity and exceptional growth potential in prime hill station locations.",
    type: "website",
    locale: "en_IN",
    url: "https://propertyinuttrakhand.com",
    siteName: "Property in Uttrakhand",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property in Uttrakhand - Premium Hill Station Land Plots",
    description: "RERA approved plots in Uttrakhand's beautiful hill stations with guaranteed legal clarity.",
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://propertyinuttrakhand.com",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${montserrat.variable} ${openSans.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  )
}
