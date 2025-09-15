"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Eye, Reply, Phone, Search, ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { LogoutButton } from "@/components/logout-button"

// Mock inquiry data
const mockInquiries = [
  {
    id: 1,
    name: "Rajesh Sharma",
    email: "rajesh.sharma@email.com",
    phone: "+91 98765 43210",
    property: "Himalayan Villa in Mussoorie",
    propertyId: "PLT001",
    subject: "Property Viewing Request",
    message:
      "I am interested in viewing this property. Could you please arrange a site visit? I am available on weekends.",
    date: "2024-01-25",
    time: "14:30",
    status: "New",
    priority: "High",
    source: "Website",
    assignedTo: "Admin User",
    lastResponse: null,
    notes: [],
    budget: "₹2-3 Cr",
    timeline: "Within 3 months",
    location: "Delhi",
  },
  {
    id: 2,
    name: "Priya Gupta",
    email: "priya.gupta@email.com",
    phone: "+91 87654 32109",
    property: "Mountain View Cottage in Nainital",
    propertyId: "PLT003",
    subject: "Investment Inquiry",
    message:
      "Looking for a weekend home investment. Is this property available for immediate purchase? What are the legal formalities?",
    date: "2024-01-24",
    time: "10:15",
    status: "In Progress",
    priority: "Medium",
    source: "Phone Call",
    assignedTo: "Property Manager",
    lastResponse: "2024-01-24",
    notes: [
      { date: "2024-01-24", note: "Called customer, scheduled site visit for weekend", author: "Property Manager" },
    ],
    budget: "₹80L - 1Cr",
    timeline: "Within 6 months",
    location: "Mumbai",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91 76543 21098",
    property: "Spiritual Retreat Plot - Rishikesh",
    propertyId: "PLT002",
    subject: "Commercial Investment",
    message:
      "Interested in this plot for developing a yoga retreat center. Need details about commercial approvals and development guidelines.",
    date: "2024-01-23",
    time: "16:45",
    status: "Closed",
    priority: "Low",
    source: "Email",
    assignedTo: "Admin User",
    lastResponse: "2024-01-23",
    notes: [
      { date: "2024-01-23", note: "Provided all commercial development details", author: "Admin User" },
      { date: "2024-01-23", note: "Customer decided to proceed with purchase", author: "Admin User" },
    ],
    budget: "₹50L - 80L",
    timeline: "Immediate",
    location: "Bangalore",
  },
]

const inquiryStatuses = ["New", "In Progress", "Closed", "Follow Up Required"]
const priorities = ["Low", "Medium", "High", "Urgent"]
const sources = ["Website", "Phone Call", "Email", "Walk-in", "Referral"]

