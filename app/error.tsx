"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-lg px-4 py-16">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">An unexpected error occurred. You can try again.</p>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="outline" onClick={() => reset()}>
              Try again
            </Button>
            <a href="/" className="rounded-md border px-3 py-2 text-sm hover:bg-accent/50">
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}
