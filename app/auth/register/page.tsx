"use client"

import type React from "react"
import { useState } from "react"
import { postJson } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get("name") || "")
    const email = String(fd.get("email") || "")
    const password = String(fd.get("password") || "")
    try {
      await postJson("/auth/register", { name, email, password })
      router.replace("/auth/login")
    } catch (err: any) {
      setError(err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-lg border p-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <button
          disabled={loading}
          className="w-full rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-70"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-emerald-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  )
}
