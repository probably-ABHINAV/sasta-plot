import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export const metadata = { 
  title: "Plots - Sasta Plots"
}

  { 
    href: "/plots/bajrang-vatika", 
    title: "Bajrang Vatika - The Private Retreat", 
    location: "Dehradun",
    desc: "Plot sizes: 1200–2400 sq.yd • Price: ₹16,800 Per sq/yd onwards • Ready-to-develop",
    image: "/images/gallery/C_1760476152261.jpg"
  }, 
  { 
    href: "/plots/friends-colony-phase-1", 
    title: "Friends Colony Phase-1", 
    location: "Dehradun",
    desc: "Plot sizes: 1000–2000 sq.yd • Price: ₹16,800 Per sq/yd onwards • Construction-ready",
    image: "/images/gallery/WhatsApp Image 2025-10-13 at 23.57.02_e87110ff.jpg"
  }, 
  { 
    href: "/plots/zams-gardenia", 
    title: "Zams Gardenia", 
    location: "Bihta – Greater Patna Corridor",
    desc: "Plot sizes: 700–2000 sq.ft • Price: ₹16,500 Per sq/ft onwards • Planned & developing",
    image: "/images/plots/plot-1.png"
  }
]

export default function Page() { 
  return ( 
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Available Plots
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Discover our handpicked selection of premium plots in prime locations
        </p>
      </div>

      {/* Plots Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {PLOTS.map((plot) => ( 
          <Link href={plot.href} key={plot.href}>
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={plot.image}
                  alt={plot.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{plot.title}</h3>
                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{plot.location}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {plot.desc}
                </p>
                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-600 text-white h-9 px-4 w-full">
                  View Details →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main> 
  )
}
