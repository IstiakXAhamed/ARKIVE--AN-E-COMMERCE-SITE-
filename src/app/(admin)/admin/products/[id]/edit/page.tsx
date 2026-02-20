'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import ImageUploader from '@/components/admin/ImageUploader'
import VariantManager from '@/components/admin/VariantManager'

type Variant = {
  size: string
  color: string
  stock: number
  sku: string
  price?: number
  salePrice?: number
}

interface ProductFormData {
  name: string
  slug: string
  description: string
  shortDesc: string
  categoryId: string
  price: number
  compareAtPrice: number | null
  costPrice: number | null
  sku: string
  stock: number
  lowStockAlert: number
  weight: number | null
  subcategory: string
  tags: string
  specs: string
  badge: string
  isActive: boolean
  isFeatured: boolean
  metaTitle: string
  metaDescription: string
  images: string[]
  variants: Variant[]
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    categoryId: '',
    price: 0,
    compareAtPrice: null,
    costPrice: null,
    sku: '',
    stock: 0,
    lowStockAlert: 5,
    weight: null,
    subcategory: '',
    tags: '',
    specs: '',
    badge: '',
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    images: [],
    variants: []
  })

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product
        const productRes = await fetch(`/api/admin/products/${params.id}`)
        if (productRes.ok) {
          const product = await productRes.json()
          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            shortDesc: product.shortDesc || '',
            categoryId: product.categoryId || '',
            price: product.price || 0,
            compareAtPrice: product.compareAtPrice || null,
            costPrice: product.costPrice || null,
            sku: product.sku || '',
            stock: product.stock || 0,
            lowStockAlert: product.lowStockAlert || 5,
            weight: product.weight || null,
            subcategory: product.subcategory || '',
            tags: product.tags || '',
            specs: product.specs || '',
            badge: product.badge || '',
            isActive: product.isActive ?? true,
            isFeatured: product.isFeatured ?? false,
            metaTitle: product.metaTitle || '',
            metaDescription: product.metaDescription || '',
            images: product.images || [],
            variants: product.product_variants?.map((v: any) => ({
              size: v.size || '',
              color: v.color || '',
              stock: v.stock || 0,
              sku: v.sku || '',
              price: v.price || undefined,
              salePrice: v.salePrice || undefined
            })) || []
          })
        } else {
          toast.error('Failed to load product')
          router.push('/admin/products')
        }

        // Fetch categories
        const catRes = await fetch('/api/admin/categories')
        if (catRes.ok) {
          const data = await catRes.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load product')
      } finally {
        setIsFetching(false)
      }
    }
    fetchData()
  }, [params.id, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : 0
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (!formData.name || !formData.categoryId || formData.price <= 0) {
        toast.error('Please fill in all required fields: Name, Category, and Price')
        setIsLoading(false)
        return
      }

      if (formData.variants.length === 0) {
        toast.error('Please add at least one product variant')
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update product')
      }

      toast.success('Product updated successfully!')
      router.push('/admin/products')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating product:', error)
      toast.error(error.message || 'Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Edit Product
          </h1>
          <p className="text-gray-500 mt-1">Update product information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="URL-friendly slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL-friendly version of the name
                </p>
              </div>

              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="e.g., PROD-001"
                  value={formData.sku}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="shortDesc">Short Description</Label>
                <Input
                  id="shortDesc"
                  name="shortDesc"
                  placeholder="Brief product description (max 500 chars)"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  maxLength={500}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed product description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Base Price * (৳)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="compareAtPrice">Compare At Price (৳)</Label>
                <Input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  placeholder="Optional - for showing discounts"
                  value={formData.compareAtPrice || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="costPrice">Cost Price (৳)</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  placeholder="Internal cost"
                  value={formData.costPrice || ''}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              images={formData.images}
              onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
              maxImages={10}
              folder="products"
            />
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Product Variants *</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add size/color variations with individual stock and pricing
            </p>
          </CardHeader>
          <CardContent>
            <VariantManager
              variants={formData.variants}
              onChange={(variants) => setFormData((prev) => ({ ...prev, variants }))}
              hasColor={true}
              productName={formData.name}
            />
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Product is visible in store
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Featured</Label>
                <p className="text-sm text-muted-foreground">
                  Show on homepage
                </p>
              </div>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 sticky bottom-0 bg-white p-4 border-t shadow-lg">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? 'Updating...' : 'Update Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
