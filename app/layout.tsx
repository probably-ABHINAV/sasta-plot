import "./globals.css";
import type React from "react";
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Montserrat, Open_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";
import { MotionProvider } from "@/components/motion-provider";

// Base font for body
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Secondary fonts
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  fallback: ["system-ui", "arial"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Sasta Plots — Aam Admi Ki Pasand",
  description:
    "Affordable, trusted residential plots with clear approvals. Browse by location, price, and size, and contact us directly.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${montserrat.variable} ${openSans.variable} ${GeistMono.variable}`}
    >
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <MotionProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </MotionProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
