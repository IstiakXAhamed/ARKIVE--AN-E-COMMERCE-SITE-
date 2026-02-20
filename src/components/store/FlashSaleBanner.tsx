"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Flame, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "./ProductCard"
import { cn } from "@/lib/utils"

interface FlashSaleBannerProps {
  sale: {
    id: string
    name: string
    discountPercent: number
    endTime: string
    products: {
      product: {
        id: string
        name: string
        slug: string
        basePrice?: number
        salePrice?: number | null
        price?: number
        compareAtPrice?: number | null
        // Support both image formats
        product_images?: { url: string; alt?: string | null }[]
        images?: (string | { url: string; alt?: string })[]
        category?: { name: string } | null
        categories?: { name: string } | null
      }
    }[]
  } | null
  className?: string
}

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime).getTime() - new Date().getTime()
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4" />
      <div className="flex gap-1">
        <span className="bg-white text-red-600 px-2 py-1 rounded font-mono font-bold">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="text-white">:</span>
        <span className="bg-white text-red-600 px-2 py-1 rounded font-mono font-bold">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="text-white">:</span>
        <span className="bg-white text-red-600 px-2 py-1 rounded font-mono font-bold">
          {formatNumber(timeLeft.seconds)}
        </span>
      </div>
    </div>
  )
}

export function FlashSaleBanner({ sale, className }: FlashSaleBannerProps) {
  if (!sale) return null

  return (
    <section className={cn("py-12 bg-gradient-to-r from-red-500 to-red-600", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                🔥 {sale.name}
              </h2>
              <p className="text-red-100">
                Up to {sale.discountPercent}% OFF
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <CountdownTimer endTime={sale.endTime} />
            <Link href="/flash-sale">
              <Button variant="secondary" className="bg-white text-red-600 hover:bg-red-50">
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sale.products.slice(0, 5).map(({ product }, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-3"
            >
              <ProductCard product={product} />
              <Badge className="mt-2 bg-red-500 text-white w-full justify-center">
                -{sale.discountPercent}% OFF
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
