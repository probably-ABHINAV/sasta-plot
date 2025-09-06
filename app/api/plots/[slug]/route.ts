import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

// GET: Fetch a plot by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Try Supabase first
    const supabase = getServerSupabase();
    const { data: plot, error } = await supabase
      .from("plots")
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
        created_at,
        plot_images (
          url
        )
      `)
      .eq("slug", params.slug)
      .single();

    if (!error && plot) {
      const normalized = {
        id: plot.id.toString(),
        title: plot.title,
        location: plot.location,
        price: plot.price,
        size_sqyd: plot.size_sqyd,
        size_unit: plot.size_unit || "sq.yd",
        size: plot.size_sqyd && plot.size_unit
          ? `${plot.size_sqyd} ${plot.size_unit}`
          : "Size TBD",
        description: plot.description,
        featured: plot.featured,
        slug: plot.slug,
        image: plot.image_url,
        image_url: plot.image_url,
        created_at: plot.created_at,
        plot_images: plot.plot_images || []
      };
      return NextResponse.json({ plot: normalized });
    }

    // Fallback to file storage
    console.log('Supabase failed for plot slug, falling back to file storage:', error?.message || 'No data');
    
    try {
      const { fileStorage } = await import('@/lib/file-storage');
      const plots = fileStorage.getPlots();
      const foundPlot = plots.find(p => p.slug === params.slug);
      
      if (!foundPlot) {
        return NextResponse.json({ error: "Plot not found" }, { status: 404 });
      }

      // Normalize the plot data to match expected structure
      const normalizedPlot = {
        id: foundPlot.id.toString(),
        title: foundPlot.title || '',
        location: foundPlot.location || '',
        price: foundPlot.price || 0,
        size_sqyd: foundPlot.size_sqyd || 0,
        size_unit: foundPlot.size_unit || 'sq.yd',
        size: foundPlot.size_sqyd && foundPlot.size_unit 
          ? `${foundPlot.size_sqyd} ${foundPlot.size_unit}` 
          : 'Size TBD',
        description: foundPlot.description || '',
        featured: Boolean(foundPlot.featured),
        slug: foundPlot.slug || '',
        image: foundPlot.image || '',
        image_url: foundPlot.image || '',
        created_at: foundPlot.created_at || new Date().toISOString(),
        plot_images: foundPlot.image ? [{ url: foundPlot.image }] : []
      };

      return NextResponse.json({ plot: normalizedPlot });
    } catch (fileError) {
      console.error('File storage also failed:', fileError);
      return NextResponse.json(
        { error: 'Unable to fetch plot data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error fetching plot:", error);
    return NextResponse.json({ error: "Failed to fetch plot" }, { status: 500 });
  }
}

// PATCH: Update plot basic details and slug
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { supabase: adminSupabase } = await import("@/lib/supabase/admin");
    const { isAdminUser } = await import("@/lib/demo-auth");

    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      location,
      price,
      size_sqyd,
      size_unit,
      description,
      featured,
      image_url,
    } = body;

    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const { data: plot, error } = await adminSupabase
      .from("plots")
      .update({
        title,
        location,
        price: parseFloat(price),
        size_sqyd: parseInt(size_sqyd),
        size_unit: size_unit || "sq.yd",
        description,
        featured: Boolean(featured),
        image_url,
        slug: newSlug,
      })
      .eq("slug", params.slug)
      .select()
      .single();

    if (error) {
      console.error("Supabase plot update error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id: plot.id,
        message: "Plot updated successfully",
        slug: plot.slug,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected plot update error:", error);
    return NextResponse.json({ error: "Failed to update plot" }, { status: 500 });
  }
}

// PUT: Full update + image array + plot_images syncing
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { isAdminUser } = await import("@/lib/demo-auth");

    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      location,
      price,
      size_sqyd,
      size_unit,
      description,
      featured,
      images,
    } = body;
    const slug = params.slug;

    try {
      const { supabase: adminSupabase } = await import("@/lib/supabase/admin");

      const { data, error } = await adminSupabase
        .from("plots")
        .update({
          title,
          location,
          price: parseFloat(price),
          size_sqyd: parseInt(size_sqyd),
          size_unit: size_unit || "sq.yd",
          description,
          featured: Boolean(featured),
          image_url: images && images.length > 0 ? images[0] : null,
          images: images || [],
        })
        .eq("slug", slug)
        .select();

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      // Update plot_images table
      if (data && data.length > 0 && images && images.length > 0) {
        const plotId = data[0].id;

        await adminSupabase.from("plot_images").delete().eq("plot_id", plotId);

        const imageInserts = images.map((url: string) => ({
          plot_id: plotId,
          url: url,
        }));

        await adminSupabase.from("plot_images").insert(imageInserts);
      }

      return NextResponse.json({ success: true, plot: data[0] });
    } catch (supabaseError) {
      console.error("Supabase plot update error:", supabaseError);
      return NextResponse.json({ error: "Failed to update plot" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Unexpected API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete plot from Supabase or fallback to file storage
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { isAdminUser } = await import("@/lib/demo-auth");

    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slug = params.slug;

    try {
      const { supabase: adminSupabase } = await import("@/lib/supabase/admin");

      const { error } = await adminSupabase
        .from("plots")
        .delete()
        .eq("slug", slug);

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      return NextResponse.json({ success: true });
    } catch (supabaseError) {
      console.error("Supabase plot delete error:", supabaseError);

      // Fallback to file storage (optional)
      try {
        const { fileStorage } = await import("@/lib/file-storage");
        const success = fileStorage.deletePlot(slug);

        if (!success) {
          return NextResponse.json({ error: "Plot not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
      } catch (fallbackError) {
        console.error("File storage delete failed:", fallbackError);
        return NextResponse.json({ error: "Failed to delete plot" }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error("Unexpected delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
