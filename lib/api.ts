import useSWR from "swr"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

export const fetcher = async (url: string, token?: string) => {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

function getBaseUrl() {
  // Server: no window
  // Client: window exists
  const isServer = typeof window === "undefined"
  const serverBase = process.env.BACKEND_URL
  const clientBase = process.env.NEXT_PUBLIC_BACKEND_URL

  if (isServer) {
    return serverBase || clientBase || "http://localhost:4000"
  }
  return clientBase || serverBase || "http://localhost:4000"
}

export function buildApiUrl(path: string) {
  const base = getBaseUrl()
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalized}`
}

export function useApi<T = any>(path: string, token?: string) {
  const url = buildApiUrl(path)
  const { data, error, isLoading, mutate } = useSWR<T>(url, (u) => fetcher(u, token))
  return { data, error, isLoading, mutate }
}

export async function postJson<T = any>(path: string, body: any, token?: string) {
  const res = await fetch(buildApiUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Request failed")
  }
  return res.json() as Promise<T>
}

export async function getJson<T = any>(path: string, token?: string) {
  const res = await fetch(buildApiUrl(path), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `GET failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}
