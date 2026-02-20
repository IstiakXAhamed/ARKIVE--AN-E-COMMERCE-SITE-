import { prisma } from "@/lib/prisma"
import { HeroSection } from "@/components/store/HeroSection"
import { CategoryBar } from "@/components/store/CategoryBar"
import { FlashSaleBanner } from "@/components/store/FlashSaleBanner"
import { ProductGrid } from "@/components/store/ProductGrid"
import { FeaturesBar } from "@/components/store/FeaturesBar"
import { TestimonialsSection } from "@/components/store/TestimonialsSection"
import { NewsletterSection } from "@/components/store/NewsletterSection"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Helper to serialize products and convert Decimal to number
function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
  }
}

async function getHomepageData() {
  // Get active categories
  const categories = await prisma.categories.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      image: true,
    },
  })

  // Get active flash sales (items)
  const flashSalesRaw = await prisma.flash_sales.findMany({
    where: {
      isActive: true,
      startTime: { lte: new Date() },
      endTime: { gt: new Date() },
    },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          product_images: true,
          categories: { select: { name: true } },
        },
      },
    },
    take: 10, // Limit to 10 items for the banner
  })

  // Get Hero Grid Items
  const heroItems = await prisma.hero_grid_items.findMany({
    orderBy: { position: 'asc' },
  })

  // Construct a single "Flash Sale Event" object from the items
  let flashSale = null
  if (flashSalesRaw.length > 0) {
    const primarySale = flashSalesRaw[0]
    flashSale = {
      id: 'current-flash-sale',
      name: 'Super Sale', // Generic name since DB doesn't have event name
      discountPercent: primarySale.discountPercent,
      endTime: primarySale.endTime.toISOString(),
      products: flashSalesRaw.map(item => ({
        product: {
          id: item.products.id,
          name: item.products.name,
          slug: item.products.slug,
          basePrice: Number(item.products.price),
          price: Number(item.products.price),
          images: item.products.product_images.sort((a, b) => a.sortOrder - b.sortOrder).map(img => img.url),
          category: { name: item.products.categories.name },
          categories: { name: item.products.categories.name }
        }
      }))
    }
  }

  // Get featured products
  const featuredProductsRaw = await prisma.products.findMany({
    where: { isActive: true, isFeatured: true },
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      product_images: true,
      categories: { select: { name: true } },
    },
  })

  // Get bestsellers (top selling products)
  const bestsellersRaw = await prisma.products.findMany({
    where: { isActive: true },
    orderBy: { salesCount: 'desc' },
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      product_images: true,
      categories: { select: { name: true } },
    },
  })

  // Serialize products to convert Decimal to plain numbers
  const featuredProducts = featuredProductsRaw.map(serializeProduct)
  const bestsellers = bestsellersRaw.map(serializeProduct)

  return {
    categories,
    heroItems,
    flashSale,
    featuredProducts,
    bestsellers,
  }
}

export default async function HomePage() {
  const { categories, heroItems, flashSale, featuredProducts, bestsellers } = await getHomepageData()

  return (
    <>
      <HeroSection heroItems={heroItems} />
      
      <CategoryBar categories={categories} />
      
      {flashSale && <FlashSaleBanner sale={flashSale} />}
      
      {featuredProducts.length > 0 && (
        <ProductGrid
          products={featuredProducts}
          title="Featured Products"
          subtitle="Handpicked favorites just for you"
        />
      )}
      
      {bestsellers.length > 0 && (
        <ProductGrid
          products={bestsellers}
          title="Bestsellers"
          subtitle="Most loved by our customers"
        />
      )}
      
      <TestimonialsSection />

      <FeaturesBar />
      
      <NewsletterSection />
    </>
  )
}
