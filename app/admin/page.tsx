"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Map,
  Users,
  TrendingUp,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Upload,
  Ruler,
  MapPin,
  Calculator,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { LogoutButton } from "@/components/logout-button"

const mockPlots = [
  {
    id: 1,
    title: "Himalayan View Plot - Mussoorie",
    location: "Mussoorie Hills, Uttrakhand",
    price: "₹85 L",
    size: "2400 sq ft",
    type: "Residential Plot",
    status: "Available",
    views: 245,
    inquiries: 12,
    dateAdded: "2024-01-15",
  },
  {
    id: 2,
    title: "Spiritual Valley Plot - Rishikesh",
    location: "Rishikesh Valley, Uttrakhand",
    price: "₹65 L",
    size: "3200 sq ft",
    type: "Commercial Plot",
    status: "Sold",
    views: 189,
    inquiries: 8,
    dateAdded: "2024-01-10",
  },
  {
    id: 3,
    title: "Lake View Plot - Nainital",
    location: "Nainital Lake Area, Uttrakhand",
    price: "₹1.2 Cr",
    size: "4800 sq ft",
    type: "Premium Plot",
    status: "Available",
    views: 156,
    inquiries: 15,
    dateAdded: "2024-01-20",
  },
]

const mockInquiries = [
  {
    id: 1,
    name: "Rajesh Sharma",
    email: "rajesh@email.com",
    phone: "+91 98765 43210",
    plot: "Himalayan View Plot - Mussoorie",
    message: "Interested in viewing this plot. Please share soil test reports and legal documents.",
    date: "2024-01-25",
    status: "New",
  },
  {
    id: 2,
    name: "Priya Gupta",
    email: "priya@email.com",
    phone: "+91 87654 32109",
    plot: "Lake View Plot - Nainital",
    message: "Looking for investment plot near lake. Is this available for immediate purchase?",
    date: "2024-01-24",
    status: "Contacted",
  },
]

const analyticsData = [
  { month: "Jan", plots: 12, inquiries: 45, sales: 3 },
  { month: "Feb", plots: 15, inquiries: 52, sales: 4 },
  { month: "Mar", plots: 18, inquiries: 38, sales: 2 },
  { month: "Apr", plots: 22, inquiries: 65, sales: 5 },
  { month: "May", plots: 25, inquiries: 71, sales: 6 },
  { month: "Jun", plots: 28, inquiries: 58, sales: 4 },
]

const plotTypeData = [
  { name: "Residential Plot", value: 40, color: "#059669" },
  { name: "Commercial Plot", value: 25, color: "#10b981" },
  { name: "Premium Plot", value: 20, color: "#34d399" },
  { name: "Agricultural Plot", value: 15, color: "#6ee7b7" },
]

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Admin User"
    setUserName(name)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.jpg"
              alt="Property in Uttrakhand"
              width={140}
              height={45}
              className="h-10 w-auto"
            />
            <div className="border-l pl-4">
              <h1 className="font-serif font-black text-lg text-primary">Plot Management Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              View Website
            </Link>
            <Link href="/admin/plots" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              <Map className="w-4 h-4 mr-1 inline" />
              Plot Management
            </Link>
            <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              <FileText className="w-4 h-4 mr-1 inline" />
              Blog
            </Link>
            <Link
              href="/admin/inquiries"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-1 inline" />
              Inquiries
            </Link>
            <Link href="/admin/files" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              <Upload className="w-4 h-4 mr-1 inline" />
              Files
            </Link>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="plots" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Plot Management
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Inquiries
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Plots</CardTitle>
                  <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">142</div>
                  <p className="text-xs text-muted-foreground">+8 new plots this month</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Plot Inquiries</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">58</div>
                  <p className="text-xs text-muted-foreground">+12 from last week</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Plots Sold</CardTitle>
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">6</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">₹4.8 Cr</div>
                  <p className="text-xs text-muted-foreground">+32% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Plot Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPlots.slice(0, 3).map((plot) => (
                      <div key={plot.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{plot.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {plot.location}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Ruler className="w-3 h-3" />
                            {plot.size}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">{plot.price}</div>
                          <Badge variant={plot.status === "Available" ? "default" : "secondary"}>{plot.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Plot Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockInquiries.slice(0, 3).map((inquiry) => (
                      <div key={inquiry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{inquiry.name}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.plot}</p>
                        </div>
                        <Badge variant={inquiry.status === "New" ? "destructive" : "default"}>{inquiry.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plots" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold">Plot Management</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add New Plot
              </Button>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>All Available Plots</CardTitle>
                <CardDescription>Manage your land plot listings and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plot Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Inquiries</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPlots.map((plot) => (
                      <TableRow key={plot.id}>
                        <TableCell className="font-medium">{plot.title}</TableCell>
                        <TableCell>{plot.location}</TableCell>
                        <TableCell className="font-semibold text-primary">{plot.price}</TableCell>
                        <TableCell>{plot.size}</TableCell>
                        <TableCell>{plot.type}</TableCell>
                        <TableCell>
                          <Badge variant={plot.status === "Available" ? "default" : "secondary"}>{plot.status}</Badge>
                        </TableCell>
                        <TableCell>{plot.views}</TableCell>
                        <TableCell>{plot.inquiries}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold">Plot Inquiries</h2>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Customer Plot Inquiries</CardTitle>
                <CardDescription>Manage customer inquiries for land plots and follow-ups</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Interested Plot</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{inquiry.name}</p>
                            <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{inquiry.phone}</TableCell>
                        <TableCell>{inquiry.plot}</TableCell>
                        <TableCell>{inquiry.date}</TableCell>
                        <TableCell>
                          <Badge variant={inquiry.status === "New" ? "destructive" : "default"}>{inquiry.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              Reply
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-serif font-bold">Plot Analytics & Reports</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Monthly Plot Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="inquiries" fill="#059669" name="Inquiries" />
                      <Bar dataKey="sales" fill="#10b981" name="Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Plot Types Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={plotTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {plotTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold">Blog Management</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Create New Blog Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter blog post title" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investment">Investment Tips</SelectItem>
                        <SelectItem value="destinations">Destinations</SelectItem>
                        <SelectItem value="spiritual">Spiritual Places</SelectItem>
                        <SelectItem value="market">Market Updates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" placeholder="Write your blog post content..." rows={6} />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">Publish Post</Button>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Top 5 Investment Opportunities in Uttrakhand",
                        date: "2024-01-20",
                        status: "Published",
                      },
                      {
                        title: "Spiritual Tourism Boom in Rishikesh",
                        date: "2024-01-18",
                        status: "Draft",
                      },
                      {
                        title: "Hill Station Property Market Trends",
                        date: "2024-01-15",
                        status: "Published",
                      },
                    ].map((post, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-muted-foreground">{post.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={post.status === "Published" ? "default" : "secondary"}>{post.status}</Badge>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold">User Management</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>System Users</CardTitle>
                <CardDescription>Manage admin users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "Admin User",
                        email: "admin@propertyinuttrakhand.com",
                        role: "Super Admin",
                        lastLogin: "2024-01-25",
                        status: "Active",
                      },
                      {
                        name: "Property Manager",
                        email: "manager@propertyinuttrakhand.com",
                        role: "Manager",
                        lastLogin: "2024-01-24",
                        status: "Active",
                      },
                    ].map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <Badge variant="default">{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthGuard requireAuth={true}>
      <AdminDashboardContent />
    </AuthGuard>
  )
}
