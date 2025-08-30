import type { MetadataRoute } from "next"

type Plot = {
  _id: string
  listedDate?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const backend = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

  const urls: MetadataRoute.Sitemap = [
    { url: `${site}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/plots`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ]

  // Try to include dynamic plot detail pages
  try {
    const res = await fetch(`${backend}/plots`, { cache: "no-store" })
    if (res.ok) {
      const json = await res.json()
      const items: Plot[] = json?.data || []
      for (const p of items) {
        urls.push({
          url: `${site}/plots/${p._id}`,
          changeFrequency: "weekly",
          priority: 0.8,
          lastModified: p.listedDate ? new Date(p.listedDate) : undefined,
        })
      }
    }
  } catch {
    // ignore fetch errors; static pages will still be listed
  }

  return urls
}
