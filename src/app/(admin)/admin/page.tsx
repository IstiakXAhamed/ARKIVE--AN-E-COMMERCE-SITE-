"use client";

import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  DollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Demo data for charts
const revenueData = [
  { month: "Jul", revenue: 28000, orders: 45 },
  { month: "Aug", revenue: 35000, orders: 52 },
  { month: "Sep", revenue: 42000, orders: 61 },
  { month: "Oct", revenue: 38000, orders: 55 },
  { month: "Nov", revenue: 52000, orders: 78 },
  { month: "Dec", revenue: 68000, orders: 94 },
  { month: "Jan", revenue: 61000, orders: 85 },
];

const categoryData = [
  { name: "Women", sales: 420 },
  { name: "Men", sales: 280 },
  { name: "Unisex", sales: 190 },
  { name: "Stationery", sales: 130 },
  { name: "Combos", sales: 85 },
];

const recentOrders = [
  { id: "ORD-1024", customer: "Fatima Rahman", total: 2450, status: "Processing", date: "2 min ago" },
  { id: "ORD-1023", customer: "Karim Hassan", total: 4500, status: "Shipped", date: "18 min ago" },
  { id: "ORD-1022", customer: "Nusrat Jahan", total: 890, status: "Delivered", date: "1 hr ago" },
  { id: "ORD-1021", customer: "Arif Hossain", total: 1950, status: "Processing", date: "2 hr ago" },
  { id: "ORD-1020", customer: "Sadia Akter", total: 3500, status: "Pending", date: "3 hr ago" },
];

const topProducts = [
  { name: "Elegant Pearl Earrings", sold: 48, revenue: 42720, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=80" },
  { name: "Classic Chronograph Watch", sold: 32, revenue: 144000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80" },
  { name: "Rose Gold Diamond Ring", sold: 28, revenue: 68600, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80" },
  { name: "Infinity Couple Rings", sold: 24, revenue: 46800, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=80" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const stats = [
  {
    label: "Total Revenue",
    value: "৳3,24,000",
    change: "+12.5%",
    up: true,
    icon: DollarSign,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Total Orders",
    value: "470",
    change: "+8.2%",
    up: true,
    icon: ShoppingCart,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Total Products",
    value: "156",
    change: "+3",
    up: true,
    icon: Package,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Total Customers",
    value: "1,240",
    change: "+24",
    up: true,
    icon: Users,
    color: "bg-orange-50 text-orange-600",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                    stat.up ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-500">Last 7 months</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={14} />
              +12.5%
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                  formatter={(value) => [`৳${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Sales by Category</h2>
          <p className="text-xs text-gray-500 mb-4">Product performance</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                  formatter={(value) => [Number(value), "Sales"]}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{order.customer}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-gray-900">৳{order.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Top Products</h2>
            <a href="/admin/products" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sold} sold</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">৳{product.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Orders", value: "12", color: "text-yellow-600 bg-yellow-50" },
          { label: "Low Stock Items", value: "5", color: "text-red-600 bg-red-50" },
          { label: "Today's Visitors", value: "342", color: "text-blue-600 bg-blue-50" },
          { label: "Conversion Rate", value: "3.2%", color: "text-emerald-600 bg-emerald-50" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
              <Eye size={18} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
