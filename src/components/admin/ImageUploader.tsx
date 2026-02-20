'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  folder?: string
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  folder = 'products'
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    const newImages: string[] = []

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (res.ok) {
          const data = await res.json()
          if (data.success && data.url) {
            newImages.push(data.url)
          }
        } else {
          const error = await res.json()
          toast.error(error.error || 'Failed to upload image')
        }
      }

      onChange([...images, ...newImages])
      
      toast.success(`${newImages.length} image(s) uploaded`)
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square border rounded-lg overflow-hidden group"
          >
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 
                       opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label
            className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center 
                     justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-2">Upload</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {images.length} / {maxImages} images uploaded
      </p>
    </div>
  )
}
