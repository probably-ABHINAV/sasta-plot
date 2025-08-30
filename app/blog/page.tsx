"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation" // read page/limit from URL
import { useApi } from "@/lib/api"
import type { ApiListResponse, BlogPost } from "@/types"
import { PaginationControls } from "@/components/pagination-controls" // add pagination controls

export default function BlogPage() {
  const sp = useSearchParams()
  const page = Number(sp.get("page") || "1")
  const limit = Number(sp.get("limit") || "20")

  const { data, isLoading } = useApi<ApiListResponse<BlogPost>>(`/blog?limit=${limit}&page=${page}`)

  const total = data?.total ?? 0
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <p className="mt-2 text-muted-foreground">Tips, legal info, and news about plot investments.</p>
      {isLoading ? (
        <p className="mt-6 text-muted-foreground">Loading...</p>
      ) : (
        <>
          <div className="mt-6 space-y-6">
            {data?.data?.map((p) => (
              <article key={p._id} className="rounded-lg border p-4">
                <h2 className="text-xl font-semibold">
                  <Link href={`/blog/${p.slug}`} className="hover:underline">
                    {p.title}
                  </Link>
                </h2>
                {p.excerpt && <p className="mt-1 text-muted-foreground">{p.excerpt}</p>}
              </article>
            ))}
          </div>
          {totalPages > 1 && (
            <PaginationControls className="mt-8" page={page} totalPages={totalPages} basePath="/blog" />
          )}
        </>
      )}
    </main>
  )
}
