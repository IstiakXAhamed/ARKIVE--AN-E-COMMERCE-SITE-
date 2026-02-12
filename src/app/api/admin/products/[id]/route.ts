import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/products/[id] - Get single product
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDesc: product.shortDesc,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        stock: product.stock,
        lowStockAlert: product.lowStockAlert,
        weight: product.weight ? Number(product.weight) : null,
        categoryId: product.categoryId,
        categoryName: product.category?.name,
        subcategory: product.subcategory,
        tags: product.tags,
        badge: product.badge,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        rating: Number(product.rating),
        reviewsCount: product.reviewsCount,
        salesCount: product.salesCount,
        images: product.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
        })),
      },
    });
  } catch (error) {
    console.error("GET product error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const {
      name,
      slug,
      description,
      shortDesc,
      price,
      compareAtPrice,
      costPrice,
      stock,
      lowStockAlert,
      weight,
      categoryId,
      subcategory,
      tags,
      badge,
      isActive,
      isFeatured,
      metaTitle,
      metaDescription,
      images,
    } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: slug || name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description,
        shortDesc,
        price: price ? parseFloat(price) : undefined,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        lowStockAlert: lowStockAlert ? parseInt(lowStockAlert) : undefined,
        weight: weight ? parseFloat(weight) : null,
        categoryId,
        subcategory,
        tags,
        badge,
        isActive,
        isFeatured,
        metaTitle,
        metaDescription,
      },
    });

    // Update images if provided
    if (images && Array.isArray(images)) {
      // Delete existing images
      await prisma.productImage.deleteMany({ where: { productId: id } });
      // Create new images
      await prisma.productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId: id,
          url: img.url,
          alt: img.alt || name,
          sortOrder: index,
          isPrimary: index === 0,
        })),
      });
    }

    return NextResponse.json({ product: { id: product.id, slug: product.slug } });
  } catch (error) {
    console.error("PUT product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] - Soft delete (set isActive = false)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
