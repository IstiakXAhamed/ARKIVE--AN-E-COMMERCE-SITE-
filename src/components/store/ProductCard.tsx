"use client"

import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/ui/product-image"
import { cn, formatPrice } from "@/lib/utils"
import { useCartStore } from "@/stores/cartStore"

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price?: number
    basePrice?: number
    salePrice?: number | null
    compareAtPrice?: number | null
    // Support both product_images relation and images array
    product_images?: { url: string; alt?: string | null }[]
    images?: (string | { url: string; alt?: string })[]
    categories?: {
      name: string
    } | null
    category?: {
      name: string
    } | null
  }
  className?: string
}

/**
 * Helper to get the first image URL from either product_images or images
 */
function getFirstImageUrl(product: ProductCardProps['product']): string | null {
  // First check product_images relation (preferred)
  if (product.product_images && product.product_images.length > 0 && product.product_images[0]?.url) {
    return product.product_images[0].url
  }
  
  // Fall back to images array
  if (product.images && product.images.length > 0) {
    const firstImg = product.images[0]
    return typeof firstImg === 'string' ? firstImg : firstImg?.url || null
  }
  
  return null
}

/**
 * Helper to get the first image alt text
 */
function getFirstImageAlt(product: ProductCardProps['product']): string {
  // First check product_images relation
  if (product.product_images && product.product_images.length > 0 && product.product_images[0]?.alt) {
    return product.product_images[0].alt
  }
  
  // Fall back to images array
  if (product.images && product.images.length > 0) {
    const firstImg = product.images[0]
    if (typeof firstImg !== 'string' && firstImg?.alt) {
      return firstImg.alt
    }
  }
  
  // Default to product name
  return product.name || 'Product Image'
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  
  // Get the effective price (with fallbacks)
  const effectivePrice = product.price ?? product.basePrice ?? product.salePrice ?? 0
  
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > effectivePrice
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - effectivePrice) / product.compareAtPrice!) * 100)
    : 0

  const imageUrl = getFirstImageUrl(product)
  const imageAlt = getFirstImageAlt(product)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const cartImageUrl = imageUrl || "/placeholder.svg"
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      quantity: 1,
      image: cartImageUrl,
    })
  }

  return (
    <Link href={`/product/${product.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <ProductImage
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{discountPercentage}%
          </Badge>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
        
        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-white text-gray-900 hover:bg-emerald-600 hover:text-white"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
        
        {/* Mobile Add Button - Always visible */}
        <div className="absolute bottom-2 right-2 lg:hidden">
          <Button 
            onClick={handleAddToCart}
            size="icon"
            className="h-10 w-10 rounded-full bg-white/90 text-gray-900 hover:bg-emerald-600 hover:text-white shadow-lg"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500">{product.categories?.name || product.category?.name || 'Category'}</p>
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            {formatPrice(effectivePrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
