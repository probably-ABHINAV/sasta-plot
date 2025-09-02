
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard-admin-2024')) {
    try {
      // Check for demo auth cookie
      const sessionCookie = request.cookies.get('demo-session')
      
      if (sessionCookie?.value) {
        try {
          const user = JSON.parse(atob(sessionCookie.value))
          
          if (user && user.role === 'admin' && user.email) {
            return NextResponse.next()
          }
        } catch (error) {
          console.error('Invalid session cookie:', error)
        }
      }

      // If no valid admin session, redirect to sign-in
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    } catch (error) {
      console.error('Middleware error:', error)
      const signInUrl = new URL('/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
