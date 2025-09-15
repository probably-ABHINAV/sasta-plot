
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const closeSheet = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={closeSheet}
            >
              Home
            </Link>
            <Link
              href="/plots"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={closeSheet}
            >
              Our Plots
            </Link>
            <Link
              href="/investment"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={closeSheet}
            >
              Why Invest
            </Link>
            <Link
              href="/calculator"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={closeSheet}
            >
              Calculator
            </Link>
            <Link
              href="/locations"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={closeSheet}
            >
              Locations
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={closeSheet}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={closeSheet}
            >
              Contact
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
