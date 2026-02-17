import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Helper to check admin role
async function checkAdmin(req: NextRequest) {
  const session = await auth();
  if (
    !session?.user ||
    !["ADMIN", "SUPERADMIN"].includes(session.user.role)
  ) {
    return null;
  }
  return session.user;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (category && category !== "all") {
      where.categorySlug = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      shortDesc,
      price,
      originalPrice,
      categoryId,
      image,
      images,
      stock,
      sku,
      isFeatured,
      isNew,
      isOnSale,
      isActive,
      metaTitle,
      metaDescription,
      metaKeywords,
      productType,
      variants,
    } = body;

    // Basic Validation
    if (!name || !price || !categoryId || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Product slug already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description,
        shortDesc: shortDesc || description.substring(0, 160),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        categoryId,
        image,
        images: images || [], // JSON array
        stock: parseInt(stock) || 0,
        sku: sku || null,
        isFeatured: isFeatured || false,
        isNew: isNew || true,
        isOnSale: isOnSale || !!(originalPrice && parseFloat(originalPrice) > parseFloat(price)),
        isActive: isActive !== false,
        metaTitle,
        metaDescription,
        metaKeywords,
        productType: productType || "clothing",
        variants: {
          create: variants?.map((v: any) => ({
            name: v.name || `${v.attributes?.size || ""} ${v.attributes?.color || ""}`.trim() || "Variant",
            sku: v.sku || null,
            price: v.price ? parseFloat(v.price) : null,
            stock: parseInt(v.stock) || 0,
            attributes: v.attributes || {},
          })) || [],
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("CREATE product error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Product with this SKU or slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
