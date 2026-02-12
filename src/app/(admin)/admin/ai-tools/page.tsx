"use client";

import { useState } from "react";
import {
  Sparkles,
  FileText,
  Search,
  MessageSquare,
  Loader2,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import { categories } from "@/lib/data";

type Tool = "description" | "seo" | "sentiment";

export default function AdminAIToolsPage() {
  const [activeTool, setActiveTool] = useState<Tool>("description");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Description form
  const [descForm, setDescForm] = useState({
    name: "",
    category: "",
    material: "",
    keywords: "",
  });

  // SEO form
  const [seoForm, setSeoForm] = useState({
    productName: "",
    category: "",
    description: "",
  });

  // Sentiment form
  const [reviews, setReviews] = useState("");

  const callAI = async (action: string, body: Record<string, unknown>) => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await res.json();
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult(
          typeof data.result === "string"
            ? data.result
            : JSON.stringify(data.result, null, 2)
        );
      }
    } catch {
      setResult("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenDescription = () => {
    if (!descForm.name || !descForm.category) return;
    callAI("generate-description", {
      name: descForm.name,
      category: descForm.category,
      material: descForm.material || undefined,
      keywords: descForm.keywords
        ? descForm.keywords.split(",").map((k) => k.trim())
        : undefined,
    });
  };

  const handleGenSEO = () => {
    if (!seoForm.productName || !seoForm.category) return;
    callAI("generate-seo", seoForm);
  };

  const handleAnalyzeSentiment = () => {
    const list = reviews
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);
    if (list.length === 0) return;
    callAI("analyze-sentiment", { reviews: list });
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    {
      id: "description" as Tool,
      label: "Product Description",
      icon: FileText,
      desc: "Generate compelling product descriptions",
    },
    {
      id: "seo" as Tool,
      label: "SEO Generator",
      icon: Search,
      desc: "Generate SEO title, meta description & keywords",
    },
    {
      id: "sentiment" as Tool,
      label: "Review Sentiment",
      icon: MessageSquare,
      desc: "Analyze customer review sentiment",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles size={24} className="text-emerald-600" />
          AI Tools
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Powered by Google Gemini — generate content, analyze reviews, and more
        </p>
      </div>

      {/* Tool Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                setResult("");
              }}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                activeTool === tool.id
                  ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                activeTool === tool.id ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
              }`}>
                <Icon size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-900">{tool.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {activeTool === "description" && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Generate Description</h2>
              <div>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  value={descForm.name}
                  onChange={(e) => setDescForm({ ...descForm, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Elegant Pearl Earrings"
                />
              </div>
              <div>
                <label className="form-label">Category *</label>
                <select
                  value={descForm.category}
                  onChange={(e) => setDescForm({ ...descForm, category: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Material (optional)</label>
                <input
                  type="text"
                  value={descForm.material}
                  onChange={(e) => setDescForm({ ...descForm, material: e.target.value })}
                  className="form-input"
                  placeholder="e.g. 18K Gold, Sterling Silver"
                />
              </div>
              <div>
                <label className="form-label">Keywords (optional, comma-separated)</label>
                <input
                  type="text"
                  value={descForm.keywords}
                  onChange={(e) => setDescForm({ ...descForm, keywords: e.target.value })}
                  className="form-input"
                  placeholder="e.g. elegant, handcrafted, wedding"
                />
              </div>
              <button
                onClick={handleGenDescription}
                disabled={loading || !descForm.name || !descForm.category}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Generate Description
              </button>
            </div>
          )}

          {activeTool === "seo" && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Generate SEO Content</h2>
              <div>
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  value={seoForm.productName}
                  onChange={(e) => setSeoForm({ ...seoForm, productName: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Rose Gold Diamond Ring"
                />
              </div>
              <div>
                <label className="form-label">Category *</label>
                <select
                  value={seoForm.category}
                  onChange={(e) => setSeoForm({ ...seoForm, category: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Description (optional)</label>
                <textarea
                  value={seoForm.description}
                  onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                  className="form-input resize-none"
                  rows={3}
                  placeholder="Brief product description for context..."
                />
              </div>
              <button
                onClick={handleGenSEO}
                disabled={loading || !seoForm.productName || !seoForm.category}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Generate SEO
              </button>
            </div>
          )}

          {activeTool === "sentiment" && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">Analyze Review Sentiment</h2>
              <div>
                <label className="form-label">Customer Reviews *</label>
                <textarea
                  value={reviews}
                  onChange={(e) => setReviews(e.target.value)}
                  className="form-input resize-none"
                  rows={8}
                  placeholder={"Paste reviews, one per line:\n\nLove this ring! Beautiful quality.\nDelivery was slow but product is great.\nNot worth the price, disappointing."}
                />
                <p className="text-xs text-gray-400 mt-1">One review per line</p>
              </div>
              <button
                onClick={handleAnalyzeSentiment}
                disabled={loading || !reviews.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                Analyze Sentiment
              </button>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Result</h2>
            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setResult("");
                    if (activeTool === "description") handleGenDescription();
                    else if (activeTool === "seo") handleGenSEO();
                    else handleAnalyzeSentiment();
                  }}
                  disabled={loading}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw size={15} />
                </button>
                <button
                  onClick={copyResult}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  title="Copy"
                >
                  {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-3" />
              <p className="text-sm">Generating with Gemini...</p>
            </div>
          ) : result ? (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-100 leading-relaxed font-sans">
                {result}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <Sparkles size={40} className="mb-3" />
              <p className="text-sm text-gray-400">Results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
