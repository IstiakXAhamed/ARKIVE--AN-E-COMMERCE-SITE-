"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { cn } from "@/lib/utils";

const SHIPPING_COST = 120;
const FREE_SHIPPING_THRESHOLD = 3000;

const divisions = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Sylhet",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

type PaymentMethod = "bkash" | "nagad" | "cod";

const paymentMethods: {
  id: PaymentMethod;
  name: string;
  description: string;
  accent: string;
  activeAccent: string;
  icon: typeof CreditCard;
}[] = [
  {
    id: "bkash",
    name: "bKash",
    description:
      "You will receive a bKash payment request on your phone after placing your order.",
    accent: "border-pink-200 bg-pink-50/50",
    activeAccent: "border-pink-500 bg-pink-50 ring-2 ring-pink-500/20",
    icon: CreditCard,
  },
  {
    id: "nagad",
    name: "Nagad",
    description:
      "A Nagad payment link will be sent to your phone number after order confirmation.",
    accent: "border-orange-200 bg-orange-50/50",
    activeAccent: "border-orange-500 bg-orange-50 ring-2 ring-orange-500/20",
    icon: CreditCard,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    description:
      "Pay in cash when your order is delivered to your doorstep. A ৳50 COD fee may apply.",
    accent: "border-gray-200 bg-gray-50/50",
    activeAccent: "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20",
    icon: Banknote,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("bkash");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace("/shop");
    }
  }, [mounted, items.length, router]);

  if (!mounted || items.length === 0) {
    return null;
  }

  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const canSubmit =
    fullName.trim() &&
    phone.trim() &&
    division &&
    city.trim() &&
    address.trim();

  const handlePlaceOrder = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    // Simulate a short delay
    await new Promise((r) => setTimeout(r, 1200));

    const orderId = `ARKIVE-${Date.now()}`;
    clearCart();
    alert(`Order placed successfully!\n\nOrder ID: #${orderId}\nTotal: ৳${total.toLocaleString()}\n\nThank you for shopping with ARKIVE!`);
    router.push("/");
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link
              href="/cart"
              className="hover:text-emerald-600 transition-colors"
            >
              Cart
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-50 to-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-emerald-600" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              Checkout
            </h1>
          </div>
          <p className="text-gray-500 mt-2 text-sm">
            Secure checkout — your information is protected
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Shipping Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Truck size={20} className="text-emerald-600" />
                  <h2 className="font-semibold text-gray-800 text-lg">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email{" "}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Division */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Division <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <select
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none"
                      >
                        <option value="">Select Division</option>
                        {divisions.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Your city"
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Full Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3.5 top-3.5 text-gray-400"
                      />
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House no, road, area, landmark..."
                        rows={2}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Order Notes{" "}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <FileText
                        size={16}
                        className="absolute left-3.5 top-3.5 text-gray-400"
                      />
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Special delivery instructions, gift wrapping, etc."
                        rows={2}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard size={20} className="text-emerald-600" />
                  <h2 className="font-semibold text-gray-800 text-lg">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const isActive = payment === method.id;
                    const Icon = method.icon;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPayment(method.id)}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                          isActive ? method.activeAccent : method.accent
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                isActive
                                  ? "border-emerald-500"
                                  : "border-gray-300"
                              )}
                            >
                              {isActive && (
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 text-sm">
                                {method.name}
                              </span>
                            </div>
                          </div>
                          <Icon
                            size={20}
                            className={cn(
                              isActive ? "text-emerald-600" : "text-gray-400"
                            )}
                          />
                        </div>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="text-xs text-gray-500 mt-2 ml-8"
                          >
                            {method.description}
                          </motion.p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-semibold text-gray-800 text-lg mb-4">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">{item.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
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

                {/* Place Order */}
                <Button
                  size="lg"
                  className="w-full mt-6 shadow-lg shadow-emerald-500/20"
                  onClick={handlePlaceOrder}
                  loading={isSubmitting}
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Place Order — ৳{total.toLocaleString()}
                    </>
                  )}
                </Button>

                {!canSubmit && (
                  <p className="text-xs text-red-400 text-center mt-2">
                    Please fill in all required fields
                  </p>
                )}

                <Link
                  href="/cart"
                  className="block text-center mt-3 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  Back to Cart
                </Link>

                {/* Trust */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <ShieldCheck size={14} />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Truck size={14} />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
