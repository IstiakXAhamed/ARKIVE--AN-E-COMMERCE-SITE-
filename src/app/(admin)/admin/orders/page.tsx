"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

const statusOptions = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const demoOrders = [
  { id: "ORD-1024", customer: "Fatima Rahman", email: "fatima@email.com", items: 3, total: 4240, status: "Processing", payment: "bKash", date: "2026-02-12" },
  { id: "ORD-1023", customer: "Karim Hassan", email: "karim@email.com", items: 1, total: 4500, status: "Shipped", payment: "COD", date: "2026-02-12" },
  { id: "ORD-1022", customer: "Nusrat Jahan", email: "nusrat@email.com", items: 2, total: 1640, status: "Delivered", payment: "Nagad", date: "2026-02-11" },
  { id: "ORD-1021", customer: "Arif Hossain", email: "arif@email.com", items: 1, total: 1950, status: "Processing", payment: "bKash", date: "2026-02-11" },
  { id: "ORD-1020", customer: "Sadia Akter", email: "sadia@email.com", items: 4, total: 5700, status: "Pending", payment: "COD", date: "2026-02-11" },
  { id: "ORD-1019", customer: "Rafiq Islam", email: "rafiq@email.com", items: 2, total: 2650, status: "Delivered", payment: "bKash", date: "2026-02-10" },
  { id: "ORD-1018", customer: "Tasnim Ferdous", email: "tasnim@email.com", items: 1, total: 890, status: "Cancelled", payment: "Nagad", date: "2026-02-10" },
  { id: "ORD-1017", customer: "Mehedi Hasan", email: "mehedi@email.com", items: 3, total: 3800, status: "Delivered", payment: "COD", date: "2026-02-09" },
];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = demoOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track customer orders ({demoOrders.length} total)
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === s
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-600">{order.items}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-gray-900">৳{order.total.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-600">{order.payment}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing {filtered.length} of {demoOrders.length} orders</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400" disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
