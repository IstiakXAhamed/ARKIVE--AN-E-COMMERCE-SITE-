"use client";

import { useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { useCartStore } from "@/stores/cart";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductData } from "@/lib/db/types";
import type { CategoryWithCount } from "@/lib/db/categories";

interface ShopClientProps {
  products: ProductData[];
  categories: CategoryWithCount[];
}

export function ShopClient({ products, categories }: ShopClientProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.categorySlug === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        // Default sort (newest) is already applied by DB
        return 0;
    }
  });

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-emerald-50 to-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Shop All
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Explore our complete collection of premium jewelry & accessories
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  activeCategory === "all"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    activeCategory === cat.slug
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-100 text-sm rounded-xl px-3 py-2 border-0 focus:ring-2 focus:ring-emerald-500 text-gray-700"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-500 mb-6">
            Showing {sortedProducts.length} product
            {sortedProducts.length !== 1 ? "s" : ""}
          </p>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {sortedProducts.map((product) => (
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
