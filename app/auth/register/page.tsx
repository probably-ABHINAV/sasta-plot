"use client"
import { useState } from "react"
import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export default function RegisterPage() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await signUp(email, password)
    if (error) setStatus(error.message)
    else setStatus("Check your email to confirm registration.")
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-12">
      <div className="flex flex-col items-center gap-4">
        <Image src="/images/logo-sasta-plots.png" alt="Sasta Plots logo" width={48} height={48} />
        <h1 className="text-2xl font-semibold text-center">Create your account</h1>
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
        <button className="rounded bg-brand px-4 py-2 font-medium text-white hover:bg-brand-600 transition-colors">
          Sign up
        </button>
      </form>
      {status && <p className="mt-4 text-sm text-center">{status}</p>}
    </main>
  )
}
