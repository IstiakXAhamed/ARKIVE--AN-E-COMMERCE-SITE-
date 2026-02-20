import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin, unauthorized } from '@/lib/admin-auth'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

// GET - List Products (Admin)
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
          categories: true,
          product_variants: true,
          product_images: { orderBy: { sortOrder: 'asc' } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.products.count()
    ])

    // Serialize products with proper image handling
    const productsWithImages = products.map((p) => ({
      ...p,
      // Use product_images relation as primary source, fallback to images JSON
      images: p.product_images?.length > 0 
        ? p.product_images.map(img => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary }))
        : ((p as any).images ? JSON.parse((p as any).images as string) : []),
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      costPrice: p.costPrice ? Number(p.costPrice) : null,
      weight: p.weight ? Number(p.weight) : null,
      product_variants: p.product_variants.map((v) => ({
        ...v,
        price: (v as any).price ? Number((v as any).price) : null,
        salePrice: (v as any).salePrice ? Number((v as any).salePrice) : null
      }))
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
    console.error('[Admin] Get products error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create Product (Admin)
export async function POST(request: NextRequest) {
  const { authorized } = await checkAdmin()
  if (!authorized) return unauthorized()

  try {
    const body = await request.json()
    const {
      name,
      slug,
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

    // Validation
    if (!name || !slug || !categoryId || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, categoryId, price' },
        { status: 400 }
      )
    }

    // Check if category exists
    const category = await prisma.categories.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: `Category with ID '${categoryId}' not found` },
        { status: 404 }
      )
    }

    const productId = uuidv4()

    // Use transaction to create product with images and variants
    const product = await prisma.$transaction(async (tx) => {
      // Create the product
      const newProduct = await tx.products.create({
        data: {
          id: productId,
          name,
          slug,
          description,
          shortDesc,
          categoryId,
          price: parseFloat(price),
          compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
          costPrice: costPrice ? parseFloat(costPrice) : null,
          sku,
          stock: stock !== undefined ? parseInt(stock) : 0,
          lowStockAlert: lowStockAlert !== undefined ? parseInt(lowStockAlert) : 5,
          weight: weight ? parseFloat(weight) : null,
          subcategory,
          tags: tags && tags !== "" ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : "[]",
          specs: specs && specs !== "" ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : "{}",
          badge,
          isActive: isActive !== false,
          isFeatured: isFeatured || false,
          metaTitle,
          metaDescription,
          images: images && images.length > 0 ? JSON.stringify(images) : "[]",
          updatedAt: new Date(),
        } as any
      })

      // Create product_images records if images provided
      if (images && images.length > 0) {
        await tx.product_images.createMany({
          data: images.map((img: any, index: number) => ({
            id: uuidv4(),
            productId,
            url: typeof img === 'string' ? img : img.url,
            alt: typeof img === 'string' ? name : (img.alt || name),
            isPrimary: typeof img === 'string' ? index === 0 : (img.isPrimary || index === 0),
            sortOrder: index
          }))
        })
      }

      // Create product variants if provided
      if (variants && variants.length > 0) {
        await tx.product_variants.createMany({
          data: variants.map((v: any) => ({
            id: uuidv4(),
            productId,
            size: v.size,
            color: v.color,
            sku: v.sku || `${slug}-${v.size}-${v.color}`,
            stock: parseInt(v.stock) || 0,
            price: v.price ? parseFloat(v.price) : null,
            salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        })
      }

      // Fetch complete product with relations
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
      images: product?.product_images?.map(img => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary })) || [],
      price: Number(product?.price),
      compareAtPrice: product?.compareAtPrice ? Number(product.compareAtPrice) : null,
      costPrice: product?.costPrice ? Number(product.costPrice) : null,
      weight: product?.weight ? Number(product.weight) : null,
      product_variants: product?.product_variants?.map((v) => ({
        ...v,
        price: (v as any).price ? Number((v as any).price) : null,
        salePrice: (v as any).salePrice ? Number((v as any).salePrice) : null
      })) || []
    }

    return NextResponse.json(serialized, { status: 201 })
  } catch (error: any) {
    console.error('[Admin] Create product error:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A product with this slug or SKU already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
