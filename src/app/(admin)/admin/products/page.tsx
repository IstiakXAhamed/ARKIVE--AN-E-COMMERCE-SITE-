"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { demoProducts } from "@/lib/data";

const statusOptions = ["All", "Active", "Draft", "Out of Stock"];

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = demoProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product catalog ({demoProducts.length} products)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
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

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => {
                const stock = product.stock ?? Math.floor(Math.random() * 50) + 5;
                const status = stock > 10 ? "Active" : stock > 0 ? "Low Stock" : "Out of Stock";
                const statusColor =
                  status === "Active"
                    ? "bg-emerald-100 text-emerald-700"
                    : status === "Low Stock"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700";

                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.subcategory}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="block text-xs text-gray-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-600">{stock}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() => setOpenMenu(openMenu === String(product.id) ? null : String(product.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenu === String(product.id) && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10">
                            <Link
                              href={`/product/${product.slug}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setOpenMenu(null)}
                            >
                              <Eye size={14} /> View
                            </Link>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setOpenMenu(null)}
                            >
                              <Edit size={14} /> Edit
                            </Link>
                            <button
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              onClick={() => setOpenMenu(null)}
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {demoProducts.length} products
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-medium">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50" disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
