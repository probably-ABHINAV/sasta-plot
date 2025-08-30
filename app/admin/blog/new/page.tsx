"use client"

import { AdminBlogForm } from "@/components/admin-blog-form"

export default function AdminNewBlogPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">New Blog Post</h1>
      <div className="mt-4">
        <AdminBlogForm mode="create" />
      </div>
    </main>
  )
}
