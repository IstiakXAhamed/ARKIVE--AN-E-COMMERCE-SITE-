"use client";

import { useState, useEffect } from "react";
import { Star, Check, X, Trash2, Loader2, MessageSquare } from "lucide-react";

interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isApproved: boolean;
  isVerified: boolean;
  createdAt: string;
  user: { name: string | null; email: string; image: string | null };
  product: { name: string; slug: string; image: string | null };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/admin/reviews?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchReviews();
  }, [filter]);

  const handleApprove = async (id: string, approve: boolean) => {
    setActionLoading(id);
    try {
      await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: approve }),
      });
      await fetchReviews();
    } catch {
      alert("Failed to update review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    setActionLoading(id);
    try {
      await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchReviews();
    } catch {
      alert("Failed to delete review");
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer reviews and ratings
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
            {pendingCount} pending approval
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "pending", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === f
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No reviews found</p>
          <p className="text-sm text-gray-400 mt-1">Customer reviews will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                review.isApproved ? "border-gray-100" : "border-amber-200 bg-amber-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm shrink-0">
                      {review.user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{review.user.name || review.user.email}</p>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        {review.isVerified && (
                          <span className="text-[10px] font-medium bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <p className="font-medium text-gray-900 text-sm">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                  )}

                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>on <strong className="text-gray-600">{review.product.name}</strong></span>
                    <span>·</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {actionLoading === review.id ? (
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  ) : (
                    <>
                      {!review.isApproved && (
                        <button
                          onClick={() => handleApprove(review.id, true)}
                          className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {review.isApproved && (
                        <button
                          onClick={() => handleApprove(review.id, false)}
                          className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                          title="Unapprove"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
