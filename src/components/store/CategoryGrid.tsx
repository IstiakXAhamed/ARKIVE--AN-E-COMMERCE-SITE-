"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface CategoryGridProps {
  categories: Category[];
}

const CATEGORY_ICONS: Record<string, string> = {
  women: "👠",
  men: "⌚",
  unisex: "💍",
  stationery: "📓",
  combos: "🎁",
  electronics: "📱",
  jewelry: "💎",
  accessories: "👜",
  perfume: "🧴",
  new: "✨",
  sale: "🏷️",
  couple: "💑",
  watch: "⌚",
  bag: "👜",
  wallet: "👛",
  footwear: "👟",
};

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((category, index) => {
             // Fallback to emoji if available, else first letter
             const icon = CATEGORY_ICONS[category.slug.toLowerCase()] || category.name.charAt(0);
             
             return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group block bg-gray-50 hover:bg-emerald-50 rounded-xl md:rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-lg h-full flex flex-col justify-center items-center"
                >
                  <div className="w-12 h-12 mb-3 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <span className="text-emerald-600 font-bold text-lg">
                      {icon}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors text-sm sm:text-base">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {category.count}+ Products
                  </p>
                  {/* DEBUG: Show slug to fix emoji mapping */}
                  <p className="text-[10px] text-red-500 mt-1">{category.slug}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
