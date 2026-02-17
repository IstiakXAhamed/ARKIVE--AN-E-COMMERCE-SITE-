"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, X, AlertCircle } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import AIProductAssist from "@/components/admin/AIProductAssist";
import VariantManager from "@/components/admin/VariantManager";
import { Button } from "@/components/ui/ui-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  // Advanced State
  const [variants, setVariants] = useState<any[]>([]);
  const [useAI, setUseAI] = useState(true);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    basePrice: "", // Current Selling Price
    salePrice: "", // Original / Compare At Price
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
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    variantPricing: false,
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    // Handle checkbox
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
            slug: value
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
            metaTitle: value, // Auto-set meta title
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!form.basePrice || parseFloat(form.basePrice) <= 0) {
      setError("Valid price is required");
      return;
    }
    if (!form.categoryId) {
      setError("Category is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        images: images, // Send array of strings, API handles formatting
        variants: variants.map((v) =>({
          ...v,
          price: v.price || (form.variantPricing ? parseFloat(form.basePrice) : null), // Fallback
          stock: parseInt(v.stock.toString()) || 0
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
      window.scrollTo(0,0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Add New Product
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Create a listing with AI assistance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" type="button" onClick={() => setUseAI(!useAI)}>
             {useAI ? 'Disable AI Tools' : 'Enable AI Tools'}
           </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - MAIN INFO */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Elegant Silk Saree"
                      required
                      className="text-lg font-medium"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Slug</Label>
                       <Input
                         name="slug"
                         value={form.slug}
                         onChange={handleChange}
                         className="bg-gray-50 text-xs font-mono"
                         placeholder="auto-generated"
                       />
                     </div>
                     <div className="space-y-2">
                        <Label>Product Type</Label>
                        <select 
                           name="productType" 
                           value={form.productType} 
                           onChange={handleChange} 
                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                           <option value="clothing">Clothing</option>
                           <option value="footwear">Footwear</option>
                           <option value="electronics">Electronics</option>
                           <option value="beauty">Beauty</option>
                           <option value="general">General</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Input
                      name="shortDesc"
                      value={form.shortDesc}
                      onChange={handleChange}
                      placeholder="Brief one-line summary"
                      maxLength={500}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <Label>Full Description</Label>
                    </div>
                    
                    {useAI && (
                       <AIProductAssist 
                          productName={form.name}
                          category={categories.find(c => c.id === form.categoryId)?.name}
                          onSuggestionAccept={(field, value) => {
                             if (field === 'description') setForm(prev => ({...prev, description: value}));
                             else if (field === 'tags') setForm(prev => ({...prev, tags: value}));
                             else if (field === 'seoTitle') setForm(prev => ({...prev, metaTitle: value}));
                             else if (field === 'basePrice') setForm(prev => ({...prev, basePrice: value.toString()}));
                             else if (field === 'salePrice') setForm(prev => ({...prev, salePrice: value.toString()}));
                             else if (field === 'variants') setVariants(value);
                             else if (field === 'category') {
                                // Match category logic if names align, slightly complex for ID
                             }
                             else if (field === 'isFeatured') setForm(prev => ({...prev, isFeatured: value}));
                          }}
                       />
                    )}

                    <Textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={6}
                      className="resize-none"
                      placeholder="Write a detailed product description..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
               <CardHeader><CardTitle>Variants</CardTitle></CardHeader>
               <CardContent>
                  <VariantManager 
                     variants={variants}
                     onChange={setVariants}
                     productName={form.name}
                     productType={form.productType}
                     variantPricing={form.variantPricing}
                  />
                  <div className="mt-4 flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="vp" 
                        checked={form.variantPricing} 
                        onChange={e => setForm(p => ({...p, variantPricing: e.target.checked}))}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600"
                     />
                     <Label htmlFor="vp" className="cursor-pointer">Enable different prices per variant</Label>
                  </div>
               </CardContent>
            </Card>
            
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl border-2 border-gray-200 overflow-hidden group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Product ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          PRIMARY
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
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
                <p className="text-xs text-gray-400 mt-3">
                  Upload up to 8 images. First image is the primary image.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="space-y-8">
            {/* Status & Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    name="isActive"
                    value={form.isActive ? "true" : "false"}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, isActive: e.target.value === "true" }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="true">Active</option>
                    <option value="false">Draft</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g. summer, cotton"
                  />
                </div>

                <div className="pt-2 space-y-3">
                   <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, isFeatured: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Featured Product
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Base Price (৳) *</Label>
                  <Input
                    type="number"
                    name="basePrice"
                    value={form.basePrice}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    min="0"
                    step="0.01"
                    className="text-lg font-bold text-emerald-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compare at Price (৳)</Label>
                  <Input
                    type="number"
                    name="salePrice"
                    value={form.salePrice}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-400">Original price (shows slash)</p>
                </div>
                <div className="space-y-2">
                  <Label>Cost per Item (৳)</Label>
                  <Input
                    type="number"
                    name="costPrice"
                    value={form.costPrice}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </CardContent>
            </Card>

             {/* SEO */}
             <Card>
              <CardHeader>
                <CardTitle className="text-base">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    name="metaTitle"
                    value={form.metaTitle}
                    onChange={handleChange}
                    placeholder="SEO Title"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-400 text-right">{form.metaTitle.length}/60</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    name="metaDescription"
                    value={form.metaDescription}
                    onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))}
                    rows={3}
                    className="resize-none"
                    placeholder="SEO Description"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-400 text-right">{form.metaDescription.length}/160</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <Input
                     name="metaKeywords"
                     value={form.metaKeywords}
                     onChange={handleChange}
                     placeholder="comma, separated, keywords"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50 flex justify-end gap-4 lg:pl-72">
          <Link
            href="/admin/products"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
