"use client";

import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  // Placeholder — will be connected to Zustand store + auth later
  return (
    <>
      <section className="bg-gradient-to-r from-emerald-50 to-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Heart size={28} className="text-red-500" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              My Wishlist
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <Heart size={64} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Start adding items you love and they&apos;ll show up here.
            </p>
            <Link href="/shop">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
