
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with middleware cookie handling
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Refresh session if needed
    await supabase.auth.getUser()
  }

  // Allow access to CRM sign-in page
  if (pathname === '/crm/sign-in') {
    return response
  }

  // Protect CRM routes
  if (pathname.startsWith('/crm')) {
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              response.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              response.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.redirect(new URL('/crm/sign-in', request.url))
      }
      
      return response
    }
  }

  // Only protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard-admin-2024')) {
    try {
      // First check for Supabase session (if credentials are available)
      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createServerClient(
          supabaseUrl,
          supabaseAnonKey,
          {
            cookies: {
              get(name: string) {
                return request.cookies.get(name)?.value
              },
              set(name: string, value: string, options: CookieOptions) {
                response.cookies.set({
                  name,
                  value,
                  ...options,
                })
              },
              remove(name: string, options: CookieOptions) {
                response.cookies.set({
                  name,
                  value: '',
                  ...options,
                })
              },
            },
          }
        )
        
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          return response
        }
      }

      // Fallback to demo auth cookie
      const sessionCookie = request.cookies.get('demo-session')
      
      if (sessionCookie?.value) {
        try {
          const user = JSON.parse(atob(sessionCookie.value))
          
          if (user && user.role === 'admin' && user.email) {
            return response
          }
        } catch (error) {
          console.error('Invalid session cookie:', error)
        }
      }

      // If no valid session, redirect to sign-in
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    } catch (error) {
      console.error('Middleware error:', error)
      const signInUrl = new URL('/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
