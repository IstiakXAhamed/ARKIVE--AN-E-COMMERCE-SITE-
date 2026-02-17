"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, X, ImagePlus } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    price: "",
    compareAtPrice: "",
    costPrice: "",
    stock: "0",
    lowStockAlert: "5",
    categoryId: "",
    subcategory: "",
    tags: "",
    badge: "",
    isActive: true,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  });

  // Fetch categories from DB
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
        else if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => console.error("Failed to load categories"));
  }, []);

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

  const handleImageUploaded = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Product name is required"); return; }
    if (!form.price || parseFloat(form.price) <= 0) { setError("Valid price is required"); return; }
    if (!form.categoryId) { setError("Category is required"); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: images.map((url, i) => ({ url, alt: form.name, isPrimary: i === 0 })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="form-label">Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="e.g. Elegant Pearl Earrings" required />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Slug</label>
              <input type="text" name="slug" value={form.slug} onChange={handleChange} className="form-input bg-gray-50" placeholder="auto-generated-from-name" />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Short Description</label>
              <input type="text" name="shortDesc" value={form.shortDesc} onChange={handleChange} className="form-input" placeholder="Brief one-line summary" maxLength={500} />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Full Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="form-input resize-none" placeholder="Write a detailed product description..." />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="form-label">Price (৳) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="form-input" placeholder="0" required min="0" step="0.01" />
            </div>
            <div>
              <label className="form-label">Compare at Price (৳)</label>
              <input type="number" name="compareAtPrice" value={form.compareAtPrice} onChange={handleChange} className="form-input" placeholder="0" min="0" step="0.01" />
              <p className="text-xs text-gray-400 mt-1">Original price (for showing discount)</p>
            </div>
            <div>
              <label className="form-label">Cost Price (৳)</label>
              <input type="number" name="costPrice" value={form.costPrice} onChange={handleChange} className="form-input" placeholder="0" min="0" step="0.01" />
              <p className="text-xs text-gray-400 mt-1">For profit tracking</p>
            </div>
            <div>
              <label className="form-label">Stock Quantity</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} className="form-input" placeholder="0" min="0" />
            </div>
            <div>
              <label className="form-label">Low Stock Alert</label>
              <input type="number" name="lowStockAlert" value={form.lowStockAlert} onChange={handleChange} className="form-input" placeholder="5" min="0" />
            </div>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="form-label">Category *</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="form-input" required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Subcategory</label>
              <input type="text" name="subcategory" value={form.subcategory} onChange={handleChange} className="form-input" placeholder="e.g. Earrings, Ring" />
            </div>
            <div>
              <label className="form-label">Badge</label>
              <select name="badge" value={form.badge} onChange={handleChange} className="form-input">
                <option value="">No badge</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="flash">Flash Sale</option>
                <option value="bestseller">Bestseller</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Tags (comma-separated)</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} className="form-input" placeholder="e.g. gold, elegant, wedding" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              Active (visible in store)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              Featured (shown on homepage)
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
                {i === 0 && (
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PRIMARY</span>
                )}
                <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <div className="aspect-square">
                <ImageUpload value="" onChange={handleImageUploaded} />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400">Upload up to 8 images. First image is the primary image.</p>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">SEO (Optional)</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Meta Title</label>
              <input type="text" name="metaTitle" value={form.metaTitle} onChange={handleChange} className="form-input" placeholder="SEO title for search engines" maxLength={160} />
            </div>
            <div>
              <label className="form-label">Meta Description</label>
              <textarea name="metaDescription" value={form.metaDescription} onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))} rows={2} className="form-input resize-none" placeholder="Brief SEO description" maxLength={320} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/products" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50">
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
