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
  size_unit: string
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
  const { data: plotsData, error: plotsError, mutate: mutatePlots } = useSWR("/api/plots", fetcher)
  const { data: inquiriesData, error: inquiriesError } = useSWR("/api/inquiry", fetcher)

  const plots = plotsData?.plots || []
  const inquiries = inquiriesData?.inquiries || []

  // State for dialogs and form
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [plotForm, setPlotForm] = useState<Partial<Plot>>({
    title: "",
    location: "",
    price: 0,
    size_sqyd: 0,
    size_unit: "sq.yd",
    description: "",
    featured: false,
  })
  const [editingPlotId, setEditingPlotId] = useState<string | null>(null)

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

  // Plot Management Handlers
  const handleCreatePlot = async () => {
    try {
      const res = await fetch("/api/plots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plotForm),
      })
      if (res.ok) {
        mutatePlots() // Revalidate SWR cache
        setIsCreateDialogOpen(false)
        setPlotForm({ title: "", location: "", price: 0, size_sqyd: 0, size_unit: "sq.yd", description: "", featured: false })
      } else {
        console.error("Failed to create plot")
      }
    } catch (error) {
      console.error("Error creating plot:", error)
    }
  }

  const handleEditPlot = async () => {
    if (!editingPlotId) return

    try {
      const res = await fetch(`/api/plots/${editingPlotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...plotForm,
          size_unit: plotForm.size_unit || "sq.yd"
        }),
      })
      if (res.ok) {
        mutatePlots() // Revalidate SWR cache
        setIsEditDialogOpen(false)
        setEditingPlotId(null)
        setPlotForm({ title: "", location: "", price: 0, size_sqyd: 0, size_unit: "sq.yd", description: "", featured: false })
      } else {
        console.error("Failed to edit plot")
        alert("Failed to edit plot")
      }
    } catch (error) {
      console.error("Edit plot error:", error)
      alert("Error editing plot")
    }
  }

  const handleDeletePlot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plot?")) return;
    try {
      // Find the plot to get its slug for deletion
      const plotToDelete = plots.find(p => p.id === id)
      if (!plotToDelete) {
        console.error("Plot not found for deletion")
        return
      }

      const res = await fetch(`/api/plots/${plotToDelete.slug}`, {
        method: "DELETE",
      })
      if (res.ok) {
        mutatePlots() // Revalidate SWR cache
      } else {
        console.error("Failed to delete plot")
      }
    } catch (error) {
      console.error("Error deleting plot:", error)
    }
  }

  const handleEditPlotOpen = async (plot: Plot) => {
    try {
      // Fetch the full plot data to get size_unit
      const response = await fetch(`/api/plots/${plot.slug}`)
      const data = await response.json()

      setPlotForm({
        title: plot.title,
        location: plot.location,
        price: Number(plot.price.replace(/[₹,]/g, "")),
        size_sqyd: Number(plot.size.replace(/[^0-9]/g, "")),
        size_unit: data.plot?.size_unit || "sq.yd",
        description: plot.description,
        featured: plot.featured,
      })
      setEditingPlotId(plot.id)
      setIsEditDialogOpen(true)
    } catch (error) {
      console.error("Error loading plot for edit:", error)
      // Fallback with default values
      setPlotForm({
        title: plot.title,
        location: plot.location,
        price: Number(plot.price.replace(/[₹,]/g, "")),
        size_sqyd: Number(plot.size.replace(/[^0-9]/g, "")),
        size_unit: "sq.yd",
        description: plot.description,
        featured: plot.featured,
      })
      setEditingPlotId(plot.id)
      setIsEditDialogOpen(true)
    }
  }

  // Blog Management - Navigate to blog admin page
  const handleCreateBlogPost = () => {
    router.push("/admin/blog")
  }

  const handleCreateFirstBlogPost = () => {
    router.push("/admin/blog")
  }

  const handleAddPlot = () => {
    setIsCreateDialogOpen(true)
  }

  const handleAddFirstPlot = () => {
    setIsCreateDialogOpen(true)
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
              <Button onClick={handleAddPlot} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Plot
              </Button>
            </div>

            <div className="grid gap-6">
              {plotsError ? (
                <Card className="bg-red-500/20 border-red-500/30 text-white">
                  <CardContent className="text-center py-12">
                    <MapPin className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading Plots</h3>
                    <p className="text-red-200 mb-4">
                      Failed to load plots. Please try again.
                    </p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : plots.length === 0 ? (
                <Card className="bg-black/20 border-white/10 text-white">
                  <CardContent className="text-center py-12">
                    <MapPin className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Plots Added</h3>
                    <p className="text-white/60 mb-4">Start by adding your first plot listing.</p>
                    <Button onClick={handleAddFirstPlot} className="bg-green-600 hover:bg-green-700">
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
                            <span>{plot.size_sqyd} {plot.size_unit}</span>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => handleEditPlotOpen(plot)}>
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 border-red-400/20 text-red-300 hover:bg-red-500/10" onClick={() => handleDeletePlot(plot.id)}>
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
              <Button onClick={handleCreateBlogPost} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Blog Management</h3>
                <p className="text-white/60 mb-4">Create and manage blog posts for your website.</p>
                <Button onClick={handleCreateFirstBlogPost} className="bg-blue-600 hover:bg-blue-700">
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

      {/* Create Plot Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Create New Plot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={plotForm.title}
                onChange={(e) => setPlotForm({...plotForm, title: e.target.value})}
                className="bg-black/20 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={plotForm.location}
                onChange={(e) => setPlotForm({...plotForm, location: e.target.value})}
                className="bg-black/20 border-white/20 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={plotForm.price}
                  onChange={(e) => setPlotForm({...plotForm, price: Number(e.target.value)})}
                  className="bg-black/20 border-white/20 text-white"
                  placeholder="Enter price in rupees"
                />
              </div>
              <div>
                <Label htmlFor="size">Size</Label>
                <div className="flex gap-2">
                  <Input
                    id="size"
                    type="number"
                    value={plotForm.size_sqyd}
                    onChange={(e) => setPlotForm({...plotForm, size_sqyd: Number(e.target.value)})}
                    className="flex-1"
                    placeholder="Enter size"
                  />
                  <select
                    value={plotForm.size_unit || "sq.yd"}
                    onChange={(e) => setPlotForm({...plotForm, size_unit: e.target.value})}
                    className="flex rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="sq.yd">sq.yd</option>
                    <option value="sq.m">sq.m</option>
                    <option value="acres">acres</option>
                    <option value="hectares">hectares</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={plotForm.description}
                onChange={(e) => setPlotForm({...plotForm, description: e.target.value})}
                className="bg-black/20 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={plotForm.featured}
                onCheckedChange={(checked) => setPlotForm({...plotForm, featured: checked})}
              />
              <Label htmlFor="featured">Featured Plot</Label>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCreatePlot} className="flex-1 bg-green-600 hover:bg-green-700">
                Create Plot
              </Button>
              <Button 
                onClick={() => setIsCreateDialogOpen(false)} 
                variant="outline" 
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Plot Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Edit Plot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={plotForm.title}
                onChange={(e) => setPlotForm({...plotForm, title: e.target.value})}
                className="bg-black/20 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={plotForm.location}
                onChange={(e) => setPlotForm({...plotForm, location: e.target.value})}
                className="bg-black/20 border-white/20 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={plotForm.price}
                  onChange={(e) => setPlotForm({...plotForm, price: Number(e.target.value)})}
                  className="bg-black/20 border-white/20 text-white"
                  placeholder="Enter price in rupees"
                />
              </div>
              <div>
                <Label htmlFor="edit-size">Size</Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="edit-size"
                    type="number"
                    value={plotForm.size_sqyd}
                    onChange={(e) => setPlotForm({...plotForm, size_sqyd: Number(e.target.value)})}
                    className="flex-1"
                    placeholder="Enter size"
                  />
                  <select
                    value={plotForm.size_unit || "sq.yd"}
                    onChange={(e) => setPlotForm({...plotForm, size_unit: e.target.value})}
                    className="flex rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="sq.ft">sq.ft</option>
                    <option value="sq.yd">sq.yd</option>
                    <option value="sq.m">sq.m</option>
                    <option value="acres">acres</option>
                    <option value="hectares">hectares</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={plotForm.description}
                onChange={(e) => setPlotForm({...plotForm, description: e.target.value})}
                className="bg-black/20 border-white/20 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-featured"
                checked={plotForm.featured}
                onCheckedChange={(checked) => setPlotForm({...plotForm, featured: checked})}
              />
              <Label htmlFor="edit-featured">Featured Plot</Label>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleEditPlot} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Plot
              </Button>
              <Button 
                onClick={() => setIsEditDialogOpen(false)} 
                variant="outline" 
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}