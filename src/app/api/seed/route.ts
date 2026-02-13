import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoProducts, categories } from "@/lib/data";

export async function GET() {
  try {
    // 1. Seed Categories
    console.log("Seeding categories...");
    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        create: {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          description: `All ${cat.name} products`,
        },
        update: {
          name: cat.name,
          icon: cat.icon,
        },
      });
    }

    // 2. Seed Products
    console.log("Seeding products...");
    for (const p of demoProducts) {
      // Find category id
      const category = await prisma.category.findUnique({
        where: { slug: p.categorySlug },
      });

      if (!category) {
        console.warn(`Category not found for product ${p.name}: ${p.categorySlug}`);
        continue;
      }

      const product = await prisma.product.upsert({
        where: { slug: p.slug },
        create: {
          name: p.name,
          slug: p.slug,
          description: p.description || `Beautiful ${p.name} for your collection.`,
          price: p.price,
          compareAtPrice: p.originalPrice,
          categoryId: category.id,
          subcategory: p.subcategory,
          badge: p.badge,
          stock: p.stock || 10,
          isActive: true,
          rating: p.rating || 0,
          reviewsCount: p.reviewsCount || 0,
        },
        update: {
          price: p.price,
          compareAtPrice: p.originalPrice,
          badge: p.badge,
          stock: p.stock || 10,
        },
      });

      // 3. Seed Images (Primary)
      if (p.image) {
        await prisma.productImage.deleteMany({
            where: { productId: product.id }
        });
        
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: p.image,
            isPrimary: true,
            alt: p.name,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
