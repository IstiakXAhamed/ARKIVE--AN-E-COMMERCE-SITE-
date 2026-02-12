"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Save, ImagePlus } from "lucide-react";
import { categories } from "@/lib/data";

export default function NewProductPage() {
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    stock: "",
    badge: "",
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name"
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }
        : {}),
    }));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new product listing</p>
        </div>
      </div>

      <form className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Elegant Pearl Earrings"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="form-input bg-gray-50"
                placeholder="auto-generated-from-name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="form-input resize-none"
                placeholder="Write a detailed product description..."
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="form-label">Price (৳)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="form-label">Original Price (৳)</label>
              <input
                type="number"
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
              />
              <p className="text-xs text-gray-400 mt-1">Leave empty if no discount</p>
            </div>
            <div>
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Subcategory</label>
              <input
                type="text"
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Earrings, Ring"
              />
            </div>
            <div>
              <label className="form-label">Badge</label>
              <select
                name="badge"
                value={form.badge}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">No badge</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="flash">Flash Sale</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Featured product (shown on homepage)
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Product Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl border-2 border-gray-200 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors">
              <ImagePlus size={24} className="text-gray-400" />
              <span className="text-xs text-gray-500">Upload</span>
              <input type="file" accept="image/*" className="hidden" multiple />
            </label>
          </div>
          <p className="text-xs text-gray-400">
            Upload up to 8 images. First image will be the primary image. Recommended: 800x800px.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Save size={16} />
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
