import { getServerSupabase } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: `${params.slug} | Blog` }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  let blogData = null
  
  // Decode the URL-encoded slug
  const decodedSlug = decodeURIComponent(params.slug)

  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase.from("posts").select("*").eq("slug", decodedSlug).single()
    
    if (!error && data && data.published === true) {
      blogData = data
    } else {
      console.log('Supabase failed for blog slug, falling back to file storage:', error?.message || 'No data')
      
      try {
        const { fileStorage } = await import('@/lib/file-storage')
        const posts = fileStorage.getBlogPosts()
        
        // Try to find post by slug first, then by title if that fails
        let foundPost = posts.find(p => p.slug === decodedSlug && p.published)
        
        if (!foundPost) {
          // If slug doesn't match, try matching by title (for backwards compatibility)
          foundPost = posts.find(p => p.title === decodedSlug && p.published)
        }
        
        if (foundPost) {
          blogData = foundPost
        }
      } catch (fileError) {
        console.error('File storage also failed:', fileError)
      }
    }

    if (!blogData) {
      console.log('No blog post found for slug:', decodedSlug)
      return notFound()
    }

    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blogData.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary">
                {new Date(blogData.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Badge>
              {blogData.author && <span>By {blogData.author}</span>}
            </div>
          </div>
          <div className="prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: blogData.content || "" }} />
          </div>
        </article>
      </main>
    )
  } catch (error) {
    console.error("Blog post error:", error)
    return notFound()
  }
}
