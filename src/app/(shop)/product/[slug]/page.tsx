import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/layout/Breadcrumb"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getProduct(slug: string) {
  const product = await prisma.products.findUnique({
    where: { slug },
    include: {
      categories: true,
      product_images: true,
      reviews: {
        where: { isApproved: true },
        include: {
          user: { select: { name: true } }
        } as any,
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  } as any)

  if (!product || !product.isActive) {
    return null
  }

  return {
    ...(product as any),
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    images: (product as any).images ? JSON.parse((product as any).images as string) : []
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const productData = await getProduct(slug)

  if (!productData) {
    notFound()
  }

  // Cast to any to handle relations correctly without Type mismatch
  const product = productData as any

  // Combine images from legacy relation and new JSON field
  const allImages = [
    ...(product.product_images || []).map((img: any) => img.url),
    ...(product.images || [])
  ].filter(url => url && url !== "")

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.categories?.name || "Product" }
        ]} 
        className="mb-6" 
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {allImages.length > 0 ? (
              <Image
                src={allImages[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {allImages.map((url: string, index: number) => (
                <div 
                  key={index} 
                  className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer border-2 border-emerald-600"
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-emerald-600 font-medium mb-2">
              {product.categories?.name}
            </p>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            {/* Rating */}
            {product.reviewsCount > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.round(Number(product.rating)))}
                  {'☆'.repeat(5 - Math.round(Number(product.rating)))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviewsCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
                <Badge variant="secondary" className="text-red-600 bg-red-50">
                  Save {formatPrice(product.compareAtPrice! - product.price)}
                </Badge>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-gray-600">{product.shortDesc}</p>
          )}

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              size="lg" 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-500">Orders over ৳2000</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-500">100% secure</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-500">7-day return</p>
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Reviews */}
          {product.reviews?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.map((review: any) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
