
"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void
  maxFiles?: number
  currentImages?: string[]
}

export default function ImageUploader({ onUpload, maxFiles = 5, currentImages = [] }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(currentImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`)
      return
    }

    setUploading(true)
    setError("")

    try {
      const newUrls: string[] = []
      let hasErrors = false

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError(`File "${file.name}" is not an image. Please select only image files.`)
          hasErrors = true
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File "${file.name}" is too large. Image size should be less than 5MB.`)
          hasErrors = true
          continue
        }

        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('prefix', 'plots')

          console.log('Uploading file:', file.name, 'Size:', file.size)

          const response = await fetch('/api/storage/upload', {
            method: 'POST',
            body: formData
          })

          console.log('Upload response status:', response.status)

          if (!response.ok) {
            const errorText = await response.text()
            console.error('Upload error response:', errorText)
            
            let errorData
            try {
              errorData = JSON.parse(errorText)
            } catch {
              errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
            }
            
            throw new Error(errorData.error || `Upload failed with status ${response.status}`)
          }

          const data = await response.json()
          console.log('Upload response data:', data)

          if (data.publicUrl) {
            newUrls.push(data.publicUrl)
          } else {
            throw new Error('No public URL returned from upload')
          }
        } catch (fileError: any) {
          console.error(`Error uploading ${file.name}:`, fileError)
          setError(`Failed to upload "${file.name}": ${fileError.message}`)
          hasErrors = true
        }
      }

      if (newUrls.length > 0) {
        const updatedImages = [...images, ...newUrls]
        setImages(updatedImages)
        onUpload(updatedImages)
        
        if (!hasErrors) {
          setError("")
        }
      } else if (!hasErrors) {
        setError('No images were uploaded successfully')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
      // Reset input
      e.target.value = ''
    }
  }, [images, maxFiles, onUpload])

  const removeImage = useCallback((index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onUpload(updatedImages)
  }, [images, onUpload])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={uploading || images.length >= maxFiles}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
        <span className="text-sm text-gray-400">
          {images.length}/{maxFiles} images
        </span>
      </div>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-white">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Uploading images...</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/20 bg-white/5">
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error('Image load error:', e)
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-white/25 rounded-lg p-8 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-400">
            Click "Upload Images" to add plot images
          </p>
        </div>
      )}
    </div>
  )
}
