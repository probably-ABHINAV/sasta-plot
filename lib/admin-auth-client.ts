export const ADMIN_AUTH_TOKEN_KEY = "admin_token"

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(ADMIN_AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token)
}

export function clearAdminToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY)
}
