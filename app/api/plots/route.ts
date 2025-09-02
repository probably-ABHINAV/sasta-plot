import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/file-storage"

export async function GET() {
  try {
    const plots = fileStorage.getPlots()

    const normalized = plots.map((p) => ({
      id: p.id,
      title: p.title,
      location: p.location,
      price: p.price ? `₹${Number(p.price).toLocaleString()}` : 'Price on request',
      size: p.size_sqyd ? `${p.size_sqyd} sq.yd` : 'Size TBD',
      description: p.description,
      featured: p.featured,
      slug: p.slug,
      image: p.image,
    }))

    return NextResponse.json({ plots: normalized })
  } catch (error) {
    console.error("Error fetching plots:", error)
    return NextResponse.json({ plots: [] }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, location, price, size_sqyd, description, featured, imageUrl } = await request.json()

    // Generate slug from title
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }

    const slug = generateSlug(title)

    const plot = fileStorage.createPlot({
      title,
      location,
      price,
      size_sqyd,
      description,
      featured,
      slug,
      image: imageUrl,
    })

    return NextResponse.json({ id: plot.id }, { status: 201 })
  } catch (error) {
    console.error("Plot creation error:", error)
    return NextResponse.json({ error: "Failed to create plot" }, { status: 500 })
  }
}
