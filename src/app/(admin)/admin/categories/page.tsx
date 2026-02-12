"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  X,
  Save,
} from "lucide-react";
import { categories } from "@/lib/data";

interface Category {
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([...categories]);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", icon: "" });

  const startEdit = (cat: Category) => {
    setEditing(cat.slug);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon });
    setAdding(false);
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({ name: "", slug: "", icon: "" });
  };

  const saveEdit = () => {
    setCats((prev) =>
      prev.map((c) =>
        c.slug === editing ? { ...c, name: form.name, slug: form.slug, icon: form.icon } : c
      )
    );
    setEditing(null);
  };

  const saveAdd = () => {
    if (!form.name) return;
    setCats((prev) => [
      ...prev,
      {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        icon: form.icon || "📦",
        count: 0,
      },
    ]);
    setAdding(false);
    setForm({ name: "", slug: "", icon: "" });
  };

  const remove = (slug: string) => {
    setCats((prev) => prev.filter((c) => c.slug !== slug));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize products into categories ({cats.length} categories)
          </p>
        </div>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Add Form */}
      {adding && (
        <div className="bg-white rounded-xl border-2 border-emerald-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">New Category</h2>
            <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
                className="form-input"
                placeholder="e.g. Jewelry"
              />
            </div>
            <div>
              <label className="form-label">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="form-input bg-gray-50"
              />
            </div>
            <div>
              <label className="form-label">Icon (emoji)</label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="form-input"
                placeholder="e.g. 💍"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={saveAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Save size={16} />
              Save Category
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {cats.map((cat) => (
          <div key={cat.slug}>
            {editing === cat.slug ? (
              <div className="p-5 bg-emerald-50/30 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Slug</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="form-input bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="form-label">Icon</label>
                    <input
                      type="text"
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditing(null)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                  >
                    <Save size={14} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500">/{cat.slug} &middot; {cat.count} products</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(cat)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    onClick={() => remove(cat.slug)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
