"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

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

          const uploadResponse = await fetch('/api/storage/upload', {
            method: 'POST',
            body: formData,
          })

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            setError(`Upload failed for "${file.name}": ${errorText}`)
            hasErrors = true
            continue
          }

          const result = await uploadResponse.json()
          if (result.url) {
            newUrls.push(result.url)
          } else {
            setError(`No URL returned for "${file.name}"`)
            hasErrors = true
          }
        } catch (error: any) {
          setError(`Error uploading "${file.name}": ${error.message}`)
          hasErrors = true
        }
      }

      if (newUrls.length > 0) {
        const updatedImages = [...images, ...newUrls]
        setImages(updatedImages)
        onUpload(updatedImages)
      } else if (hasErrors) {
        // Still call onUpload with current images if there were errors
        onUpload(images)
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
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading || images.length >= maxFiles}
      />

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3">
          <div className="text-sm text-red-600 whitespace-pre-line">{error}</div>
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