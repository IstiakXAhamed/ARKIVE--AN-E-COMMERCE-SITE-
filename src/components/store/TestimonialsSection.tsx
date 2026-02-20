"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: string
  name: string
  avatar?: string
  rating: number
  text: string
  location: string
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
  className?: string
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Fatima Rahman",
    rating: 5,
    text: "Absolutely love the quality of products! The churis I ordered were exactly as shown in the pictures. Fast delivery and excellent packaging.",
    location: "Dhaka",
  },
  {
    id: "2",
    name: "Nusrat Jahan",
    rating: 5,
    text: "Best online shopping experience! The customer service team was so helpful when I had questions about sizing. Will definitely shop again!",
    location: "Chittagong",
  },
  {
    id: "3",
    name: "Ayesha Khan",
    rating: 5,
    text: "The jewelry collection is amazing! I bought a necklace set for my sister's wedding and she loved it. Great value for money.",
    location: "Sylhet",
  },
  {
    id: "4",
    name: "Tasnim Ahmed",
    rating: 5,
    text: "Fast delivery and excellent quality. The bag I ordered exceeded my expectations. Thank you Arkive for such wonderful products!",
    location: "Rajshahi",
  },
]

export function TestimonialsSection({
  testimonials = defaultTestimonials,
  className,
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className={cn("py-16 bg-emerald-50", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy customers who trust Arkive for their fashion needs
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <Quote className="h-10 w-10 text-emerald-200 mb-4" />
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={testimonials[currentIndex].avatar} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                      {testimonials[currentIndex].name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-emerald-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
