"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIsAdmin } from "@/hooks/use-is-admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, Phone, User, MessageSquare, Clock, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  plot_id?: string
  status: 'pending' | 'seen' | 'responded' | 'closed'
  created_at: string
  updated_at?: string
}

export default function InquiriesAdminPage() {
  const router = useRouter()
  const { isAdmin, loading: authLoading } = useIsAdmin()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/sign-in")
    }
  }, [isAdmin, authLoading, router])

  // Fetch inquiries
  useEffect(() => {
    if (isAdmin) {
      fetchInquiries()
    }
  }, [isAdmin])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiry?admin=true')
      const data = await response.json()
      // Add default status to existing inquiries that might not have it
      const inquiriesWithStatus = (data.inquiries || []).map((inquiry: any) => ({
        ...inquiry,
        status: inquiry.status || 'pending'
      }))
      setInquiries(inquiriesWithStatus)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiry/${inquiryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchInquiries()
      } else {
        console.error('Failed to update inquiry status')
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error)
    }
  }

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return

    try {
      const response = await fetch(`/api/inquiry/${inquiryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchInquiries()
      } else {
        console.error('Failed to delete inquiry')
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'seen':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'responded':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />
      case 'seen':
        return <Eye className="h-3 w-3" />
      case 'responded':
        return <MessageSquare className="h-3 w-3" />
      case 'closed':
        return <EyeOff className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true
    return inquiry.status === filter
  })

  const statusCounts = {
    all: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    seen: inquiries.filter(i => i.status === 'seen').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard-admin-2024')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inquiry Management</h1>
          <p className="text-muted-foreground">Manage customer inquiries and track their status</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'seen', label: 'Seen', count: statusCounts.seen },
            { key: 'responded', label: 'Responded', count: statusCounts.responded },
            { key: 'closed', label: 'Closed', count: statusCounts.closed },
          ].map((item) => (
            <Button
              key={item.key}
              variant={filter === item.key ? "default" : "outline"}
              onClick={() => setFilter(item.key)}
              className="gap-2"
            >
              {item.label}
              <Badge variant="secondary" className="ml-1">
                {item.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No inquiries yet.' : `No ${filter} inquiries.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {inquiry.name}
                      <Badge className={`${getStatusColor(inquiry.status)} flex items-center gap-1`}>
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${inquiry.email}`} className="hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <a href={`tel:${inquiry.phone}`} className="hover:underline">
                            {inquiry.phone}
                          </a>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString()}
                        {inquiry.updated_at && (
                          <> • Updated: {new Date(inquiry.updated_at).toLocaleDateString()}</>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) => handleStatusUpdate(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="seen">Seen</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {inquiry.message && (
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium mb-1">Message:</p>
                        <p className="text-sm text-muted-foreground">{inquiry.message}</p>
                        {inquiry.plot_id && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Related to Plot ID: {inquiry.plot_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}