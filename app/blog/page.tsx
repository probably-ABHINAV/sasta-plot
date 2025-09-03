
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  published: boolean
  created_at: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="font-heading text-3xl font-semibold md:text-4xl">Insights & Guides</h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          Buying tips, location spotlights, and legal checklists to help you make confident decisions.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Card>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-semibold md:text-4xl">Insights & Guides</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">
        Buying tips, location spotlights, and legal checklists to help you make confident decisions.
      </p>
      
      {posts.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {new Date(post.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                  </p>
                  <div className="mt-4">
                    <span className="text-sm text-primary hover:underline">
                      Read more →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          No blog posts available yet. Check back soon for updates!
        </div>
      )}
    </main>
  )
}
