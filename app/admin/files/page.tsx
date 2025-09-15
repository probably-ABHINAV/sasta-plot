"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import {
  Search,
  ArrowLeft,
  FolderOpen,
  FileImage,
  FileText,
  File,
  HardDrive,
  Upload,
  Download,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { LogoutButton } from "@/components/logout-button"

// Mock file data
const mockFiles = [
  {
    id: "1",
    name: "himalayan-villa-exterior.jpg",
    size: 2048576,
    type: "image/jpeg",
    url: "/luxury-villa-mountains-mussoorie.jpg",
    uploadDate: "2024-01-25",
    category: "Property Images",
    usedIn: ["PLT001", "Blog Post #1"],
  },
  {
    id: "2",
    name: "rishikesh-retreat-brochure.pdf",
    size: 1536000,
    type: "application/pdf",
    url: "#",
    uploadDate: "2024-01-24",
    category: "Documents",
    usedIn: ["PLT002"],
  },
  {
    id: "3",
    name: "nainital-cottage-interior.jpg",
    size: 1843200,
    type: "image/jpeg",
    url: "/cottage-nainital-lake-mountains.jpg",
    uploadDate: "2024-01-23",
    category: "Property Images",
    usedIn: ["PLT003"],
  },
  {
    id: "4",
    name: "property-legal-documents.docx",
    size: 512000,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    url: "#",
    uploadDate: "2024-01-22",
    category: "Legal Documents",
    usedIn: ["PLT001", "PLT002"],
  },
]

const categories = ["All", "Property Images", "Documents", "Legal Documents", "Blog Images", "Marketing Materials"]

function FileManagementContent() {
  const [files, setFiles] = useState(mockFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "All" || file.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="w-5 h-5 text-blue-500" />
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />
    return <File className="w-5 h-5 text-gray-500" />
  }

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0)
  }

  const getFilesByCategory = () => {
    const categoryCounts: Record<string, number> = {}
    files.forEach((file) => {
      categoryCounts[file.category] = (categoryCounts[file.category] || 0) + 1
    })
    return categoryCounts
  }

  const handleFilesUploaded = (newFiles: any[]) => {
    // In a real app, this would update the files list
    console.log("New files uploaded:", newFiles)
  }

  const handleDeleteFiles = () => {
    setFiles(files.filter((file) => !selectedFiles.includes(file.id)))
    setSelectedFiles([])
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
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
              <h1 className="font-serif font-black text-lg text-primary">File Management</h1>
              <p className="text-sm text-muted-foreground">Upload and manage media files</p>
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
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Manage Files
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              Image Gallery
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <FileUpload
              onFilesUploaded={handleFilesUploaded}
              acceptedTypes={["image/*", ".pdf", ".doc", ".docx", ".txt"]}
              maxFileSize={10 * 1024 * 1024}
              maxFiles={20}
              category="Property Images"
              showGallery={true}
            />
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Files</p>
                      <p className="text-2xl font-bold">{files.length}</p>
                    </div>
                    <File className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Images</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {files.filter((f) => f.type.startsWith("image/")).length}
                      </p>
                    </div>
                    <FileImage className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Documents</p>
                      <p className="text-2xl font-bold text-red-600">
                        {files.filter((f) => !f.type.startsWith("image/")).length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Storage Used</p>
                      <p className="text-2xl font-bold">{formatFileSize(getTotalSize())}</p>
                    </div>
                    <HardDrive className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                {selectedFiles.length > 0 && (
                  <Button variant="destructive" onClick={handleDeleteFiles}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedFiles.length})
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Files Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Files ({filteredFiles.length})</CardTitle>
                <CardDescription>Manage your uploaded files and media</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFiles(filteredFiles.map((f) => f.id))
                            } else {
                              setSelectedFiles([])
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Used In</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{file.category}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatFileSize(file.size)}</TableCell>
                        <TableCell className="text-sm">{file.uploadDate}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {file.usedIn.map((usage, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {usage}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive bg-transparent"
                            >
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

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Gallery</CardTitle>
                <CardDescription>Browse and manage your image files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {files
                    .filter((file) => file.type.startsWith("image/"))
                    .map((file) => (
                      <div key={file.id} className="relative group">
                        <div className="relative aspect-square overflow-hidden rounded-lg border">
                          <Image
                            src={file.url || "/placeholder.svg"}
                            alt={file.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge variant="secondary" className="text-xs">
                              {file.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {file.uploadDate}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function FileManagementPage() {
  return (
    <AuthGuard requireAuth={true}>
      <FileManagementContent />
    </AuthGuard>
  )
}
