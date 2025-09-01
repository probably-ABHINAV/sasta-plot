"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getBrowserSupabase } from "@/lib/supabase/browser"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void
  maxFiles?: number
  currentImages?: string[]
}

export function ImageUploader({ onUpload, maxFiles = 5, currentImages = [] }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(currentImages)

  const uploadImages = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = getBrowserSupabase()
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('plots')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('plots')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
      }

      const newImages = [...images, ...uploadedUrls].slice(0, maxFiles)
      setImages(newImages)
      onUpload(newImages)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [images, maxFiles, onUpload])

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onUpload(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && uploadImages(e.target.files)}
          disabled={uploading || images.length >= maxFiles}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading || images.length >= maxFiles}
          onClick={() => document.querySelector('input[type="file"]')?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload Images
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length >= maxFiles && (
        <p className="text-sm text-muted-foreground">
          Maximum {maxFiles} images allowed
        </p>
      )}
    </div>
  )
}