"use client"
import { useState } from "react"
import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else router.push("/")
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-12">
      <div className="flex flex-col items-center gap-4">
        <Image src="/images/logo-sasta-plots.png" alt="Sasta Plots logo" width={48} height={48} />
        <h1 className="text-2xl font-semibold text-center text-balance">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center">Login to manage your account</p>
      </div>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="rounded border px-3 py-2"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="rounded border px-3 py-2"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          disabled={loading}
          className="inline-flex items-center justify-center rounded bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        New here?{" "}
        <a className="text-brand underline" href="/auth/register">
          Create an account
        </a>
      </p>
    </main>
  )
}
