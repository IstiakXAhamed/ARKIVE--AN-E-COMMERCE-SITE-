"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroItem {
  id: string
  position: number
  title: string
  subtitle: string | null
  imageUrl: string
  link: string
}

interface HeroSectionProps {
  heroItems: HeroItem[]
}

export function HeroSection({ heroItems }: HeroSectionProps) {
  // Fallback items if none provided
  const items = heroItems && heroItems.length > 0 ? heroItems : [
    { id: '1', title: 'Premium Jewelry', subtitle: 'Featured', imageUrl: '/hero-image.jpg', link: '/category/jewelry', position: 1 },
    { id: '2', title: 'Watches', subtitle: '50+ Styles', imageUrl: '/hero-image.jpg', link: '/category/watches', position: 2 },
    { id: '3', title: 'Rings', subtitle: '100+ Designs', imageUrl: '/hero-image.jpg', link: '/category/rings', position: 3 },
  ]

  // Sort by position to ensure correct layout mapping
  const sortedItems = [...items].sort((a, b) => a.position - b.position)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left z-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              New Collection 2026
            </motion.div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Discover Your
              <span className="block text-emerald-600">Perfect Style</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Explore our curated collection of premium jewelry and accessories. Find pieces that speak to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shop">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/flash-sale">
                <Button size="lg" variant="outline" className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  ⚡ Flash Sale
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gray-200 pt-8 lg:border-none lg:pt-0">
              <div>
                <div className="font-display text-2xl lg:text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Happy Customers</div>
              </div>
              <div>
                <div className="font-display text-2xl lg:text-3xl font-bold text-gray-900">500+</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Products</div>
              </div>
              <div>
                <div className="font-display text-2xl lg:text-3xl font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Authentic</div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Content - 3 Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full min-h-[400px] lg:min-h-[500px]">
            {/* First item - Top Wide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="col-span-1 sm:col-span-2 relative group overflow-hidden rounded-3xl shadow-lg bg-white h-[240px] lg:h-[280px]"
            >
              <Link href={sortedItems[0]?.link || '#'} className="block w-full h-full">
                <div className="absolute inset-0">
                   {/* Background Image */}
                   <Image
                    src={sortedItems[0]?.imageUrl || '/hero-image.jpg'}
                    alt={sortedItems[0]?.title || 'Featured'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                </div>
                
                {/* Content Box */}
                <div className="absolute bottom-6 left-6 right-6">
                  {sortedItems[0]?.subtitle && (
                    <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2 py-1 rounded-md mb-2 inline-block">
                      {sortedItems[0].subtitle}
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-bold text-gray-900">
                    {sortedItems[0]?.title}
                  </h3>
                  {/* Optional Price or Tag line if needed */}
                  <div className="text-sm text-gray-600 mt-1">
                    Starting from ৳1,500
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Second item - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-1 relative group overflow-hidden rounded-3xl shadow-lg bg-white h-[200px] lg:h-[220px]"
            >
              <Link href={sortedItems[1]?.link || '#'} className="block w-full h-full">
                 <div className="absolute inset-0">
                   <Image
                    src={sortedItems[1]?.imageUrl || '/hero-image.jpg'}
                    alt={sortedItems[1]?.title || 'Featured'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">
                    {sortedItems[1]?.title}
                  </h3>
                   {sortedItems[1]?.subtitle && (
                    <p className="text-xs text-emerald-600 font-medium">
                      {sortedItems[1].subtitle}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>

            {/* Third item - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="col-span-1 relative group overflow-hidden rounded-3xl shadow-lg bg-white h-[200px] lg:h-[220px]"
            >
              <Link href={sortedItems[2]?.link || '#'} className="block w-full h-full">
                <div className="absolute inset-0">
                   <Image
                    src={sortedItems[2]?.imageUrl || '/hero-image.jpg'}
                    alt={sortedItems[2]?.title || 'Featured'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">
                    {sortedItems[2]?.title}
                  </h3>
                  {sortedItems[2]?.subtitle && (
                    <p className="text-xs text-emerald-600 font-medium">
                      {sortedItems[2].subtitle}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
       {/* Background Decorations */}
       <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none" />
       <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
    </section>
  )
}
