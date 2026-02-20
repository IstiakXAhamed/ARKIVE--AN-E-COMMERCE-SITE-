"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

interface NewsletterSectionProps {
  className?: string
}

export function NewsletterSection({ className }: NewsletterSectionProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    toast.success("Successfully subscribed! Check your inbox for a welcome discount.")
    setEmail("")
    setIsLoading(false)
  }

  return (
    <section className={cn("py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900", className)}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-emerald-300 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Exclusive Offers
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          
          <p className="text-gray-300 mb-8">
            Get the latest updates on new collections, exclusive deals, and styling tips delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6"
            >
              {isLoading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-gray-400 mt-4">
            Join 10,000+ subscribers. No spam, unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
