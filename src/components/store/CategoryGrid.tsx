"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  icon: string;
  count: number;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
            Browse our curated collections
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="group block bg-gray-50 hover:bg-emerald-50 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-center transition-all duration-300 hover:shadow-lg"
              >
                <span className="text-2xl sm:text-3xl md:text-4xl mb-2 md:mb-4 block group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
                <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors text-xs sm:text-sm md:text-base">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 md:mt-1 hidden sm:block">
                  {category.count}+ Products
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
