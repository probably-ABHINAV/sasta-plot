import { getServerSupabase } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} | Blog` }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = getServerSupabase()
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", params.slug).single()
  if (!data || data.published !== true) return notFound()
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 prose">
      <h1 className="text-balance">{data.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: data.content || "" }} />
    </main>
  )
}
