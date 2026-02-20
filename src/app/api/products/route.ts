import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

// ============================================
// VALIDATION SCHEMAS
// ============================================

// Image validation schema
const ImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
})

// Variant validation schema
const VariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  options: z.string().min(1, "Options are required"),
})

// Main product creation schema
const CreateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  description: z.string().optional(),
  shortDesc: z.string().max(500).optional(),
  categoryId: z.string().min(1, "Category ID is required"),
  price: z.number().positive("Price must be positive"),
  compareAtPrice: z.number().optional(),
  costPrice: z.number().optional(),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative("Stock must be non-negative").optional().default(0),
  lowStockAlert: z.number().int().positive().optional().default(5),
  weight: z.number().optional(),
  subcategory: z.string().optional(),
  tags: z.string().optional(),
  specs: z.string().optional(),
  badge: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  metaTitle: z.string().max(160).optional(),
  metaDescription: z.string().max(320).optional(),
  // Nested arrays
  images: z.array(ImageSchema).optional().default([]),
  variants: z.array(VariantSchema).optional().default([]),
})

type CreateProductInput = z.infer<typeof CreateProductSchema>

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate unique slug by appending random suffix if slug already exists
 */
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let exists = await prisma.products.findUnique({ where: { slug } })

  if (!exists) {
    return slug
  }

  // Slug exists, append random suffix
  let attempts = 0
  while (exists && attempts < 5) {
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    slug = `${baseSlug}-${randomSuffix}`
    exists = await prisma.products.findUnique({ where: { slug } })
    attempts++
  }

  if (exists) {
    // Fallback: use UUID if still colliding
    slug = `${baseSlug}-${uuidv4().substring(0, 8)}`
  }

  return slug
}

/**
 * Serialize product for response (convert Decimal to number)
 */
function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    weight: product.weight ? Number(product.weight) : null,
    rating: product.rating ? Number(product.rating) : 0,
    basePrice: product.price ? Number(product.price) : 0,
    salePrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    images: product.product_images?.map((img: any) => ({
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
    })) || [],
    category: product.categories || { name: "Uncategorized" },
    variants: product.product_variants?.map((v: any) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: Number(v.price),
      stock: v.stock,
      options: v.options,
    })) || [],
    _count: {
      variants: product.product_variants?.length || 0,
      images: product.product_images?.length || 0,
    },
  }
}

// ============================================
// GET ENDPOINT - List products
// ============================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")

    const where: any = { isActive: true }

    if (category) {
      where.categories = { slug: category }
    }

    if (featured === "true") {
      where.isFeatured = true
    }

    if (search) {
      where.OR = [{ name: { contains: search } }, { description: { contains: search } }]
    }

    const productsRaw = await prisma.products.findMany({
      where,
      include: {
        categories: { select: { id: true, name: true, slug: true } },
        product_variants: true,
        product_images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    })

    const products = productsRaw.map(serializeProduct)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Products GET error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// ============================================
// POST ENDPOINT - Create product (ROBUST)
// ============================================

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. AUTHENTICATION CHECK
    const session = await auth()
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Only ADMIN or SUPERADMIN can create products." },
        { status: 401 }
      )
    }

    // ✅ 2. PARSE AND VALIDATE REQUEST BODY
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    let input: CreateProductInput
    try {
      input = CreateProductSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validationError.errors.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        )
      }
      throw validationError
    }

    // ✅ 3. VERIFY CATEGORY EXISTS
    const category = await prisma.categories.findUnique({
      where: { id: input.categoryId },
    })
    if (!category) {
      return NextResponse.json(
        { error: `Category with ID '${input.categoryId}' does not exist` },
        { status: 404 }
      )
    }

    // ✅ 4. GENERATE UNIQUE SLUG
    const uniqueSlug = await generateUniqueSlug(input.slug)

    // ✅ 5. PREPARE PRODUCT ID
    const productId = uuidv4()

    // ✅ 6. ATOMIC TRANSACTION: Create product, images, and variants
    const result = await prisma.$transaction(async (tx) => {
      // Create the product
      const product = await tx.products.create({
        data: {
          id: productId,
          name: input.name,
          slug: uniqueSlug,
          description: input.description,
          shortDesc: input.shortDesc,
          categoryId: input.categoryId,
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          costPrice: input.costPrice,
          sku: input.sku,
          stock: input.stock,
          lowStockAlert: input.lowStockAlert,
          weight: input.weight,
          subcategory: input.subcategory,
          tags: input.tags,
          specs: input.specs,
          badge: input.badge,
          isFeatured: input.isFeatured,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          isActive: true,
          updatedAt: new Date(),
        },
      })

      // Create product images if provided
      if (input.images && input.images.length > 0) {
        await tx.product_images.createMany({
          data: input.images.map((img, index) => ({
            id: uuidv4(),
            productId,
            url: img.url,
            alt: img.alt || input.name,
            isPrimary: img.isPrimary || index === 0,
            sortOrder: index,
          })),
        })
      }

      // Create product variants if provided
      if (input.variants && input.variants.length > 0) {
        await tx.product_variants.createMany({
          data: input.variants.map((variant) => ({
            id: uuidv4(),
            productId,
            name: variant.name,
            sku: variant.sku || `${input.sku || productId}-${variant.name}`,
            price: variant.price,
            stock: variant.stock,
            options: variant.options,
          })),
        })
      }

      // Fetch complete product with relations for response
      const completeProduct = await tx.products.findUnique({
        where: { id: productId },
        include: {
          product_images: { orderBy: { sortOrder: "asc" } },
          product_variants: true,
          categories: true,
        },
      })

      return completeProduct
    })

    // ✅ 7. SERIALIZE AND RETURN RESPONSE
    const serialized = serializeProduct(result)

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product: serialized,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Products POST error:", error)

    // Handle Prisma-specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json(
          { error: "A product with this name or SKU already exists" },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      {
        error: "Failed to create product. Please check your input and try again.",
      },
      { status: 500 }
    )
  }
}
