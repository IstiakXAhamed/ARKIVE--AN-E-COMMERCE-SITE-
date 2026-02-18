"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, X, AlertCircle, Sparkles,
  Package, Tag, DollarSign, Image as ImageIcon, Search,
  ToggleLeft, ToggleRight, Star, Zap, Eye, EyeOff
} from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import AIProductAssist from "@/components/admin/AIProductAssist";
import VariantManager from "@/components/admin/VariantManager";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

const BADGE_OPTIONS = [
  { value: "", label: "None" },
  { value: "NEW", label: "🆕 New", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "SALE", label: "🏷️ Sale", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "FLASH", label: "⚡ Flash", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "HOT", label: "🔥 Hot", color: "bg-red-100 text-red-700 border-red-200" },
  { value: "LIMITED", label: "⏳ Limited", color: "bg-purple-100 text-purple-700 border-purple-200" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [variants, setVariants] = useState<any[]>([]);
  const [useAI, setUseAI] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    basePrice: "",
    salePrice: "",
    costPrice: "",
    stock: "0",
    lowStockAlert: "5",
    categoryId: "",
    subcategory: "",
    tags: "",
    productType: "clothing",
    badge: "",
    isActive: true,
    isFeatured: false,
    isOnSale: false,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    variantPricing: false,
  });

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
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name"
        ? {
            slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            metaTitle: value,
          }
        : {}),
    }));
  };

  const handleImageUploaded = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const discountPercent =
    form.salePrice && form.basePrice && parseFloat(form.salePrice) > parseFloat(form.basePrice)
      ? Math.round(((parseFloat(form.salePrice) - parseFloat(form.basePrice)) / parseFloat(form.salePrice)) * 100)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Product name is required"); return; }
    if (!form.basePrice || parseFloat(form.basePrice) <= 0) { setError("Valid price is required"); return; }
    if (!form.categoryId) { setError("Category is required"); return; }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        images,
        variants: variants.map((v) => ({
          ...v,
          price: v.price || (form.variantPricing ? parseFloat(form.basePrice) : null),
          stock: parseInt(v.stock.toString()) || 0,
        })),
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to create product");
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Add New Product</h1>
              <p className="text-xs text-gray-500">Fill in the details below to create a new listing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* AI Toggle */}
            <button
              type="button"
              onClick={() => setUseAI(!useAI)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                useAI
                  ? "bg-violet-50 border-violet-200 text-violet-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <Sparkles size={13} />
              {useAI ? "AI On" : "AI Off"}
            </button>
            {/* Status pill */}
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                form.isActive
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-gray-100 border-gray-200 text-gray-500"
              }`}
            >
              {form.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
              {form.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ══ LEFT — Main Content ══ */}
          <div className="xl:col-span-2 space-y-5">

            {/* ── Product Details Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Package size={16} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Product Details</h2>
                  <p className="text-xs text-gray-400">Basic information about the product</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Elegant Pearl Earrings"
                    required
                    className="w-full px-4 py-3 text-base font-medium rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Slug + Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">URL Slug</label>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="auto-generated"
                      className="w-full px-3 py-2.5 text-xs font-mono rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Product Type</label>
                    <select
                      name="productType"
                      value={form.productType}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="clothing">👗 Clothing</option>
                      <option value="footwear">👟 Footwear</option>
                      <option value="jewelry">💍 Jewelry</option>
                      <option value="accessories">👜 Accessories</option>
                      <option value="electronics">📱 Electronics</option>
                      <option value="beauty">💄 Beauty</option>
                      <option value="stationery">📓 Stationery</option>
                      <option value="general">📦 General</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Short Description</label>
                  <input
                    name="shortDesc"
                    value={form.shortDesc}
                    onChange={handleChange}
                    placeholder="One-line summary shown in product cards"
                    maxLength={200}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
                  />
                  <p className="text-xs text-gray-400 text-right">{form.shortDesc.length}/200</p>
                </div>

                {/* AI Assist */}
                {useAI && (
                  <div className="rounded-xl border border-violet-100 bg-violet-50/50 overflow-hidden">
                    <AIProductAssist
                      productName={form.name}
                      category={categories.find((c) => c.id === form.categoryId)?.name}
                      onSuggestionAccept={(field, value) => {
                        if (field === "description") setForm((p) => ({ ...p, description: value }));
                        else if (field === "tags") setForm((p) => ({ ...p, tags: value }));
                        else if (field === "seoTitle") setForm((p) => ({ ...p, metaTitle: value }));
                        else if (field === "basePrice") setForm((p) => ({ ...p, basePrice: value.toString() }));
                        else if (field === "salePrice") setForm((p) => ({ ...p, salePrice: value.toString() }));
                        else if (field === "variants") setVariants(value);
                        else if (field === "isFeatured") setForm((p) => ({ ...p, isFeatured: value }));
                      }}
                    />
                  </div>
                )}

                {/* Full Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Write a detailed product description..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* ── Product Images Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                  <ImageIcon size={16} className="text-pink-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Product Images</h2>
                  <p className="text-xs text-gray-400">Upload up to 8 images. First image is the primary.</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl border-2 border-gray-200 overflow-hidden group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          MAIN
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {images.length < 8 && (
                    <div className="aspect-square">
                      <ImageUpload value="" onChange={handleImageUploaded} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Variants Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Tag size={16} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Variants</h2>
                  <p className="text-xs text-gray-400">Sizes, colors, and stock per variant</p>
                </div>
              </div>
              <div className="p-6">
                <VariantManager
                  variants={variants}
                  onChange={setVariants}
                  productName={form.name}
                  productType={form.productType}
                  variantPricing={form.variantPricing}
                />
                <label className="mt-4 flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setForm((p) => ({ ...p, variantPricing: !p.variantPricing }))}
                    className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                      form.variantPricing ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form.variantPricing ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    Enable different prices per variant
                  </span>
                </label>
              </div>
            </div>

            {/* ── SEO Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Search size={16} className="text-teal-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">SEO Settings</h2>
                  <p className="text-xs text-gray-400">Optimize for search engines</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Meta Title</label>
                  <input
                    name="metaTitle"
                    value={form.metaTitle}
                    onChange={handleChange}
                    placeholder="SEO Title (auto-filled from name)"
                    maxLength={60}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  />
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-400">Shown in browser tab and search results</p>
                    <p className={`text-xs font-medium ${form.metaTitle.length > 55 ? "text-orange-500" : "text-gray-400"}`}>
                      {form.metaTitle.length}/60
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={form.metaDescription}
                    onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))}
                    rows={3}
                    placeholder="Brief description for search results"
                    maxLength={160}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all resize-none"
                  />
                  <p className={`text-xs font-medium text-right ${form.metaDescription.length > 150 ? "text-orange-500" : "text-gray-400"}`}>
                    {form.metaDescription.length}/160
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Meta Keywords</label>
                  <input
                    name="metaKeywords"
                    value={form.metaKeywords}
                    onChange={handleChange}
                    placeholder="jewelry, earrings, gold, women"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT — Sidebar ══ */}
          <div className="space-y-5">

            {/* ── Status Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Product Status</h2>
              </div>
              <div className="p-5 space-y-3">
                {/* Active / Inactive Toggle */}
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, isActive: true }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                    form.isActive
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${form.isActive ? "bg-emerald-100" : "bg-gray-100"}`}>
                    <Eye size={16} className={form.isActive ? "text-emerald-600" : "text-gray-400"} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${form.isActive ? "text-emerald-700" : "text-gray-500"}`}>Active</p>
                    <p className="text-xs text-gray-400">Visible to customers</p>
                  </div>
                  {form.isActive && (
                    <div className="ml-auto w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, isActive: false }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                    !form.isActive
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${!form.isActive ? "bg-gray-200" : "bg-gray-100"}`}>
                    <EyeOff size={16} className={!form.isActive ? "text-gray-600" : "text-gray-400"} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${!form.isActive ? "text-gray-700" : "text-gray-400"}`}>Inactive / Draft</p>
                    <p className="text-xs text-gray-400">Hidden from customers</p>
                  </div>
                  {!form.isActive && (
                    <div className="ml-auto w-4 h-4 rounded-full bg-gray-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>

                {/* Featured Toggle */}
                <div className="pt-1">
                  <label
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                      form.isFeatured ? "border-amber-300 bg-amber-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${form.isFeatured ? "bg-amber-100" : "bg-gray-100"}`}>
                      <Star size={16} className={form.isFeatured ? "text-amber-500" : "text-gray-400"} fill={form.isFeatured ? "currentColor" : "none"} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${form.isFeatured ? "text-amber-700" : "text-gray-500"}`}>Featured</p>
                      <p className="text-xs text-gray-400">Show on homepage</p>
                    </div>
                    <div
                      onClick={() => setForm((p) => ({ ...p, isFeatured: !p.isFeatured }))}
                      className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${form.isFeatured ? "bg-amber-400" : "bg-gray-200"}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ── Organization Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Organization</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option value="">Select a category…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Badge</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BADGE_OPTIONS.map((b) => (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, badge: b.value }))}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          form.badge === b.value
                            ? b.value
                              ? b.color + " ring-2 ring-offset-1 ring-current"
                              : "bg-gray-100 border-gray-400 text-gray-700 ring-2 ring-offset-1 ring-gray-400"
                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tags</label>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="summer, cotton, casual"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-400">Comma-separated</p>
                </div>
              </div>
            </div>

            {/* ── Pricing Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Pricing</h2>
                {discountPercent && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="p-5 space-y-4">
                {/* Base Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">৳</span>
                    <input
                      type="number"
                      name="basePrice"
                      value={form.basePrice}
                      onChange={handleChange}
                      placeholder="0"
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2.5 text-base font-bold text-emerald-700 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Compare At Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Original Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">৳</span>
                    <input
                      type="number"
                      name="salePrice"
                      value={form.salePrice}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all line-through-placeholder"
                    />
                  </div>
                  <p className="text-xs text-gray-400">Shown as strikethrough price</p>
                </div>

                {/* Cost Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cost per Item</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">৳</span>
                    <input
                      type="number"
                      name="costPrice"
                      value={form.costPrice}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-400">Not shown to customers</p>
                </div>

                {/* Profit indicator */}
                {form.basePrice && form.costPrice && parseFloat(form.basePrice) > 0 && parseFloat(form.costPrice) > 0 && (
                  <div className="bg-emerald-50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-xs text-emerald-600 font-medium">Profit Margin</span>
                    <span className="text-sm font-bold text-emerald-700">
                      ৳{(parseFloat(form.basePrice) - parseFloat(form.costPrice)).toFixed(0)}
                      <span className="text-xs font-normal ml-1">
                        ({Math.round(((parseFloat(form.basePrice) - parseFloat(form.costPrice)) / parseFloat(form.basePrice)) * 100)}%)
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Inventory Card ── */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Inventory</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Stock Qty</label>
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2.5 text-sm font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Low Stock Alert</label>
                    <input
                      type="number"
                      name="lowStockAlert"
                      value={form.lowStockAlert}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
                {parseInt(form.stock) <= parseInt(form.lowStockAlert) && parseInt(form.stock) > 0 && (
                  <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    <AlertCircle size={12} />
                    Stock is at or below low stock threshold
                  </div>
                )}
                {parseInt(form.stock) === 0 && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertCircle size={12} />
                    Product is out of stock
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── Sticky Footer Actions ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between lg:pl-72">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${form.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
              {form.isActive ? "Will be published immediately" : "Will be saved as draft"}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/products"
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl transition-colors shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
