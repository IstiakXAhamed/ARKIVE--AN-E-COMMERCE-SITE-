import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/admin/products - List products with search and pagination
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { category: { name: { contains: search } } },
        { subcategory: { contains: search } },
      ];
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "draft") {
      where.isActive = false;
    } else if (status === "outofstock") {
      where.stock = 0;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          category: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        stock: p.stock,
        status: p.stock > 10 ? "Active" : p.stock > 0 ? "Low Stock" : "Out of Stock",
        image: p.images[0]?.url || null,
        category: p.category?.name || null,
        subcategory: p.subcategory || null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/admin/products - Create new product
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Generate slug if not provided
    const productSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description,
        shortDesc,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        stock: parseInt(stock) || 0,
        lowStockAlert: parseInt(lowStockAlert) || 5,
        weight: weight ? parseFloat(weight) : null,
        categoryId,
        subcategory,
        tags,
        badge,
        isActive: isActive !== false,
        isFeatured: isFeatured === true,
        metaTitle,
        metaDescription,
      },
    });

    // Create product images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId: product.id,
          url: img.url,
          alt: img.alt || name,
          sortOrder: index,
          isPrimary: index === 0,
        })),
      });
    }

    return NextResponse.json({ product: { id: product.id, slug: product.slug } }, { status: 201 });
  } catch (error) {
    console.error("POST product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
