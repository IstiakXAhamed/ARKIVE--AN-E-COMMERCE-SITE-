import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/store/ProductGrid";
import { demoProducts, categories } from "@/lib/data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = demoProducts.filter(
    (p) => p.categorySlug === slug
  );

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link
              href="/shop"
              className="hover:text-emerald-600 transition-colors"
            >
              Shop
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-gradient-to-r from-emerald-50 to-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {category.name}
              </h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                {category.count}+ products available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      {categoryProducts.length > 0 ? (
        <ProductGrid products={categoryProducts} />
      ) : (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 text-lg">
              No products found in this category yet.
            </p>
            <Link
              href="/shop"
              className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Browse all products
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
