# ARKIVE Admin Code Snippets

Ready-to-use code patterns extracted from SilkMart for ARKIVE implementation.

---

## 1. Product Variant Manager Component

```typescript
// src/components/admin/VariantManager.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

type Variant = {
  size: string
  color: string
  stock: number
  sku: string
  price?: number
  salePrice?: number
}

interface VariantManagerProps {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
  hasColor?: boolean
  productName?: string
  sizeLabel?: string
  colorLabel?: string
}

export default function VariantManager({
  variants,
  onChange,
  hasColor = true,
  productName = '',
  sizeLabel = 'Size',
  colorLabel = 'Color'
}: VariantManagerProps) {
  
  const addVariant = () => {
    onChange([...variants, { 
      size: '', 
      color: hasColor ? '' : 'Default', 
      stock: 0, 
      sku: '' 
    }])
  }

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = variants.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    )
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Product Variants</h4>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No variants added yet</p>
          <Button type="button" variant="ghost" onClick={addVariant} className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add First Variant
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Variant {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs">{sizeLabel}</Label>
                  <Input
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    placeholder="e.g., M"
                    className="h-9"
                  />
                </div>

                {hasColor && (
                  <div>
                    <Label className="text-xs">{colorLabel}</Label>
                    <Input
                      value={variant.color}
                      onChange={(e) => updateVariant(index, 'color', e.target.value)}
                      placeholder="e.g., Red"
                      className="h-9"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="h-9"
                  />
                </div>

                <div>
                  <Label className="text-xs">SKU</Label>
                  <Input
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    placeholder="Auto-generated"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 2. Image Uploader Component

```typescript
// src/components/admin/ImageUploader.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, Upload, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast({
        title: 'Too many images',
        description: `Maximum ${maxImages} images allowed`,
        variant: 'destructive'
      })
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
          toast({
            title: 'Upload failed',
            description: error.error || 'Failed to upload image',
            variant: 'destructive'
          })
        }
      }

      onChange([...images, ...newImages])
      
      toast({
        title: 'Success',
        description: `${newImages.length} image(s) uploaded`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive'
      })
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
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
```

---

## 3. Upload API Route

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // 2. Parse Form Data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 10MB)' },
        { status: 400 }
      )
    }

    // 3. Cloudinary Upload (if configured)
    const useCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET

    if (useCloudinary) {
      const { v2: cloudinary } = await import('cloudinary')

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      })

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      return new Promise<NextResponse>((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `arkive/${folder}`,
            resource_type: 'auto'
          },
          (error: any, result: any) => {
            if (error) {
              console.error('Cloudinary Error:', error)
              resolve(
                NextResponse.json(
                  { error: error.message || 'Upload failed' },
                  { status: 500 }
                )
              )
            } else {
              resolve(
                NextResponse.json({
                  success: true,
                  url: result?.secure_url,
                  publicId: result?.public_id,
                  fileName: file.name,
                  size: file.size,
                  type: file.type
                })
              )
            }
          }
        )
        uploadStream.end(buffer)
      })
    } else {
      // 4. Local Fallback (Dev Only)
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${timestamp}_${sanitizedName}`

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filePath = path.join(uploadDir, fileName)
      await writeFile(filePath, buffer)

      return NextResponse.json({
        success: true,
        url: `/uploads/${folder}/${fileName}`,
        fileName,
        type: file.type,
        warning: 'Using local storage. Configure Cloudinary for production.'
      })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 4. Admin Middleware Helper

```typescript
// src/lib/admin-auth.ts
import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function checkAdmin(request?: NextRequest) {
  const session = await auth()
  
  if (!session?.user) {
    return { authorized: false, user: null }
  }

  const userRole = session.user.role?.toUpperCase()
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN'

  if (!isAdmin) {
    return { authorized: false, user: null }
  }

  return { authorized: true, user: session.user }
}

export function unauthorized() {
  return NextResponse.json(
    { error: 'Unauthorized. Admin access required.' },
    { status: 401 }
  )
}

export function forbidden() {
  return NextResponse.json(
    { error: 'Forbidden. Insufficient permissions.' },
    { status: 403 }
  )
}
```

