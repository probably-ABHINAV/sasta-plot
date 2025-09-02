
"use client"

import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import AuthLinks from "./auth-links"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label="Sasta Plots home">
          <img src="/images/logo-sasta-plots.png" alt="Sasta Plots logo" className="h-9 w-auto" />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-semibold tracking-tight text-foreground">Sasta Plots</span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-primary">Aam Admi Ki Pasand</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/plots" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
            Plots
          </Link>
          <Link href="/about" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/blog" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link href="/contact" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
            Contact
          </Link>
          <AuthLinks />
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border px-2.5 py-2 text-sm md:hidden"
          aria-label="Open menu"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d={open ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="md:hidden border-t bg-background"
            onClick={() => setOpen(false)}
            initial={{ height: 0, opacity: 0, y: -8 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
              <li>
                <Link href="/" className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/plots" className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  Plots
                </Link>
              </li>
              <li>
                <Link href="/about" className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  Contact
                </Link>
              </li>
            </ul>
            <div className="mx-auto max-w-6xl px-4 pb-3">
              <AuthLinks mobile />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
