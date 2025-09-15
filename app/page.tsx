
import { Metadata } from 'next'
import { HomeEnhanced } from "@/components/home-enhanced"

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
  return <HomeEnhanced />
}