---

## 5. Create Product API Route

```typescript
// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin, unauthorized } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET - List Products
export async function GET(request: NextRequest) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        include: {
          category: true,
          variants: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.products.count()
    ])

    // Parse images from JSON
    const productsWithImages = products.map((p) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }))

    return NextResponse.json({
      products: productsWithImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Get products error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create Product
export async function POST(request: NextRequest) {
  const { authorized, user } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      categoryId,
      basePrice,
      salePrice,
      images,
      isFeatured,
      isBestseller,
      isActive,
      variants
    } = body

    // Validation
    if (!name || !slug || !description || !categoryId || !basePrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const product = await prisma.products.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        images: JSON.stringify(images || []),
        isFeatured: isFeatured || false,
        isBestseller: isBestseller || false,
        isActive: isActive !== false,
        variants: {
          create:
            variants?.map((v: any) => ({
              size: v.size,
              color: v.color,
              sku: v.sku || `${slug}-${v.size}-${v.color}`,
              stock: parseInt(v.stock) || 0,
              price: v.price ? parseFloat(v.price) : null,
              salePrice: v.salePrice ? parseFloat(v.salePrice) : null
            })) || []
        }
      },
      include: {
        category: true,
        variants: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 6. Update Product API Route

```typescript
// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin, unauthorized } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// PUT - Update Product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const body = await request.json()
    const {
      name,
      description,
      categoryId,
      basePrice,
      salePrice,
      images,
      isFeatured,
      isBestseller,
      isActive,
      variants
    } = body

    const product = await prisma.products.update({
      where: { id: params.id },
      data: {
        name,
        description,
        categoryId,
        basePrice: parseFloat(basePrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        images: JSON.stringify(images || []),
        isFeatured,
        isBestseller,
        isActive,
        variants: {
          deleteMany: {}, // Delete existing variants
          create:
            variants?.map((v: any) => ({
              size: v.size,
              color: v.color,
              sku: v.sku || `${params.id}-${v.size}-${v.color}-${Date.now()}`,
              stock: parseInt(v.stock) || 0,
              price: v.price ? parseFloat(v.price) : null,
              salePrice: v.salePrice ? parseFloat(v.salePrice) : null
            })) || []
        }
      },
      include: {
        category: true,
        variants: true
      }
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete Product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    // Delete variants first
    await prisma.productVariants.deleteMany({
      where: { productId: params.id }
    })

    // Then delete product
    await prisma.products.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

---

## 7. Order Detail Page Structure

```typescript
// src/app/(admin)/admin/orders/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const STATUS_OPTIONS = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
]

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export default function OrderDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
        setStatus(data.order.status)
        setTrackingNumber(data.order.trackingNumber || '')
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrder = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber })
      })

      if (res.ok) {
        toast({ title: 'Order updated successfully' })
        fetchOrder()
      } else {
        toast({ title: 'Failed to update order', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error updating order', variant: 'destructive' })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!order) {
    return <div className="text-center py-20">Order not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
        <p className="text-muted-foreground">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">৳{item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>৳{order.shippingCost}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>৳{order.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-semibold">{order.user?.name || 'Guest'}</p>
                <p className="text-sm text-muted-foreground">
                  {order.user?.email || order.guestEmail}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-semibold">{order.address?.name}</p>
              <p>{order.address?.address}</p>
              <p>
                {order.address?.city}, {order.address?.district}
              </p>
              <p>{order.address?.phone}</p>
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>Update Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Tracking Number</Label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>

              <Button
                onClick={updateOrder}
                disabled={updating}
                className="w-full"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Order'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

---

## Usage Notes

1. **Install Dependencies**: `npm install cloudinary`
2. **Environment Variables**: Add Cloudinary credentials to `.env`
3. **Database**: Run Prisma migrations after updating schema
4. **Testing**: Test upload functionality with local fallback first
5. **Production**: Ensure Cloudinary is configured before deploying

These snippets are production-ready and follow SilkMart's proven patterns while adapting to ARKIVE's structure.
