import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const supabase = getServerSupabase();
    const { data: plot, error } = await supabase
      .from("plots")
      .select("*")
      .eq("slug", params.slug)
      .single();

    if (error) {
      console.error("Error fetching plot:", error);
      return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    }

    const normalized = {
      id: plot.id.toString(),
      title: plot.title,
      location: plot.location,
      price: plot.price,
      size_sqyd: plot.size_sqyd,
      size_unit: plot.size_unit || "sq.yd",
      size:
        plot.size_sqyd && plot.size_unit
          ? `${plot.size_sqyd} ${plot.size_unit}`
          : "Size TBD",
      description: plot.description,
      featured: plot.featured,
      slug: plot.slug,
      image: plot.image_url,
      image_url: plot.image_url,
      created_at: plot.created_at,
    };

    return NextResponse.json({ plot: normalized });
  } catch (error) {
    console.error("Error fetching plot:", error);
    return NextResponse.json(
      { error: "Failed to fetch plot" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { supabase: adminSupabase } = await import("@/lib/supabase/admin");
    const { isAdminUser } = await import("@/lib/demo-auth");

    // Check demo authentication for admin access
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
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

    // Generate new slug if title changed
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Use admin client to bypass RLS issues
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
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        id: plot.id,
        message: "Plot updated successfully",
        slug: plot.slug,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unexpected plot update error:", error);
    return NextResponse.json(
      { error: "Failed to update plot" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { supabase: adminSupabase } = await import("@/lib/supabase/admin");
    const { isAdminUser } = await import("@/lib/demo-auth");

    // Check demo authentication for admin access
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    // Use admin client to bypass RLS issues
    const { error } = await adminSupabase
      .from("plots")
      .delete()
      .eq("slug", params.slug);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete plot" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Plot deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete plot" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const { isAdminUser } = await import("@/lib/demo-auth");

    // Check demo authentication for admin access
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
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
      // Try Supabase first
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

        // Delete existing images
        await adminSupabase.from("plot_images").delete().eq("plot_id", plotId);

        // Insert new images
        const imageInserts = images.map((url: string) => ({
          plot_id: plotId,
          url: url,
        }));

        await adminSupabase.from("plot_images").insert(imageInserts);
      }

      return NextResponse.json({ success: true, plot: data[0] });
    } catch (supabaseError) {
      console.error("Supabase plot update error:", supabaseError);
      return NextResponse.json(
        { error: "Failed to update plot" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Unexpected API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } },
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

      // Fallback to file storage
      try {
        const { fileStorage } = await import("@/lib/file-storage");
        const success = fileStorage.deletePlot(slug);

        if (!success) {
          return NextResponse.json(
            { error: "Plot not found" },
            { status: 404 },
          );
        }

        return NextResponse.json({ success: true });
      } catch (fallbackError) {
        console.error("File storage delete failed:", fallbackError);
        return NextResponse.json(
          { error: "Failed to delete plot" },
          { status: 500 },
        );
      }
    }
  } catch (error: any) {
    console.error("Unexpected delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
