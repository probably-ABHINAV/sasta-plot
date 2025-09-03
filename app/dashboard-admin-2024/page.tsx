
"use client"

import React, { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ImageUploader from "@/components/image-uploader"
import { BarChart3, Plus, Edit, Trash2, MapPin, DollarSign, Home, MessageSquare, Eye, Users, TrendingUp } from "lucide-react"
import { getBrowserSupabase } from "@/lib/supabase/browser"
import Image from "next/image"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Plot = {
  id: string
  title: string
  location: string
  price: number
  size_sqyd: number
  description?: string
  featured?: boolean
  images?: string[]
  slug: string
  created_at: string
}

type Blog = {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  published: boolean
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null)
  const [plotForm, setPlotForm] = useState({
    title: "",
    location: "",
    price: "",
    size_sqyd: "",
    size_unit: "sq.yd",
    description: "",
    featured: false,
    images: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Check authentication
  React.useEffect(() => {
    const checkAuth = async () => {
      const supabase = getBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setIsAuthenticated(true)
    }
    checkAuth()
  }, [router])

  // Fetch data
  const { data: plotsData, error: plotsError, mutate: mutatePlots } = useSWR("/api/plots", fetcher)
  const { data: blogsData, error: blogsError, mutate: mutateBlogs } = useSWR("/api/blog", fetcher)

  const plots = plotsData?.plots || []
  const blogs = blogsData?.posts || []

  const resetForm = () => {
    setPlotForm({
      title: "",
      location: "",
      price: "",
      size_sqyd: "",
      size_unit: "sq.yd",
      description: "",
      featured: false,
      images: []
    })
  }

  const handleImageUpload = useCallback((urls: string[]) => {
    setPlotForm(prev => ({ ...prev, images: urls }))
  }, [])

  const validateForm = () => {
    if (!plotForm.title.trim()) return "Title is required"
    if (!plotForm.location.trim()) return "Location is required"
    if (!plotForm.price || Number(plotForm.price) <= 0) return "Valid price is required"
    if (!plotForm.size_sqyd || Number(plotForm.size_sqyd) <= 0) return "Valid size is required"
    return null
  }

  const handleCreatePlot = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/plots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: plotForm.title,
          location: plotForm.location,
          price: Number(plotForm.price),
          size_sqyd: Number(plotForm.size_sqyd),
          description: plotForm.description,
          featured: plotForm.featured,
          images: plotForm.images
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create plot')
      }

      resetForm()
      setIsCreateDialogOpen(false)
      mutatePlots()
    } catch (error: any) {
      setSubmitError(error.message || "Failed to create plot")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditPlot = (plot: Plot) => {
    setEditingPlot(plot)
    setPlotForm({
      title: plot.title,
      location: plot.location,
      price: plot.price.toString(),
      size_sqyd: plot.size_sqyd.toString(),
      size_unit: "sq.yd",
      description: plot.description || "",
      featured: plot.featured || false,
      images: plot.images || []
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdatePlot = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlot) return

    const validationError = validateForm()
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch(`/api/plots/${editingPlot.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: plotForm.title,
          location: plotForm.location,
          price: Number(plotForm.price),
          size_sqyd: Number(plotForm.size_sqyd),
          description: plotForm.description,
          featured: plotForm.featured,
          images: plotForm.images
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to update plot')
      }

      resetForm()
      setIsEditDialogOpen(false)
      setEditingPlot(null)
      mutatePlots()
    } catch (error: any) {
      setSubmitError(error.message || "Failed to update plot")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePlot = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this plot? This action cannot be undone.")) return

    try {
      const response = await fetch(`/api/plots/${slug}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete plot")
      }

      mutatePlots()
    } catch (error: any) {
      console.error('Delete error:', error)
      setSubmitError(error.message || "Failed to delete plot. Please try again.")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">Manage your real estate platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/")}>
              <Eye className="h-4 w-4 mr-2" />
              Visit Site
            </Button>
            <Button 
              variant="ghost" 
              onClick={async () => {
                const supabase = getBrowserSupabase()
                await supabase.auth.signOut()
                router.push("/auth/login")
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Total Plots</p>
                  <p className="text-2xl font-bold text-white">{plots.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Featured Plots</p>
                  <p className="text-2xl font-bold text-white">
                    {plots.filter((p: Plot) => p.featured).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Blog Posts</p>
                  <p className="text-2xl font-bold text-white">{blogs.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">Published Posts</p>
                  <p className="text-2xl font-bold text-white">
                    {blogs.filter((b: Blog) => b.published).length}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="plots" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Overview</TabsTrigger>
            <TabsTrigger value="plots" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Plots</TabsTrigger>
            <TabsTrigger value="blog" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Blog</TabsTrigger>
            <TabsTrigger value="inquiries" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Platform Overview</CardTitle>
                <CardDescription className="text-gray-300">
                  Welcome to your admin dashboard. Here's a quick overview of your platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span>Total Properties Listed</span>
                    <span className="font-semibold">{plots.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span>Featured Properties</span>
                    <span className="font-semibold">{plots.filter((p: Plot) => p.featured).length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span>Blog Articles</span>
                    <span className="font-semibold">{blogs.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Published Articles</span>
                    <span className="font-semibold">{blogs.filter((b: Blog) => b.published).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plots" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Manage Plots</h2>
                <p className="text-gray-300">Add, edit, and manage your property listings</p>
              </div>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Plot
              </Button>
            </div>

            {plotsError && (
              <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
                <AlertDescription className="text-red-400">
                  Failed to load plots. Please check your database connection and try again.
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 border-red-400 text-red-400 hover:bg-red-400/10" 
                    onClick={() => mutatePlots()}
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {plots.length === 0 && !plotsError && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-white">No plots yet</h3>
                  <p className="text-gray-300 text-center mb-4">
                    Create your first plot to get started with your real estate platform.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Plot
                  </Button>
                </CardContent>
              </Card>
            )}

            {plots.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plots.map((plot: Plot) => (
                  <Card key={plot.id} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
                    {plot.images && plot.images.length > 0 && (
                      <div className="relative aspect-video w-full">
                        <Image
                          src={plot.images[0]}
                          alt={plot.title}
                          fill
                          className="object-cover"
                        />
                        {plot.featured && (
                          <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                            Featured
                          </Badge>
                        )}
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-white line-clamp-1">{plot.title}</h3>
                        <p className="text-gray-300 text-sm">{plot.location}</p>
                        <p className="text-green-400 font-bold">₹{Number(plot.price).toLocaleString()}</p>
                        <p className="text-gray-300 text-sm">{plot.size_sqyd} sq.yd</p>
                        <div className="flex justify-between items-center pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPlot(plot)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePlot(plot.slug)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blog">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Blog Management</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your blog posts and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-300">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Blog management functionality coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Customer Inquiries</CardTitle>
                <CardDescription className="text-gray-300">
                  View and manage customer inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-300">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Inquiries management functionality coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Plot Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-slate-900 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Plot</DialogTitle>
              <DialogDescription className="text-gray-300">
                Fill in the details to create a new plot listing.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePlot} className="space-y-4">
              {submitError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {submitError}
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <Input
                    id="title"
                    value={plotForm.title}
                    onChange={(e) => setPlotForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    placeholder="Enter plot title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">Location</Label>
                  <Input
                    id="location"
                    value={plotForm.location}
                    onChange={(e) => setPlotForm(prev => ({ ...prev, location: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    placeholder="Enter location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={plotForm.price}
                    onChange={(e) => setPlotForm(prev => ({ ...prev, price: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    placeholder="Enter price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size" className="text-white">Size</Label>
                  <div className="flex gap-2">
                    <Input
                      id="size"
                      type="number"
                      value={plotForm.size_sqyd}
                      onChange={(e) => setPlotForm(prev => ({ ...prev, size_sqyd: e.target.value }))}
                      required
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      placeholder="Enter size"
                    />
                    <Select
                      value={plotForm.size_unit}
                      onValueChange={(value) => setPlotForm(prev => ({ ...prev, size_unit: value }))}
                    >
                      <SelectTrigger className="w-24 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="sq.yd" className="text-white hover:bg-white/10">sq.yd</SelectItem>
                        <SelectItem value="sq.ft" className="text-white hover:bg-white/10">sq.ft</SelectItem>
                        <SelectItem value="sq.m" className="text-white hover:bg-white/10">sq.m</SelectItem>
                        <SelectItem value="acres" className="text-white hover:bg-white/10">acres</SelectItem>
                        <SelectItem value="bigha" className="text-white hover:bg-white/10">bigha</SelectItem>
                        <SelectItem value="katha" className="text-white hover:bg-white/10">katha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={plotForm.description}
                  onChange={(e) => setPlotForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  placeholder="Enter plot description"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Images</Label>
                <ImageUploader
                  onUpload={handleImageUpload}
                  maxFiles={5}
                  currentImages={plotForm.images}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={plotForm.featured}
                  onCheckedChange={(checked) => setPlotForm(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured" className="text-white">Featured Plot</Label>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePlot} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Creating..." : "Create Plot"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Plot Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-slate-900 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Plot</DialogTitle>
              <DialogDescription className="text-gray-300">
                Update the plot details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdatePlot} className="space-y-4">
              {submitError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {submitError}
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-white">Title</Label>
                  <Input
                    id="edit-title"
                    value={plotForm.title}
                    onChange={(e) => setPlotForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location" className="text-white">Location</Label>
                  <Input
                    id="edit-location"
                    value={plotForm.location}
                    onChange={(e) => setPlotForm(prev => ({ ...prev, location: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-white">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={plotForm.price}
                    onChange={(e) => setPlotForm(prev => ({ ...prev, price: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-size" className="text-white">Size</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-size"
                      type="number"
                      value={plotForm.size_sqyd}
                      onChange={(e) => setPlotForm(prev => ({ ...prev, size_sqyd: e.target.value }))}
                      required
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <Select
                      value={plotForm.size_unit}
                      onValueChange={(value) => setPlotForm(prev => ({ ...prev, size_unit: value }))}
                    >
                      <SelectTrigger className="w-24 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="sq.yd" className="text-white hover:bg-white/10">sq.yd</SelectItem>
                        <SelectItem value="sq.ft" className="text-white hover:bg-white/10">sq.ft</SelectItem>
                        <SelectItem value="sq.m" className="text-white hover:bg-white/10">sq.m</SelectItem>
                        <SelectItem value="acres" className="text-white hover:bg-white/10">acres</SelectItem>
                        <SelectItem value="bigha" className="text-white hover:bg-white/10">bigha</SelectItem>
                        <SelectItem value="katha" className="text-white hover:bg-white/10">katha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-white">Description</Label>
                <Textarea
                  id="edit-description"
                  value={plotForm.description}
                  onChange={(e) => setPlotForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Images</Label>
                <ImageUploader
                  onUpload={handleImageUpload}
                  maxFiles={5}
                  currentImages={plotForm.images}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-featured"
                  checked={plotForm.featured}
                  onCheckedChange={(checked) => setPlotForm(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="edit-featured" className="text-white">Featured Plot</Label>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdatePlot} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Updating..." : "Update Plot"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
