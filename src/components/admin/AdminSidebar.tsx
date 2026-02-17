"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  Sparkles,
  Tag,
  Menu,
  X,
  Layout,
  ShieldAlert,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Storefront", href: "/admin/storefront", icon: Layout },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "AI Tools", href: "/admin/ai-tools", icon: Sparkles },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "left-0" : "-left-64 lg:left-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <Link href="/admin" className="font-display text-xl font-bold text-gray-900 tracking-tight">
              ARKIVE
            </Link>
          )}
          
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <X size={18} />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "shrink-0 transition-colors",
                    active ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600"
                  )} 
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Super Console Link */}
          {isSuperAdmin && (
            <Link
              href="/admin/super-console"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group mt-6",
                isActive("/admin/super-console")
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-red-50 hover:text-red-700"
              )}
              title={collapsed ? "Super Console" : undefined}
            >
              <ShieldAlert 
                size={20} 
                className={cn(
                  "shrink-0 transition-colors",
                  isActive("/admin/super-console") ? "text-red-600" : "text-gray-400 group-hover:text-red-600"
                )} 
              />
              {!collapsed && <span>Super Console</span>}
            </Link>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-200 space-y-1">
          {/* Back to Store */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-all group"
            title={collapsed ? "Back to Store" : undefined}
          >
            <Store size={20} className="shrink-0 text-emerald-500" />
            {!collapsed && <span>Back to Store</span>}
            {!collapsed && <ExternalLink size={14} className="ml-auto text-emerald-400" />}
          </Link>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all group"
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut size={20} className="shrink-0 text-gray-400 group-hover:text-red-500" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
