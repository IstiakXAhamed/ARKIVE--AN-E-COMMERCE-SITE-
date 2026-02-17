"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications */}
        <Link href="/admin/orders" className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Link>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
            {session?.user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              {(session?.user as { role?: string })?.role || "ADMIN"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
