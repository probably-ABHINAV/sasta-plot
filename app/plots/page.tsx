import { Suspense } from "react"
import { PlotCard } from "@/components/plot-card"
import { PlotFilters } from "@/components/plot-filters"
import { useApi } from "@/lib/api"
import type { ApiListResponse, Plot } from "@/types"
import { PlotsPagination } from "@/components/plots-pagination"

function ListingGrid({ queryKey }: { queryKey: string }) {
  const { data, isLoading } = useApi<ApiListResponse<Plot>>(queryKey)
  if (isLoading) return <p className="text-muted-foreground">Loading...</p>
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data?.data?.map((p) => (
        <PlotCard key={p._id} plot={p} />
      ))}
    </div>
  )
}

export default function PlotsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const params = new URLSearchParams(searchParams as any)
  if (!params.get("limit")) params.set("limit", "24")
  const queryKey = `/plots?${params.toString()}`
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Available Plots</h1>
      <PlotFilters />
      <div className="mt-6">
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <ListingGrid queryKey={queryKey} />
        </Suspense>
        <PlotsPagination queryKey={queryKey} />
      </div>
    </main>
  )
}
