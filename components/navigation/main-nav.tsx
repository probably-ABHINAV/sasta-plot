
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav className={`hidden md:flex items-center gap-6 ${className}`}>
      <Link href="/plots" className="text-foreground hover:text-primary transition-colors font-medium text-sm">
        Our Plots
      </Link>
      <Link
        href="/locations"
        className="text-foreground hover:text-primary transition-colors font-medium text-sm"
      >
        Locations
      </Link>
      <Link
        href="/investment"
        className="text-foreground hover:text-primary transition-colors font-medium text-sm"
      >
        Why Invest
      </Link>
      <Link href="/calculator" className="text-foreground hover:text-primary transition-colors font-medium text-sm">
        Calculator
      </Link>
      <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium text-sm">
        About Us
      </Link>
      <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium text-sm">
        Contact
      </Link>
    </nav>
  )
}
