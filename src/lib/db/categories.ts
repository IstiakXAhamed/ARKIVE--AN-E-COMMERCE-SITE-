/**
 * Category Queries for ARKIVE
 */
import { prisma } from "@/lib/prisma";
import { demoProducts, categories as demoCategories } from "@/lib/data";
import type { CategoryData } from "./types";

/**
 * Get all active categories with product counts
 */
export async function getCategories(): Promise<CategoryData[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "📦",
      count: cat._count.products,
      image: cat.image || undefined,
    }));
  } catch (error) {
    console.warn("Database not connected, using demo categories");
    // Fallback to demo data
    return demoCategories.map((cat, index) => ({
      id: String(index + 1),
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      count: cat.count,
    }));
  }
}

/**
 * Get category by slug with product count
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon || "📦",
      count: category._count.products,
      image: category.image || undefined,
    };
  } catch (error) {
    console.warn("Database not connected, using demo categories");
    const cat = demoCategories.find((c) => c.slug === slug);
    if (!cat) return null;
    return {
      id: "demo",
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      count: cat.count,
    };
  }
}
