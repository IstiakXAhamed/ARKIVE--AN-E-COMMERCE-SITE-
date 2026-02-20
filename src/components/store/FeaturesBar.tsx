"use client"

import { Truck, RefreshCw, Wallet, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeaturesBarProps {
  className?: string
}

const defaultFeatures: Feature[] = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Free Shipping",
    description: "Orders over ৳2,000",
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    icon: <Wallet className="h-6 w-6" />,
    title: "COD Available",
    description: "Cash on Delivery",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "100% Authentic",
    description: "Genuine products only",
  },
]

export function FeaturesBar({ className }: FeaturesBarProps) {
  return (
    <section className={cn("py-12 bg-gray-50", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
