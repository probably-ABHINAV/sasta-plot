"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIsAdmin } from "@/hooks/use-is-admin"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  BarChart3, 
  FileText, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Home, 
  LogOut,
  Settings,
  Users,
  MapPin,
  DollarSign
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type Plot = {
  id: string
  title: string
  slug: string
  description: string
  price: number
  location: string
  size_sqyd: number
  image_url?: string
  featured: boolean
  created_at: string
}

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  published: boolean
  created_at: string
}

type Inquiry = {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  plot_id?: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { isAdmin, loading: authLoading } = useIsAdmin()
  const [activeTab, setActiveTab] = useState("overview")

  // SWR for data fetching
  const { data: plotsData, error: plotsError } = useSWR("/api/plots", fetcher)
  const { data: inquiriesData, error: inquiriesError } = useSWR("/api/inquiry", fetcher)

  const plots = plotsData?.plots || []
  const inquiries = inquiriesData?.inquiries || []

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/sign-in")
    }
  }, [isAdmin, authLoading, router])

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/mock", { method: "DELETE" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-white/60">Manage your real estate platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-white hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Visit Site
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-white/10">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="plots" className="text-white data-[state=active]:bg-white/20">
              <MapPin className="w-4 h-4 mr-2" />
              Plots
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-white data-[state=active]:bg-white/20">
              <FileText className="w-4 h-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="text-white data-[state=active]:bg-white/20">
              <Mail className="w-4 h-4 mr-2" />
              Inquiries
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Plots</CardTitle>
                  <MapPin className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{plots.length}</div>
                  <p className="text-xs text-white/60">Active listings</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
                  <Mail className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inquiries.length}</div>
                  <p className="text-xs text-white/60">Pending responses</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Featured Plots</CardTitle>
                  <Eye className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{plots.filter(p => p.featured).length}</div>
                  <p className="text-xs text-white/60">Currently featured</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{plots.length > 0 ? Math.round(plots.reduce((acc, p) => acc + p.price, 0) / plots.length / 100000) : 0}L
                  </div>
                  <p className="text-xs text-white/60">Per plot</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inquiries.slice(0, 3).map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{inquiry.name}</p>
                        <p className="text-xs text-white/60">New inquiry received</p>
                      </div>
                      <div className="text-xs text-white/60">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab("plots")}
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Plot
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("blog")}
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create Blog Post
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("inquiries")}
                    className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    View Inquiries
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plots Management Tab */}
          <TabsContent value="plots" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Manage Plots</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Plot
              </Button>
            </div>

            <div className="grid gap-6">
              {plots.length === 0 ? (
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardContent className="text-center py-12">
                    <MapPin className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Plots Added</h3>
                    <p className="text-white/60 mb-4">Start by adding your first plot listing.</p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Plot
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {plots.map((plot) => (
                    <Card key={plot.id} className="bg-black/20 border-white/10 text-white">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plot.title}</CardTitle>
                          {plot.featured && (
                            <Badge className="bg-yellow-500/20 text-yellow-300">Featured</Badge>
                          )}
                        </div>
                        <CardDescription className="text-white/70">
                          {plot.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Price:</span>
                            <span className="font-semibold">₹{(plot.price / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Size:</span>
                            <span>{plot.size_sqyd} sq.yd</span>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 border-red-400/20 text-red-300 hover:bg-red-500/10">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Blog Management Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Manage Blog</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Blog Management</h3>
                <p className="text-white/60 mb-4">Create and manage blog posts for your website.</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Customer Inquiries</h2>

            <div className="grid gap-4">
              {inquiriesError ? (
                <Card className="bg-red-500/20 border-red-500/30 text-white">
                  <CardContent className="text-center py-12">
                    <Mail className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading Inquiries</h3>
                    <p className="text-red-200 mb-4">
                      Failed to load inquiries. Error: {inquiriesError.message || "Unknown error"}
                    </p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : inquiries.length === 0 ? (
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardContent className="text-center py-12">
                    <Mail className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Inquiries Yet</h3>
                    <p className="text-white/60">
                      Customer inquiries will appear here when submitted through the contact form.
                    </p>
                    <p className="text-white/40 text-sm mt-2">
                      Debug: Found {inquiries.length} inquiries in response
                    </p>
                  </CardContent>
                </Card>
              ) : (
                inquiries.map((inquiry) => (
                  <Card key={inquiry.id} className="bg-black/20 border-white/10 text-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                          New
                        </Badge>
                      </div>
                      <CardDescription className="text-white/70">
                        {inquiry.email} {inquiry.phone && `• ${inquiry.phone}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 mb-3">{inquiry.message}</p>
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <span>Received: {new Date(inquiry.created_at).toLocaleDateString()}</span>
                        {inquiry.plot_id && (
                          <span>Plot Interest: {inquiry.plot_id}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}