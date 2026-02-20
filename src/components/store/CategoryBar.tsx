"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  emoji?: string | null
  icon?: string | null
  image?: string | null
}

interface CategoryBarProps {
  categories: Category[]
  className?: string
}

const defaultCategories: Category[] = [
  { id: "1", name: "Women", slug: "women", emoji: "👩" },
  { id: "2", name: "Men", slug: "men", emoji: "👨" },
  { id: "3", name: "Unisex", slug: "unisex", emoji: "🤝" },
  { id: "4", name: "Stationery", slug: "stationery", emoji: "✏️" },
  { id: "5", name: "Combos", slug: "combos", emoji: "🎁" },
]

export function CategoryBar({ categories = defaultCategories, className }: CategoryBarProps) {
  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">
          Shop by Category
        </h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar justify-start sm:justify-center">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="flex flex-col items-center gap-2 group min-w-[80px]"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-3xl sm:text-4xl shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105 overflow-hidden border-2 border-transparent group-hover:border-emerald-200">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{category.emoji || category.icon || "📦"}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors whitespace-nowrap text-center">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