function InquiryManagementContent() {
  const [inquiries, setInquiries] = useState(mockInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState<(typeof mockInquiries)[0] | null>(null)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || inquiry.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPriority = priorityFilter === "all" || inquiry.priority.toLowerCase() === priorityFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusChange = (inquiryId: number, newStatus: string) => {
    setInquiries(inquiries.map((inquiry) => (inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry)))
  }

  const handleAddNote = (inquiryId: number, note: string) => {
    setInquiries(
      inquiries.map((inquiry) =>
        inquiry.id === inquiryId
          ? {
              ...inquiry,
              notes: [
                ...inquiry.notes,
                {
                  date: new Date().toISOString().split("T")[0],
                  note,
                  author: "Admin User",
                },
              ],
            }
          : inquiry,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "destructive"
      case "in progress":
        return "default"
      case "closed":
        return "secondary"
      case "follow up required":
        return "outline"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Image
              src="/images/mascot.png"
              alt="Property in Uttrakhand"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="font-serif font-black text-lg text-primary">Inquiry Management</h1>
              <p className="text-sm text-muted-foreground">Track and manage customer inquiries</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              View Website
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inquiries by name, email, property, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {inquiryStatuses.map((status) => (
                  <SelectItem key={status} value={status.toLowerCase()}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority.toLowerCase()}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inquiries</p>
                  <p className="text-2xl font-bold">{inquiries.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New</p>
                  <p className="text-2xl font-bold text-red-600">
                    {inquiries.filter((i) => i.status === "New").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {inquiries.filter((i) => i.status === "In Progress").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Closed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {inquiries.filter((i) => i.status === "Closed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Inquiries ({filteredInquiries.length})</CardTitle>
            <CardDescription>Manage and respond to customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                        <p className="text-sm text-muted-foreground">{inquiry.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{inquiry.property}</p>
                        <p className="text-xs text-muted-foreground">ID: {inquiry.propertyId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="font-medium text-sm">{inquiry.subject}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{inquiry.message}</p>
                    </TableCell>
                    <TableCell>
                      <Select value={inquiry.status} onValueChange={(value) => handleStatusChange(inquiry.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(inquiry.priority) as any}>{inquiry.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {inquiry.date}
                      <br />
                      <span className="text-xs text-muted-foreground">{inquiry.time}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedInquiry(inquiry)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Inquiry Details - {selectedInquiry?.name}</DialogTitle>
                              <DialogDescription>
                                {selectedInquiry?.subject} • {selectedInquiry?.date}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedInquiry && (
                              <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="details">Details</TabsTrigger>
                                  <TabsTrigger value="message">Message</TabsTrigger>
                                  <TabsTrigger value="notes">Notes</TabsTrigger>
                                  <TabsTrigger value="response">Response</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Customer Name</Label>
                                      <p className="text-sm">{selectedInquiry.name}</p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-sm">{selectedInquiry.email}</p>
                                    </div>
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="text-sm">{selectedInquiry.phone}</p>
                                    </div>
                                    <div>
                                      <Label>Location</Label>
                                      <p className="text-sm">{selectedInquiry.location}</p>
                                    </div>
                                    <div>
                                      <Label>Property</Label>
                                      <p className="text-sm">{selectedInquiry.property}</p>
                                    </div>
                                    <div>
                                      <Label>Property ID</Label>
                                      <p className="text-sm">{selectedInquiry.propertyId}</p>
                                    </div>
                                    <div>
                                      <Label>Budget</Label>
                                      <p className="text-sm">{selectedInquiry.budget}</p>
                                    </div>
                                    <div>
                                      <Label>Timeline</Label>
                                      <p className="text-sm">{selectedInquiry.timeline}</p>
                                    </div>
                                    <div>
                                      <Label>Source</Label>
                                      <p className="text-sm">{selectedInquiry.source}</p>
                                    </div>
                                    <div>
                                      <Label>Assigned To</Label>
                                      <p className="text-sm">{selectedInquiry.assignedTo}</p>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="message" className="space-y-4">
                                  <div>
                                    <Label>Subject</Label>
                                    <p className="text-sm font-medium">{selectedInquiry.subject}</p>
                                  </div>
                                  <div>
                                    <Label>Message</Label>
                                    <div className="text-sm border rounded p-3 bg-muted/50">
                                      {selectedInquiry.message}
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="notes" className="space-y-4">
                                  <div>
                                    <Label>Internal Notes</Label>
                                    <div className="space-y-2 mt-2">
                                      {selectedInquiry.notes.length > 0 ? (
                                        selectedInquiry.notes.map((note, index) => (
                                          <div key={index} className="border rounded p-3 bg-muted/50">
                                            <p className="text-sm">{note.note}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                              {note.author} • {note.date}
                                            </p>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-sm text-muted-foreground">No notes added yet.</p>
                                      )}
                                    </div>
                                    <div className="mt-4">
                                      <Textarea placeholder="Add a note..." rows={3} />
                                      <Button className="mt-2 bg-primary hover:bg-primary/90" size="sm">
                                        Add Note
                                      </Button>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="response" className="space-y-4">
                                  <div>
                                    <Label>Send Response</Label>
                                    <div className="space-y-3 mt-2">
                                      <Input placeholder="Subject" defaultValue={`Re: ${selectedInquiry.subject}`} />
                                      <Textarea placeholder="Type your response..." rows={6} />
                                      <div className="flex gap-2">
                                        <Button className="bg-primary hover:bg-primary/90">
                                          <Reply className="w-4 h-4 mr-2" />
                                          Send Email
                                        </Button>
                                        <Button variant="outline">
                                          <Phone className="w-4 h-4 mr-2" />
                                          Call Customer
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <Reply className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function InquiryManagementPage() {
  return (
    <AuthGuard requireAuth={true}>
      <InquiryManagementContent />
    </AuthGuard>
  )
}
