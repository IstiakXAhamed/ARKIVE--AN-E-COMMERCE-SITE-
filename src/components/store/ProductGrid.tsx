"use client"

import { motion } from "framer-motion"
import { ProductCard } from "./ProductCard"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number | null
  // Support both product_images relation and images array
  product_images?: { url: string; alt?: string | null }[]
  images?: (string | { url: string; alt?: string })[]
  categories?: { name: string } | null
}

interface ProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
  className?: string
  columns?: 2 | 3 | 4 | 5
}

export function ProductGrid({
  products,
  title,
  subtitle,
  className,
  columns = 4,
}: ProductGridProps) {
  const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  }

  return (
    <section className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        <div className={cn("grid gap-4 sm:gap-6", columnClasses[columns])}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
