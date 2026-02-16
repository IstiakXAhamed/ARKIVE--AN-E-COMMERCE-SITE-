"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Settings,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const accountLinks = [
  {
    label: "My Orders",
    href: "/account/orders",
    icon: Package,
    description: "Track and manage your orders",
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
    description: "Your saved items",
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
    description: "Manage shipping addresses",
  },
  {
    label: "Settings",
    href: "/account/settings",
    icon: Settings,
    description: "Update profile and preferences",
  },
];

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  // Check if user is admin
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN";

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ... (Header) */}

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Admin Dashboard Button (Only for Admins) */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Admin Dashboard</h3>
                      <p className="text-emerald-100 text-sm">Manage products, orders, and users</p>
                    </div>
                  </div>
                  <Link 
                    href="/admin" 
                    className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Profile Card */}
            {/* ... (rest of the code) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-emerald-600 font-bold text-2xl">
                      {session?.user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-800 text-lg truncate">
                    {session?.user?.name || "User"}
                  </h2>
                  <p className="text-gray-500 text-sm truncate">
                    {session?.user?.email}
                  </p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-md">
                    {(session?.user as { role?: string })?.role || "Customer"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {accountLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-4 p-4 md:p-5 hover:bg-gray-50 transition-colors ${
                      index !== accountLinks.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">
                        {link.label}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {link.description}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </Link>
                );
              })}
            </motion.div>

            {/* Continue Shopping + Sign Out */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/shop" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  <ShoppingBag size={18} />
                  Continue Shopping
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="flex-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleSignOut}
                loading={signingOut}
              >
                <LogOut size={18} />
                {signingOut ? "Signing out..." : "Sign Out"}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
