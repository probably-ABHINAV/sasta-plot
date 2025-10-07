"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const staticPosts = [
  {
    id: "1",
    title: "Why Greater Dehradun is the Smart Investment Choice in 2025",
    slug: "greater-dehradun-investment-2025",
    created_at: "2025-10-08",
    content: `
      <p>Greater Dehradun is emerging as one of the most promising real estate destinations in Uttarakhand...</p>
    `
  },
  {
    id: "2",
    title: "Common Real Estate Mistakes & How Zam’s Gardenia Solves Them",
    slug: "zams-gardenia-real-estate-mistakes",
    created_at: "2025-10-08",
    content: `
      <p>Real estate investments fail when buyers choose wrong locations, ignore legal checks...</p>
    `
  },
  {
    id: "3",
    title: "ग्रेटर देहरादून: 2025 में निवेश का सुनहरा मौका",
    slug: "greater-dehradun-hindi-2025",
    created_at: "2025-10-08",
    content: `
      <p>ग्रेटर देहरादून 2025 में रियल एस्टेट निवेश के लिए सबसे बेहतरीन स्थानों में से एक बन रहा है...</p>
    `
  },
  {
    id: "4",
    title: "रियल एस्टेट में आम गलतियाँ और ज़ैम्स गार्डेनिया का समाधान",
    slug: "zams-gardenia-hindi",
    created_at: "2025-10-08",
    content: `
      <p>रियल एस्टेट निवेशक अक्सर गलत लोकेशन चुनने और लीगल चेक न करने जैसी गलतियाँ करते हैं...</p>
    `
  }
]

export default function BlogPostPage() {
  const params = useParams()
  const { slug } = params

  const post = staticPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
          <Badge variant="secondary">
            {new Date(post.created_at).toLocaleDateString("hi-IN")}
          </Badge>
        </CardHeader>
        <CardContent>
          {/* Render raw HTML safely */}
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
    </main>
  )
}
