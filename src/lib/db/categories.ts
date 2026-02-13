
import { prisma } from "@/lib/prisma";

export interface CategoryWithCount {
  name: string;
  slug: string;
  icon: string;
  count: number;
}

/**
 * Get all active categories with product counts
 */
export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return categories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "📦",
      count: cat._count.products,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
