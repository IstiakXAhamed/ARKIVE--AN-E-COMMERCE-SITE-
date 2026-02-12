"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/stores/cart";

const SHIPPING_COST = 120;
const FREE_SHIPPING_THRESHOLD = 3000;

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCartStore();

  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <>
        <section className="bg-gradient-to-r from-emerald-50 to-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <ShoppingBag size={28} className="text-emerald-600" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                Shopping Cart
              </h1>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                Looks like you haven&apos;t added any items yet.
              </p>
              <Link href="/shop">
                <Button size="lg">Start Shopping</Button>
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-r from-emerald-50 to-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag size={28} className="text-emerald-600" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <span className="bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-2xl p-4 md:p-6 shadow-sm flex gap-4"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] md:text-xs uppercase tracking-wider text-gray-400">
                          {item.category}
                        </span>
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-1">
                          <Link href={`/product/${item.slug}`}>
                            {item.name}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-emerald-600 font-bold text-sm md:text-base">
                            ৳{item.price.toLocaleString()}
                          </span>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through">
                                ৳{item.originalPrice.toLocaleString()}
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-800 text-sm md:text-base">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-semibold text-gray-800 text-lg mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-600 font-medium">
                          Free
                        </span>
                      ) : (
                        `৳${shipping}`
                      )}
                    </span>
                  </div>
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                      Add ৳
                      {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}{" "}
                      more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                    <span>Total</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/checkout" className="block mt-6">
                  <Button size="lg" className="w-full shadow-lg shadow-emerald-500/20">
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </Button>
                </Link>

                <Link
                  href="/shop"
                  className="block text-center mt-3 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
