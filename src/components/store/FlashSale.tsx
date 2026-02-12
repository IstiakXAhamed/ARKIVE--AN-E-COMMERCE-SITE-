"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { useCartStore } from "@/stores/cart";
import { Timer, Flame } from "lucide-react";
import type { Product } from "@/lib/data";

interface FlashSaleProps {
  products: Product[];
  endDate?: Date;
}

export function FlashSale({ products, endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }: FlashSaleProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const flashProducts = products.filter((p) => p.badge === "flash").slice(0, 4);

  if (flashProducts.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 md:gap-4"
          >
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 backdrop-blur rounded-xl md:rounded-2xl flex items-center justify-center">
              <Flame className="text-white" size={20} />
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                Flash Sale
              </h2>
              <p className="text-white/80 text-xs md:text-base">Limited time offers!</p>
            </div>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <Timer className="text-white hidden sm:block" size={20} />
            <div className="flex gap-1.5 md:gap-2">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hrs" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Sec" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="bg-white text-gray-900 font-bold text-sm md:text-xl w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <span className="text-white/80 text-[10px] md:text-xs mt-1 block">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {flashProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              category={product.category}
              badge="flash"
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
