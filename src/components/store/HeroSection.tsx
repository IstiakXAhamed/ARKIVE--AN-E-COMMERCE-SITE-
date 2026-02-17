"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/ui-button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroItem {
  position: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

export function HeroSection() {
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroItems = async () => {
      try {
        const res = await fetch("/api/admin/layout/hero");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setHeroItems(data.items);
          }
        }
      } catch (err) {
        console.error("Failed to fetch hero items", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroItems();
  }, []);

  const getItem = (pos: number) => heroItems.find((i) => i.position === pos);

  // Fallback data if DB is empty or loading failed
  const mainItem = getItem(1) || {
    title: "Premium Jewelry Sets",
    subtitle: "Starting from ৳1,500",
    imageUrl: "/images/jewelry-hero.png",
    link: "/category/jewelry",
  };

  const leftItem = getItem(2) || {
    title: "Watches",
    subtitle: "50+ Styles",
    imageUrl: "/images/watches-category.png",
    link: "/category/watches",
  };

  const rightItem = getItem(3) || {
    title: "Rings",
    subtitle: "100+ Designs",
    imageUrl: "/images/rings-category.png",
    link: "/category/rings",
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 right-10 md:top-20 md:right-20 w-48 h-48 md:w-72 md:h-72 bg-emerald-200 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 w-64 h-64 md:w-96 md:h-96 bg-emerald-100 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles size={14} />
              New Collection 2026
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700">
                Perfect Style
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Explore our curated collection of premium jewelry and accessories. 
              Find pieces that speak to you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-emerald-500/30">
                  Shop Collection
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/flash-sale" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  ⚡ Flash Sale
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-gray-800">10K+</p>
                <p className="text-xs sm:text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-gray-800">500+</p>
                <p className="text-xs sm:text-sm text-gray-500">Products</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-gray-800">100%</p>
                <p className="text-xs sm:text-sm text-gray-500">Authentic</p>
              </div>
            </div>
          </motion.div>

          {/* Bento Grid Featured with Dynamic Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full mt-8 lg:mt-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {/* Large Featured (Position 1) */}
              <Link href={mainItem.link} className="col-span-1 sm:col-span-2 block group">
                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl overflow-hidden relative h-full hover:shadow-2xl transition-all">
                  <div className="aspect-[16/9] bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl md:rounded-2xl overflow-hidden relative">
                    <Image
                      src={mainItem.imageUrl}
                      alt={mainItem.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 md:mt-4">
                    <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">Featured</span>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-1">{mainItem.title}</h3>
                    {mainItem.subtitle && (
                      <p className="text-gray-500 text-sm mt-1">{mainItem.subtitle}</p>
                    )}
                  </div>
                </div>
              </Link>

              {/* Bottom Left (Position 2) */}
              <Link href={leftItem.link} className="block group">
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-lg group hover:shadow-xl transition-all overflow-hidden h-full">
                  <div className="aspect-[4/3] sm:aspect-square rounded-lg md:rounded-xl overflow-hidden relative">
                    <Image
                      src={leftItem.imageUrl}
                      alt={leftItem.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-800 mt-2 md:mt-3 text-sm md:text-base">{leftItem.title}</h4>
                  {leftItem.subtitle && (
                    <p className="text-xs md:text-sm text-emerald-600">{leftItem.subtitle}</p>
                  )}
                </div>
              </Link>

              {/* Bottom Right (Position 3) */}
              <Link href={rightItem.link} className="block group">
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-lg group hover:shadow-xl transition-all overflow-hidden h-full">
                  <div className="aspect-[4/3] sm:aspect-square rounded-lg md:rounded-xl overflow-hidden relative">
                    <Image
                      src={rightItem.imageUrl}
                      alt={rightItem.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-800 mt-2 md:mt-3 text-sm md:text-base">{rightItem.title}</h4>
                  {rightItem.subtitle && (
                    <p className="text-xs md:text-sm text-emerald-600">{rightItem.subtitle}</p>
                  )}
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
