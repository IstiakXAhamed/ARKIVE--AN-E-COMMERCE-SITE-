/**
 * Product Queries for ARKIVE
 */
import { prisma } from "@/lib/prisma";
import { demoProducts } from "@/lib/data";
import type { ProductData } from "./types";

/**
 * Map Prisma product to UI product data
 */
function mapProductToData(product: any): ProductData {
  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
  
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    originalPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
    image: primaryImage?.url || "/placeholder-product.jpg",
    category: product.category?.name || "Uncategorized",
    categorySlug: product.category?.slug || "uncategorized",
    subcategory: product.subcategory || undefined,
    badge: product.badge || undefined,
    rating: product.rating ? Number(product.rating) : undefined,
    reviewsCount: product.reviewsCount || 0,
    description: product.description || undefined,
    stock: product.stock || 0,
    images: product.images?.map((img: any) => ({
      id: img.id,
      url: img.url,
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
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.warn("Database not connected, using demo products");
    return demoProducts.map((p) => ({
      ...p,
      id: String(p.id),
    })) as ProductData[];
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: true,
        category: true,
      },
    });

    if (!product) return null;
    return mapProductToData(product);
  } catch (error) {
    console.warn("Database not connected, using demo products");
    const product = demoProducts.find((p) => p.slug === slug);
    if (!product) return null;
    return {
      ...product,
      id: String(product.id),
    } as ProductData;
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
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.warn("Database not connected, using demo products");
    return demoProducts
      .filter((p) => p.categorySlug === categorySlug)
      .map((p) => ({
        ...p,
        id: String(p.id),
      })) as ProductData[];
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
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.warn("Database not connected, using demo products");
    return demoProducts
      .filter((p) => p.badge === "new" || p.badge === "sale")
      .slice(0, 8)
      .map((p) => ({
        ...p,
        id: String(p.id),
      })) as ProductData[];
  }
}

/**
 * Get flash sale products (badge = 'flash')
 */
export async function getFlashSaleProducts(): Promise<ProductData[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, badge: "flash" },
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.warn("Database not connected, using demo products");
    return demoProducts
      .filter((p) => p.badge === "flash")
      .slice(0, 4)
      .map((p) => ({
        ...p,
        id: String(p.id),
      })) as ProductData[];
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
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.warn("Database not connected, using demo products");
    return demoProducts
      .filter((p) => p.categorySlug === categorySlug && p.slug !== currentSlug)
      .slice(0, limit)
      .map((p) => ({
        ...p,
        id: String(p.id),
      })) as ProductData[];
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
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.warn("Database not connected, using demo products");
    return demoProducts
      .slice(0, limit)
      .map((p) => ({
        ...p,
        id: String(p.id),
      })) as ProductData[];
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
          { subcategory: { contains: query } },
        ],
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return products.map(mapProductToData);
  } catch (error) {
    console.warn("Database not connected, using demo products");
    return demoProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
      .map((p) => ({
        ...p,
        id: String(p.id),
      })) as ProductData[];
  }
}
