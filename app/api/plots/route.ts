import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  const { data: plots, error } = await supabase
    .from("plots")
    .select("id,title,location,price,size_sqyd,description,featured,plot_images(url)")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ plots: [], warning: error.message }, { status: 200 })

  const normalized = (plots || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.price,
    size_sqyd: p.size_sqyd,
    description: p.description,
    featured: p.featured,
    image: p.plot_images?.[0]?.url,
  }))

  return NextResponse.json({ plots: normalized })
}

export async function POST(request: Request) {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, location, price, size_sqyd, description, featured, imageUrl } = await request.json()

  const { data, error } = await supabase
    .from("plots")
    .insert({ title, location, price, size_sqyd, description, featured, created_by: user.id })
    .select("id")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (imageUrl) await supabase.from("plot_images").insert({ plot_id: data.id, url: imageUrl })

  return NextResponse.json({ id: data.id }, { status: 201 })
}
