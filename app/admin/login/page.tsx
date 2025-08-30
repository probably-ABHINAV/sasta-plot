"use client"

import type React from "react"
import { setAdminToken } from "@/lib/admin-auth-client"
import { useState } from "react"
import { postJson } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") || "")
    const password = String(fd.get("password") || "")
    try {
      const res = await postJson<{ token: string }>("/auth/login", { email, password })
      setAdminToken(res.token)
      router.push("/admin")
    } catch (err: any) {
      setError(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-lg border p-4">
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  )
}
