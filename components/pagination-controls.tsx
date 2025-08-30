"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PaginationControls({
  page,
  totalPages,
  className,
  basePath = "/plots", // added basePath with default for backward compatibility
}: {
  page: number
  totalPages: number
  className?: string
  basePath?: string // new prop for route base
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updatePage(nextPage: number) {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set("page", String(nextPage))
    router.push(`${basePath}?${sp.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className={cn("mt-6 flex items-center justify-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={() => updatePage(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">{`Page ${page} of ${totalPages}`}</span>
      <Button
        type="button"
        variant="outline"
        onClick={() => updatePage(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </Button>
    </div>
  )
}
