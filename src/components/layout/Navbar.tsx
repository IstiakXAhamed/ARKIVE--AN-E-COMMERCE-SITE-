"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, Search, ShoppingBag, User, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/stores/cartStore"

interface NavbarProps {
  categories?: { id: string; name: string; slug: string; emoji?: string }[]
}

export function Navbar({ categories = [] }: NavbarProps) {
  const { data: session } = useSession()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const cartItemsCount = useCartStore((state) => state.items.length)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-left">
                <Link href="/" className="flex items-center gap-2">
                  <span className="font-display text-2xl font-bold text-emerald-600">
                    𝓐𝓡𝓚𝓘𝓥𝓔
                  </span>
                </Link>
              </SheetTitle>
              <nav className="mt-8 flex flex-col gap-4">
                <Link href="/" className="text-lg font-medium hover:text-emerald-600">
                  Home
                </Link>
                <Link href="/shop" className="text-lg font-medium hover:text-emerald-600">
                  Shop All
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="text-lg font-medium hover:text-emerald-600"
                  >
                    {category.emoji} {category.name}
                  </Link>
                ))}
                <Link href="/flash-sale" className="text-lg font-medium hover:text-emerald-600 text-red-500">
                  🔥 Flash Sale
                </Link>
                <Link href="/about" className="text-lg font-medium hover:text-emerald-600">
                  About
                </Link>
                <Link href="/contact" className="text-lg font-medium hover:text-emerald-600">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 w-32 sm:h-14 sm:w-40">
              <Image
                src="/logo.png"
                alt="ARKIVE"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Shop All
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-sm font-medium hover:text-emerald-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/flash-sale" className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
              Flash Sale
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={cn(
              "flex items-center gap-2 transition-all duration-300",
              isSearchOpen ? "w-full sm:w-auto" : "w-auto"
            )}>
              {isSearchOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-[200px] sm:w-[300px]"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {isMounted && cartItemsCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>

            {/* Account */}
            {session ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetTitle>My Account</SheetTitle>
                  <nav className="mt-8 flex flex-col gap-4">
                    <p className="text-sm text-gray-500">Hello, {session.user?.name}</p>
                    <Link href="/account" className="text-lg font-medium hover:text-emerald-600">
                      Dashboard
                    </Link>
                    <Link href="/account/orders" className="text-lg font-medium hover:text-emerald-600">
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="text-lg font-medium hover:text-emerald-600">
                      Wishlist
                    </Link>
                    <Link href="/account/addresses" className="text-lg font-medium hover:text-emerald-600">
                      Addresses
                    </Link>
                     <Link href="/account/profile" className="text-lg font-medium hover:text-emerald-600">
                       Profile Settings
                     </Link>
                    {session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPERADMIN' ? (
                      <Link href="/admin" className="text-lg font-medium hover:text-emerald-600 text-emerald-600">
                        Admin Panel
                      </Link>
                    ) : null}
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      Sign Out
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
