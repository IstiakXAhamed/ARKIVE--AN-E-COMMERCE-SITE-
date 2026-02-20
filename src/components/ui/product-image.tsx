"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ProductImageProps {
  src?: string | null
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

/**
 * ProductImage component that handles:
 * - Empty/null/undefined src values
 * - Image loading errors
 * - Placeholder fallback
 */
export function ProductImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  priority = false,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false)
  
  // Check if we have a valid image source
  const hasValidSrc = src && src !== "" && src !== "undefined" && src !== "null"
  
  // Show placeholder if no valid src or if image failed to load
  if (!hasValidSrc || hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-400",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <svg 
          className="w-1/3 h-1/3 min-w-[24px] min-h-[24px] max-w-[48px] max-h-[48px]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
    />
  )
}
