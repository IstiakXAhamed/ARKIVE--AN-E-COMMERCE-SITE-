"use client"

import { useState, useEffect } from "react"
import { Shield, Users, Settings, CreditCard, Smartphone, Bell, Database, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/sonner"
import Link from "next/link"

interface SystemStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
}

export default function SuperConsolePage() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/super-console/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast.error("Failed to load system stats")
    } finally {
      setIsLoading(false)
    }
  }

  const modules = [
    { 
      title: "User Management", 
      icon: Users, 
      href: "/admin/users",
      description: "Manage admins, customers, and permissions",
      color: "bg-blue-500"
    },
    { 
      title: "Site Settings", 
      icon: Settings, 
      href: "/admin/settings",
      description: "Configure store identity, contact info, SEO",
      color: "bg-emerald-500"
    },
    { 
      title: "Payment Gateways", 
      icon: CreditCard, 
      href: "/admin/settings?tab=payment",
      description: "Manage COD, bKash, Nagad, Bank transfer",
      color: "bg-purple-500"
    },
    { 
      title: "PWA Controls", 
      icon: Smartphone, 
      href: "/admin/settings?tab=pwa",
      description: "Configure app banner, install button",
      color: "bg-orange-500"
    },
    { 
      title: "Notifications", 
      icon: Bell, 
      href: "/admin/notifications",
      description: "Send push notifications to users",
      color: "bg-red-500"
    },
    { 
      title: "System Backup", 
      icon: Database, 
      href: "#",
      description: "Backup and restore database",
      color: "bg-gray-600"
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-emerald-600" />
            SuperAdmin Console
          </h1>
          <p className="text-gray-500 mt-1">System administration and configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            SuperAdmin Access
          </span>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : stats?.totalUsers || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : stats?.totalOrders || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ৳{isLoading ? "..." : (stats?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : stats?.totalProducts || 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.title} href={module.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${module.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/products/new">
              <Button>Add New Product</Button>
            </Link>
            <Link href="/admin/coupons/new">
              <Button variant="outline">Create Coupon</Button>
            </Link>
            <Link href="/admin/flash-sales/new">
              <Button variant="outline">Create Flash Sale</Button>
            </Link>
            <Button variant="outline" onClick={() => toast.info("Cache cleared!")}>
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
