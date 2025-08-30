"use client"

import { AdminBlogForm } from "@/components/admin-blog-form"
import { useParams } from "next/navigation"

export default function AdminEditBlogPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Edit Blog Post</h1>
      <div className="mt-4">{id ? <AdminBlogForm mode="edit" postId={id} /> : <p>Invalid post ID.</p>}</div>
    </main>
  )
}
