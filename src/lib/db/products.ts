/**
 * Product Queries for ARKIVE
 */
import { prisma } from "@/lib/prisma";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import type { ProductData } from "./types";

/**
 * Map Prisma product to UI product data
 */
function mapProductToData(product: any): ProductData {
  // Ensure images is an array (handle JSON field)
  const images = Array.isArray(product.images) ? product.images : [];

  // Find primary image or fallback to first image
  const primaryImage = images.find((img: any) => img.isPrimary) || images[0];
  const rawImageUrl = primaryImage?.url || "/placeholder-product.jpg";
  
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined, // Fixed: use originalPrice field name from schema
    image: getOptimizedImageUrl(rawImageUrl, 800), // Optimized for product cards
    category: product.category?.name || "Uncategorized",
    categorySlug: product.category?.slug || "uncategorized",
    subcategory: product.subcategory || undefined,
    badge: product.badge || undefined,
    rating: product.rating ? Number(product.rating) : undefined,
    reviewsCount: product.reviewsCount || 0,
    description: product.description || undefined,
    shortDesc: product.shortDesc || undefined,
    metaDescription: product.metaDescription || undefined,
    stock: product.stock || 0,
    images: images.map((img: any) => ({
      id: img.id || Math.random().toString(), // Handle missing ID in JSON
      url: getOptimizedImageUrl(img.url, 1200), // Larger size for gallery
      alt: img.alt || product.name,
      isPrimary: img.isPrimary,
    })),
  };
}

/**
 * Get all active products
 */
export async function getProducts(): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: { name: true, slug: true }
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug }, // start with unique constraint
      include: {
        category: true,
      },
    });

    // Check active status manually since findUnique only accepts unique fields
    if (!product || !product.isActive) return null;

    return mapProductToData(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: categorySlug },
      },
      include: {
        category: {
          select: { name: true, slug: true }
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

/**
 * Get featured products (marked as featured)
 */
export async function getFeaturedProducts(): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        category: {
          select: { name: true, slug: true }
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

/**
 * Get flash sale products (badge = 'flash')
 */
export async function getFlashSaleProducts(): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, badge: "FLASH" }, // Case sensitive usually, schema says string
      include: {
        category: {
          select: { name: true, slug: true }
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.error("Error fetching flash sale products:", error);
    return [];
  }
}

/**
 * Get related products (same category, different product)
 */
export async function getRelatedProducts(categorySlug: string, currentSlug: string, limit = 4): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: categorySlug },
        NOT: { slug: currentSlug },
      },
      include: {
        category: {
          select: { name: true, slug: true }
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

/**
 * Get new arrivals (most recent products)
 */
export async function getNewArrivals(limit = 8): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: { name: true, slug: true }
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          // subcategory might not exist in schema, removing to be safe or check schema
          // { subcategory: { contains: query } }, 
        ],
      },
      include: {
        category: {
          select: { name: true, slug: true }
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}
