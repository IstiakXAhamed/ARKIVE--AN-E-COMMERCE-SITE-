"use client";

import { useState, useEffect } from "react";
import { Layout, Save, Loader2, Edit2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface HeroItem {
  id: string;
  position: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

export default function StorefrontPage() {
  const [items, setItems] = useState<HeroItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPos, setEditingPos] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/layout/hero");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (err) {
      console.error("Failed to fetch hero items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (position: number) => {
    const item = items.find((i) => i.position === position) || {
      position,
      title: "",
      subtitle: "",
      imageUrl: "",
      link: "",
    };
    setEditForm(item);
    setEditingPos(position);
    setError("");
    setImageMode(item.imageUrl ? "url" : "upload");
  };

  const handleSave = async () => {
    if (!editForm) return;
    setError("");

    if (!editForm.title?.trim()) {
      setError("Title is required");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/layout/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchItems();
        setEditingPos(null);
        setEditForm(null);
      } else {
        setError(data.error || "Failed to save changes");
      }
    } catch (err) {
      setError("Network error — check your connection");
    } finally {
      setIsSaving(false);
    }
  };

  const getItem = (pos: number) => items.find((i) => i.position === pos);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storefront Layout</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your homepage hero section and featured categories
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Visual Preview / Grid Editor */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Layout size={20} />
            Hero Grid Layout
          </h2>
          
          <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 aspect-[16/9] lg:aspect-auto lg:h-[500px]">
            <div className="h-full grid grid-rows-2 grid-cols-2 gap-4">
              {/* Position 1: Large Top */}
              <div 
                className="row-span-1 col-span-2 relative group cursor-pointer bg-white rounded-xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all shadow-sm"
                onClick={() => handleEdit(1)}
              >
                {getItem(1)?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getItem(1)!.imageUrl} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    <span className="text-sm font-medium">Main Hero Banner</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Edit2 size={14} /> Edit Main Banner
                  </span>
                </div>
                {getItem(1)?.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <p className="font-bold text-lg">{getItem(1)?.title}</p>
                    <p className="text-sm opacity-90">{getItem(1)?.subtitle}</p>
                  </div>
                )}
              </div>

              {/* Position 2: Bottom Left */}
              <div 
                className="relative group cursor-pointer bg-white rounded-xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all shadow-sm"
                onClick={() => handleEdit(2)}
              >
                {getItem(2)?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getItem(2)!.imageUrl} alt="Left" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    <span className="text-sm font-medium">Bottom Left</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Edit2 size={14} /> Edit
                  </span>
                </div>
                {getItem(2)?.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <p className="font-bold">{getItem(2)?.title}</p>
                  </div>
                )}
              </div>

              {/* Position 3: Bottom Right */}
              <div 
                className="relative group cursor-pointer bg-white rounded-xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all shadow-sm"
                onClick={() => handleEdit(3)}
              >
                {getItem(3)?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getItem(3)!.imageUrl} alt="Right" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                    <span className="text-sm font-medium">Bottom Right</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Edit2 size={14} /> Edit
                  </span>
                </div>
                {getItem(3)?.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <p className="font-bold">{getItem(3)?.title}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-fit">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">
              {editingPos ? `Edit Position ${editingPos}` : "Select a section to edit"}
            </h3>
          </div>
          
          {editForm ? (
            <div className="p-4 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Image - Toggle between Upload and URL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label mb-0">Image</label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`px-2 py-1 text-xs rounded ${imageMode === "upload" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-2 py-1 text-xs rounded ${imageMode === "url" ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                      Paste URL
                    </button>
                  </div>
                </div>

                {imageMode === "upload" ? (
                  <ImageUpload
                    value={editForm.imageUrl}
                    onChange={(url) => setEditForm({ ...editForm, imageUrl: url })}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="url"
                        value={editForm.imageUrl || ""}
                        onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                        className="form-input pl-10"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    {editForm.imageUrl && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={editForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Summer Collection"
                />
              </div>

              <div>
                <label className="form-label">Subtitle</label>
                <input
                  type="text"
                  value={editForm.subtitle || ""}
                  onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                  className="form-input"
                  placeholder="e.g., 50% Off"
                />
              </div>

              <div>
                <label className="form-label">Link URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={editForm.link || ""}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    className="form-input pl-10"
                    placeholder="/shop/category"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingPos(null);
                    setEditForm(null);
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Click on any section in the preview to edit its content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
