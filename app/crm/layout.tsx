
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getBrowserSupabase } from "@/lib/supabase/browser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Megaphone,
  Settings,
  LogOut,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function checkAuth() {
      // Skip auth check for sign-in page
      if (pathname === "/crm/sign-in") {
        setLoading(false)
        setAuthenticated(true)
        return
      }

      const supabase = getBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/crm/sign-in")
        return
      }

      // Check CRM profile
      const { data: profile } = await supabase
        .from('crm_profiles')
        .select('role_id, is_disabled')
        .eq('id', user.id)
        .single()

      if (!profile || profile.is_disabled) {
        await supabase.auth.signOut()
        router.push("/crm/sign-in")
        return
      }

      setUser(user)
      setAuthenticated(true)
      setLoading(false)
    }

    if (mounted) {
      checkAuth()
    }
  }, [router, pathname, mounted])

  async function handleSignOut() {
    const supabase = getBrowserSupabase()
    await supabase.auth.signOut()
    router.push("/crm/sign-in")
  }

  // Prevent hydration mismatch - don't render anything until mounted
  if (!mounted) {
    return null
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If on sign-in page, render children directly without sidebar
  if (pathname === "/crm/sign-in") {
    return <div>{children}</div>
  }

  // If not authenticated, don't render anything (redirecting)
  if (!authenticated) {
    return null
  }

  const sidebarItems = [
    {
      href: "/crm",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      href: "/crm/leads",
      icon: <Target size={20} />,
      label: "Leads",
    },
    {
      href: "/crm/agents",
      icon: <Users size={20} />,
      label: "Sales Agents",
    },
    {
      href: "/crm/site-visits",
      icon: <Calendar size={20} />,
      label: "Site Visits",
    },
    {
      href: "/crm/payments",
      icon: <CreditCard size={20} />,
      label: "Payments",
    },
    {
      href: "/crm/campaigns",
      icon: <Megaphone size={20} />,
      label: "Campaigns",
    },
    {
      href: "/crm/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <Link href="/crm" className="flex items-center space-x-2 p-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold">SP</span>
              </div>
              <span className="font-bold text-lg">Sasta Plots CRM</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center space-x-3 mb-3 px-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mx-2 mb-2" onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 p-4 border-b md:hidden">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Sasta Plots CRM</h1>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
