import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductGrid } from "@/components/store/ProductGrid"
import { Breadcrumb } from "@/components/layout/Breadcrumb"

export const dynamic = 'force-dynamic'

async function getCategoryData(slug: string) {
  const category = await prisma.categories.findUnique({
    where: { slug }
  })

  if (!category || !category.isActive) {
    return null
  }

  const products = await prisma.products.findMany({
    where: { 
      categoryId: category.id,
      isActive: true 
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      product_images: true,
      categories: { select: { name: true } }
    }
  })

  // Serialize products to convert Decimal to numbers
  const serializedProducts = products.map(product => ({
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null
  }))

  return {
    category,
    products: serializedProducts
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const data = await getCategoryData(params.slug)

  if (!data) {
    notFound()
  }

  const { category, products } = data

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: "Shop", href: "/shop" },
          { label: category.name }
        ]} 
        className="mb-6" 
      />
      
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-600 max-w-2xl">{category.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} columns={4} />
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
          <a 
            href="/shop" 
            className="text-emerald-600 hover:underline mt-2 inline-block"
          >
            Browse all products
          </a>
        </div>
      )}
    </div>
  )
}
