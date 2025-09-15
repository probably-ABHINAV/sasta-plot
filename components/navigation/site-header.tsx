
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "./main-nav"
import { MobileNav } from "./mobile-nav"

export function SiteHeader() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex-shrink-0">
            <Image
              src="/images/mascot-logo.png"
              alt="Property in Uttrakhand Mascot"
              width={56}
              height={56}
              className="w-full h-full object-contain rounded-lg"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg text-foreground leading-tight">Property in Uttrakhand</h1>
          </div>
        </Link>
        
        <MainNav />
        
        <div className="flex items-center gap-3">
          <Button 
            className="bg-primary hover:bg-primary/90 shadow-lg text-sm px-4 py-2 hidden sm:inline-flex"
            onClick={() => window.open('tel:+917870231314', '_self')}
          >
            📞 Call Now
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
