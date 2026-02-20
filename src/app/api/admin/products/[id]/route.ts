import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin, unauthorized } from '@/lib/admin-auth'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

// GET - Get Single Product (Admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        categories: true,
        product_variants: true,
        product_images: { orderBy: { sortOrder: 'asc' } }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Serialize for response - use product_images as primary source
    const serialized = {
      ...product,
      images: product.product_images?.length > 0
        ? product.product_images.map(img => img.url)
        : ((product as any).images ? JSON.parse((product as any).images as string) : []),
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      costPrice: product.costPrice ? Number(product.costPrice) : null,
      weight: product.weight ? Number(product.weight) : null,
      product_variants: product.product_variants.map((v: any) => ({
        ...v,
        price: v.price ? Number(v.price) : null,
        salePrice: v.salePrice ? Number(v.salePrice) : null
      }))
    }

    return NextResponse.json(serialized)
  } catch (error: any) {
    console.error('[Admin] Get product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update Product (Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const body = await request.json()
    const {
      name,
      description,
      shortDesc,
      categoryId,
      price,
      compareAtPrice,
      costPrice,
      sku,
      stock,
      lowStockAlert,
      weight,
      subcategory,
      tags,
      specs,
      badge,
      isActive,
      isFeatured,
      metaTitle,
      metaDescription,
      images,
      variants
    } = body

    // Check if product exists
    const existing = await prisma.products.findUnique({
      where: { id: productId }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Use transaction to update product with images and variants
    const product = await prisma.$transaction(async (tx) => {
      // Update the product
      const updatedProduct = await tx.products.update({
        where: { id: productId },
        data: {
          name,
          description,
          shortDesc,
          categoryId,
          price: price ? parseFloat(price) : undefined,
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          costPrice: costPrice ? parseFloat(costPrice) : null,
          sku,
          stock: stock !== undefined ? parseInt(stock) : undefined,
          lowStockAlert: lowStockAlert !== undefined ? parseInt(lowStockAlert) : undefined,
          weight: weight ? parseFloat(weight) : null,
          subcategory,
          tags: tags && tags !== "" ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : "[]",
          specs: specs && specs !== "" ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : "{}",
          badge,
          isActive,
          isFeatured,
          metaTitle,
          metaDescription,
          images: images && images.length > 0 ? JSON.stringify(images) : "[]",
          updatedAt: new Date(),
        } as any
      })

      // Delete existing product_images and create new ones
      if (images && images.length > 0) {
        await tx.product_images.deleteMany({
          where: { productId: productId }
        })
        
        await tx.product_images.createMany({
          data: images.map((url: string, index: number) => ({
            id: uuidv4(),
            productId: productId,
            url,
            alt: name,
            isPrimary: index === 0,
            sortOrder: index
          }))
        })
      }

      // Delete existing variants and create new ones
      if (variants !== undefined) {
        await tx.product_variants.deleteMany({
          where: { productId: productId }
        })
        
        if (variants.length > 0) {
          await tx.product_variants.createMany({
            data: variants.map((v: any) => ({
              id: uuidv4(),
              productId: productId,
              size: v.size,
              color: v.color,
              sku: v.sku || `${existing.slug}-${v.size}-${v.color}-${Date.now()}`,
              stock: parseInt(v.stock) || 0,
              price: v.price ? parseFloat(v.price) : null,
              salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
              createdAt: new Date(),
              updatedAt: new Date()
            }))
          })
        }
      }

      // Fetch updated product with relations
      return tx.products.findUnique({
        where: { id: productId },
        include: {
          categories: true,
          product_variants: true,
          product_images: { orderBy: { sortOrder: 'asc' } }
        }
      })
    })

    // Serialize for response
    const serialized = {
      ...product,
      images: product?.product_images?.map(img => img.url) || [],
      price: Number(product?.price),
      compareAtPrice: product?.compareAtPrice ? Number(product.compareAtPrice) : null,
      costPrice: product?.costPrice ? Number(product.costPrice) : null,
      weight: product?.weight ? Number(product.weight) : null,
      product_variants: product?.product_variants?.map((v: any) => ({
        ...v,
        price: v.price ? Number(v.price) : null,
        salePrice: v.salePrice ? Number(v.salePrice) : null
      })) || []
    }

    return NextResponse.json(serialized)
  } catch (error: any) {
    console.error('[Admin] Update product error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A product with this slug or SKU already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete Product (Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: productId } = await params
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    // Check if product exists
    const product = await prisma.products.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product (cascade will handle variants, images, etc.)
    await prisma.products.delete({
      where: { id: productId }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error: any) {
    console.error('[Admin] Delete product error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
