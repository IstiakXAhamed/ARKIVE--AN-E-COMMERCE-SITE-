"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
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

          {/* Bento Grid Featured with Real Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Large Featured */}
              <div className="col-span-2 bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl overflow-hidden relative group">
                <div className="aspect-[16/9] bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl md:rounded-2xl overflow-hidden relative">
                  <Image
                    src="/images/jewelry-hero.png"
                    alt="Premium Jewelry Sets"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 md:mt-4">
                  <span className="text-xs uppercase tracking-wider text-emerald-600 font-semibold">Featured</span>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-1">Premium Jewelry Sets</h3>
                  <p className="text-gray-500 text-sm mt-1">Starting from ৳1,500</p>
                </div>
              </div>

              {/* Watches Card */}
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-lg group hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-square rounded-lg md:rounded-xl overflow-hidden relative">
                  <Image
                    src="/images/watches-category.png"
                    alt="Luxury Watches"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="font-semibold text-gray-800 mt-2 md:mt-3 text-sm md:text-base">Watches</h4>
                <p className="text-xs md:text-sm text-emerald-600">50+ Styles</p>
              </div>

              {/* Rings Card */}
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-lg group hover:shadow-xl transition-shadow overflow-hidden">
                <div className="aspect-square rounded-lg md:rounded-xl overflow-hidden relative">
                  <Image
                    src="/images/rings-category.png"
                    alt="Diamond Rings"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="font-semibold text-gray-800 mt-2 md:mt-3 text-sm md:text-base">Rings</h4>
                <p className="text-xs md:text-sm text-emerald-600">100+ Designs</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
