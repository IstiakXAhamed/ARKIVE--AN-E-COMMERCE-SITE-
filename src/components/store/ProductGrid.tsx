"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { useCartStore } from "@/stores/cart";
import type { Product } from "@/lib/data";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-8 md:mb-12">
            {title && (
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              category={product.category}
              badge={product.badge}
              onAddToCart={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.image,
                  category: product.category,
                })
              }
              onAddToWishlist={() => console.log("Add to wishlist:", product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
