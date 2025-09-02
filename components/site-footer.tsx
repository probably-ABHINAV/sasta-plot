import Image from "next/image"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-sasta-plots.png" alt="Sasta Plots logo" width={28} height={28} />
            <span className="font-semibold">Sasta Plots</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Affordable, verified plots with transparent process and support.
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/plots" className="hover:underline">
                Featured Plots
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/#why" className="hover:underline">
                Why Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium">Reach Us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Email: admin@sastaplots.com</li>
            <li>Phone: 7870231314</li>
            <li>Mon–Sat, 9:30 AM–6:30 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sasta Plots. All rights reserved.
      </div>
    </footer>
  )
}
