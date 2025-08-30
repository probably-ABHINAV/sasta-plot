"use client"

import { useSearchParams } from "next/navigation"
import { useApi } from "@/lib/api"
import type { ApiListResponse, Plot } from "@/types"
import { PaginationControls } from "./pagination-controls"

export function PlotsPagination({ queryKey }: { queryKey: string }) {
  const sp = useSearchParams()
  const page = Number(sp.get("page") || "1")
  const limit = Number(sp.get("limit") || "24")

  const { data } = useApi<ApiListResponse<Plot>>(queryKey)
  const total = data?.total ?? 0
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1

  if (!total || totalPages <= 1) return null

  return <PaginationControls page={page} totalPages={totalPages} />
}
