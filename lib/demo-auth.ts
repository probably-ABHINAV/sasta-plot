
import { cookies } from 'next/headers'

export interface DemoUser {
  email: string
  role: 'admin' | 'user'
}

const COOKIE_NAME = 'demo-session'
const COOKIE_OPTIONS = 'HttpOnly; Path=/; Max-Age=86400; SameSite=Strict'

export function setDemoSession(user: DemoUser): string {
  const sessionData = btoa(JSON.stringify(user))
  return `${COOKIE_NAME}=${sessionData}; ${COOKIE_OPTIONS}`
}

export const clearSession = `${COOKIE_NAME}=; Path=/; Max-Age=0`

export async function getDemoUser(): Promise<DemoUser | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)
    
    if (!sessionCookie?.value) {
      return null
    }

    const user = JSON.parse(atob(sessionCookie.value))
    
    // Validate user object
    if (user && typeof user.email === 'string' && typeof user.role === 'string') {
      return user as DemoUser
    }
    
    return null
  } catch (error) {
    console.error('Error getting demo user:', error)
    return null
  }
}

export async function isAdminUser(): Promise<boolean> {
  const user = await getDemoUser()
  return user?.role === 'admin'
}
