"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: "sale" | "new" | "flash";
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  image,
  category,
  badge,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) {
  const router = useRouter();
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <Link href={`/product/${slug}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Badge */}
        {badge && (
          <span className={`
            absolute top-2 left-2 md:top-3 md:left-3 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-semibold uppercase rounded-md md:rounded-lg text-white
            ${badge === "sale" ? "bg-red-500" : ""}
            ${badge === "new" ? "bg-emerald-500" : ""}
            ${badge === "flash" ? "bg-gradient-to-r from-amber-500 to-red-500 animate-pulse" : ""}
          `}>
            {badge === "sale" && `-${discount}%`}
            {badge === "new" && "New"}
            {badge === "flash" && "⚡ Flash"}
          </span>
        )}

        {/* Hover Actions - Positioned at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
              className="w-9 h-9 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-500 hover:text-white transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart size={16} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                onAddToWishlist?.();
              }}
              className="w-9 h-9 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-colors"
              title="Add to Wishlist"
            >
              <Heart size={16} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickView}
              className="w-9 h-9 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-500 hover:text-white transition-colors"
              title="Quick View"
            >
              <Eye size={16} />
            </motion.button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3 md:p-4">
        <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400">
          {category}
        </span>
        
        <h3 className="font-semibold text-gray-800 mt-0.5 md:mt-1 mb-1 md:mb-2 line-clamp-1 text-sm md:text-base group-hover:text-emerald-600 transition-colors">
          <Link href={`/product/${slug}`}>{name}</Link>
        </h3>
        
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-sm md:text-lg font-bold text-emerald-500">
            ৳{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs md:text-sm text-gray-400 line-through">
              ৳{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
