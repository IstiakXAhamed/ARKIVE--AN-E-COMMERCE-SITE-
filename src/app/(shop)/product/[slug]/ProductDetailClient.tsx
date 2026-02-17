"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/ui-button";
import { useCartStore } from "@/stores/cart";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductData } from "@/lib/db/types";
import { ProductReviews } from "@/components/ProductReviews";

interface ProductDetailProps {
  product: ProductData;
  relatedProducts: ProductData[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
      },
      quantity
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

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
            <Link
              href={`/category/${product.categorySlug}`}
              className="hover:text-emerald-600 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {product.badge && (
                  <span
                    className={cn(
                      "absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold uppercase rounded-lg text-white",
                      product.badge === "sale" && "bg-red-500",
                      product.badge === "new" && "bg-emerald-500",
                      product.badge === "flash" &&
                        "bg-gradient-to-r from-amber-500 to-red-500"
                    )}
                  >
                    {product.badge === "sale" && `-${discount}%`}
                    {product.badge === "new" && "New"}
                    {product.badge === "flash" && "Flash Sale"}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">
                {product.category}
                {product.subcategory && ` / ${product.subcategory}`}
              </span>

              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={cn(
                          i < Math.floor(product.rating!)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl md:text-4xl font-bold text-emerald-600">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                        Save {discount}%
                      </span>
                    </>
                  )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-6 leading-relaxed text-sm md:text-base">
                {product.description ||
                  `Discover the elegance of ${product.name}. Crafted with premium materials and meticulous attention to detail, this piece is perfect for any occasion. A must-have addition to your collection.`}
              </p>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {/* Quantity Selector */}
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center font-semibold text-gray-800 border-x-2 border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart */}
                <Button
                  size="lg"
                  className="flex-1 shadow-lg shadow-emerald-500/20"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  {addedToCart
                    ? "Added to Cart!"
                    : `Add to Cart — ৳${(product.price * quantity).toLocaleString()}`}
                </Button>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "flex items-center gap-2 mt-4 text-sm font-medium transition-colors",
                  isWishlisted
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500"
                )}
              >
                <Heart
                  size={18}
                  className={cn(isWishlisted && "fill-red-500")}
                />
                {isWishlisted
                  ? "Added to Wishlist"
                  : "Add to Wishlist"}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck
                    size={20}
                    className="text-emerald-500"
                  />
                  <span className="text-xs text-gray-500">
                    Fast Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield
                    size={20}
                    className="text-emerald-500"
                  />
                  <span className="text-xs text-gray-500">
                    Authentic Product
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw
                    size={20}
                    className="text-emerald-500"
                  />
                  <span className="text-xs text-gray-500">
                    Easy Returns
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Customer Reviews */}
          <ProductReviews productId={product.id} productName={product.name} />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 md:mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {relatedProducts.map((rp) => (
                  <motion.div
                    key={rp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                      <Link
                        href={`/product/${rp.slug}`}
                        className="block relative aspect-square overflow-hidden"
                      >
                        <Image
                          src={rp.image}
                          alt={rp.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </Link>
                      <div className="p-3 md:p-4">
                        <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400">
                          {rp.category}
                        </span>
                        <h3 className="font-semibold text-gray-800 mt-0.5 text-sm md:text-base line-clamp-1">
                          <Link href={`/product/${rp.slug}`}>{rp.name}</Link>
                        </h3>
                        <span className="text-sm md:text-lg font-bold text-emerald-500">
                          ৳{rp.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
