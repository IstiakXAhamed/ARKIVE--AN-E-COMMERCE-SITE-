"use client";

import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  Mail,
  MoreVertical,
} from "lucide-react";

const demoCustomers = [
  { id: 1, name: "Fatima Rahman", email: "fatima@email.com", role: "USER", orders: 8, spent: 24500, joined: "2025-11-12", avatar: "F" },
  { id: 2, name: "Karim Hassan", email: "karim@email.com", role: "USER", orders: 5, spent: 18200, joined: "2025-12-05", avatar: "K" },
  { id: 3, name: "Nusrat Jahan", email: "nusrat@email.com", role: "USER", orders: 12, spent: 42800, joined: "2025-09-20", avatar: "N" },
  { id: 4, name: "Arif Hossain", email: "arif@email.com", role: "USER", orders: 3, spent: 9500, joined: "2026-01-03", avatar: "A" },
  { id: 5, name: "Sadia Akter", email: "sadia@email.com", role: "USER", orders: 15, spent: 56000, joined: "2025-08-15", avatar: "S" },
  { id: 6, name: "Admin User", email: "admin@arkive.com", role: "ADMIN", orders: 0, spent: 0, joined: "2025-06-01", avatar: "A" },
  { id: 7, name: "Rafiq Ahmed", email: "rafiq@email.com", role: "USER", orders: 7, spent: 15300, joined: "2025-10-28", avatar: "R" },
  { id: 8, name: "Tasnim Islam", email: "tasnim@email.com", role: "USER", orders: 2, spent: 4200, joined: "2026-02-01", avatar: "T" },
];

const roleColors: Record<string, string> = {
  USER: "bg-gray-100 text-gray-600",
  ADMIN: "bg-emerald-100 text-emerald-700",
  SUPERADMIN: "bg-purple-100 text-purple-700",
};

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filtered = demoCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your customer base ({demoCustomers.length} customers)
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm shrink-0">
                        {customer.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[customer.role]}`}>
                      {customer.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-600">{customer.orders}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-gray-900">৳{customer.spent.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-500">{customer.joined}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setOpenMenu(openMenu === customer.id ? null : customer.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === customer.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10">
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Mail size={14} /> Send Email
                          </button>
                          <button
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Shield size={14} /> Change Role
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing {filtered.length} of {demoCustomers.length} customers</p>
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
