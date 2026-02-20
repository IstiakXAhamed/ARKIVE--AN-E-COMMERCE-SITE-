"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/sonner"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/stores/cartStore"
import { ProductImage } from "@/components/ui/product-image"

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    basePrice: number
    salePrice: number | null
    images: string[]
    category: { name: string }
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist")
      const data = await response.json()
      setItems(data.items || [])
    } catch (error) {
      toast.error("Failed to load wishlist")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setItems(items.filter((item) => item.id !== id))
        toast.success("Removed from wishlist")
      }
    } catch (error) {
      toast.error("Failed to remove item")
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    const imageUrl = item.product.images?.[0] && item.product.images[0] !== "" 
      ? item.product.images[0] 
      : "/placeholder.svg"
    addToCart({
      id: `${item.product.id}-${Date.now()}`,
      productId: item.product.id,
      name: item.product.name,
      price: item.product.salePrice || item.product.basePrice,
      quantity: 1,
      image: imageUrl,
    })
    toast.success("Added to cart")
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading wishlist...</div>
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h1>
          <p className="text-gray-500 mb-4">Save items you love to your wishlist.</p>
          <Link href="/shop">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
        My Wishlist ({items.length})
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="group">
            <CardContent className="p-0">
              <Link href={`/product/${item.product.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                  <ProductImage
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
              <div className="p-4">
                <p className="text-xs text-gray-500">{item.product.category.name}</p>
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-semibold text-gray-900">
                    {formatPrice(item.product.salePrice || item.product.basePrice)}
                  </span>
                  {item.product.salePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(item.product.basePrice)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
