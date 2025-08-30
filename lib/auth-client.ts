export const AUTH_TOKEN_KEY = "auth_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function authHeader(token?: string) {
  const t = token || getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}
