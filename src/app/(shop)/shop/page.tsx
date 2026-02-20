import { prisma } from "@/lib/prisma"
import { ProductGrid } from "@/components/store/ProductGrid"
import { Breadcrumb } from "@/components/layout/Breadcrumb"

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

async function getShopData() {
  const [productsRaw, categories] = await Promise.all([
    prisma.products.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        product_images: true,
        categories: { select: { name: true } },
      },
    }),
    prisma.categories.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ])

  // Serialize products to convert Decimal to plain numbers
  const products = productsRaw.map(serializeProduct)

  return { products, categories }
}

export default async function ShopPage() {
  const { products, categories } = await getShopData()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Shop" }]} className="mb-6" />
      
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          All Products
        </h1>
        <p className="text-gray-600">
          Discover our curated collection of {products.length} premium products
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/shop"
          className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium"
        >
          All
        </a>
        {categories.map((category) => (
          <a
            key={category.id}
            href={`/category/${category.slug}`}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
          >
            {category.name}
          </a>
        ))}
      </div>

      <ProductGrid products={products} columns={4} />
    </div>
  )
}
