import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  try {
    const { supabase: adminSupabase } = await import('@/lib/supabase/admin')

    // Try Supabase first
    const { data: plots, error } = await adminSupabase
      .from('plots')
      .select(`
        id,
        title,
        location,
        price,
        size_sqyd,
        size_unit,
        description,
        featured,
        slug,
        image_url,
        images,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Supabase error fetching plots:", error)
      
      // Fallback to file storage if Supabase fails
      try {
        const { fileStorage } = await import('@/lib/file-storage')
        const filePlots = fileStorage.getPlots()
        const normalized = filePlots.map((p) => ({
          id: p.id.toString(),
          title: p.title || '',
          location: p.location || '',
          price: p.price || 0,
          size_sqyd: p.size_sqyd || 0,
          size_unit: p.size_unit || 'sq.yd',
          size: p.size_sqyd && p.size_unit ? `${p.size_sqyd} ${p.size_unit}` : 'Size TBD',
          description: p.description || '',
          featured: Boolean(p.featured),
          slug: p.slug || '',
          image: p.image || '',
          image_url: p.image || '',
          images: [],
          created_at: p.created_at || new Date().toISOString()
        }))
        return NextResponse.json({ plots: normalized })
      } catch (fallbackError) {
        console.error("File storage fallback failed:", fallbackError)
        return NextResponse.json({ plots: [], error: error.message }, { status: 500 })
      }
    }

    if (!plots) {
      return NextResponse.json({ plots: [] }, { status: 200 })
    }

    const normalized = plots.map((p) => ({
      id: p.id.toString(),
      title: p.title || '',
      location: p.location || '',
      price: p.price || 0,
      size_sqyd: p.size_sqyd || 0,
      size_unit: p.size_unit || 'sq.yd',
      size: p.size_sqyd && p.size_unit ? `${p.size_sqyd} ${p.size_unit}` : 'Size TBD',
      description: p.description || '',
      featured: Boolean(p.featured),
      slug: p.slug || '',
      image: (p.images && p.images.length > 0) ? p.images[0] : (p.image_url || ''),
      image_url: (p.images && p.images.length > 0) ? p.images[0] : (p.image_url || ''),
      images: Array.isArray(p.images) ? p.images : [],
      created_at: p.created_at || new Date().toISOString()
    }))

    return NextResponse.json({ plots: normalized })
  } catch (error) {
    console.error("Unexpected error fetching plots:", error)
    
    // Final fallback to file storage
    try {
      const { fileStorage } = await import('@/lib/file-storage')
      const filePlots = fileStorage.getPlots()
      const normalized = filePlots.map((p) => ({
        id: p.id.toString(),
        title: p.title || '',
        location: p.location || '',
        price: p.price || 0,
        size_sqyd: p.size_sqyd || 0,
        size_unit: p.size_unit || 'sq.yd',
        size: p.size_sqyd && p.size_unit ? `${p.size_sqyd} ${p.size_unit}` : 'Size TBD',
        description: p.description || '',
        featured: Boolean(p.featured),
        slug: p.slug || '',
        image: p.image || '',
        image_url: p.image || '',
        images: [],
        created_at: p.created_at || new Date().toISOString()
      }))
      return NextResponse.json({ plots: normalized })
    } catch (fallbackError) {
      console.error("Final fallback failed:", fallbackError)
      return NextResponse.json({
        plots: [],
        error: "Failed to fetch plots"
      }, { status: 500 })
    }
  }
}

export async function POST(request: Request) {
  try {
    const { isAdminUser } = await import('@/lib/demo-auth')

    // Check demo authentication for admin access
    const isAdmin = await isAdminUser()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const body = await request.json()
    const { title, location, price, size_sqyd, size_unit, description, featured, image_url, imageUrl, images } = body
    const finalImageUrl = image_url || imageUrl // Handle both parameter names
    const imageList = images && Array.isArray(images) ? images : []

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    try {
      // Try Supabase first
      const { supabase: adminSupabase } = await import('@/lib/supabase/admin')
      
      const { data, error } = await adminSupabase
        .from('plots')
        .insert([
          {
            title,
            location,
            price: parseFloat(price),
            size_sqyd: parseInt(size_sqyd),
            size_unit: size_unit || 'sq.yd',
            description,
            featured: Boolean(featured),
            image_url: finalImageUrl,
            images: imageList,
            slug,
            created_by: null, // Using demo mode
          },
        ])
        .select()

      if (!error && data && data.length > 0 && imageList.length > 0) {
        // Also insert into plot_images table for compatibility
        const plotId = data[0].id
        const imageInserts = imageList.map(url => ({
          plot_id: plotId,
          url: url
        }))
        
        await adminSupabase
          .from('plot_images')
          .insert(imageInserts)
      }

      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      return NextResponse.json({ success: true, plot: data[0] })
    } catch (supabaseError) {
      console.error('Supabase plot creation error:', supabaseError)
      
      // Fallback to file storage
      try {
        const { fileStorage } = await import('@/lib/file-storage')
        
        const plotData = {
          title,
          location,
          price: parseFloat(price),
          size_sqyd: parseInt(size_sqyd),
          size_unit: size_unit || 'sq.yd',
          description,
          featured: Boolean(featured),
          slug,
          image: finalImageUrl, // Use 'image' for file storage compatibility
        }
        
        const newPlot = fileStorage.createPlot(plotData)
        
        return NextResponse.json({ success: true, plot: newPlot })
      } catch (fallbackError) {
        console.error('File storage fallback failed:', fallbackError)
        return NextResponse.json({ error: 'Failed to create plot' }, { status: 500 })
      }
    }
  } catch (error: any) {
    console.error('Unexpected API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}