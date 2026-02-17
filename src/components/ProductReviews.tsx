"use client";

import { useState, useEffect } from "react";
import { Star, Send, Loader2, CheckCircle, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
  user: { name: string; image: string | null };
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ rating: 0, title: "", comment: "" });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { setError("Please select a rating"); return; }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <section className="mt-12 md:mt-20 border-t border-gray-200 pt-10">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Customer Reviews
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-gray-900">{avgRating}</div>
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={s <= Math.round(parseFloat(avgRating)) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Distribution */}
          <div className="space-y-2">
            {ratingDist.map((r) => (
              <div key={r.star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-gray-600">{r.star}</span>
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="w-6 text-right text-gray-400">{r.count}</span>
              </div>
            ))}
          </div>

          {/* Write Review Button */}
          <div className="mt-6">
            {session?.user ? (
              submitted ? (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle size={16} />
                  Review submitted! Awaiting approval.
                </div>
              ) : (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Write a Review
                </button>
              )
            ) : (
              <Link href="/login" className="block text-center px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                Sign in to review
              </Link>
            )}
          </div>
        </div>

        {/* Review List + Form */}
        <div className="md:col-span-2 space-y-4">
          {/* Review Submission Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">Your Review for {productName}</h3>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Star Rating */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setForm((p) => ({ ...p, rating: s }))}
                      className="p-0.5"
                    >
                      <Star
                        size={28}
                        className={
                          s <= (hoverRating || form.rating)
                            ? "text-amber-400 fill-amber-400 transition-colors"
                            : "text-gray-300 transition-colors"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Comment</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Share your thoughts about this product..."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}

          {/* Reviews */}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm mt-1">Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                    <User size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-gray-900">{review.user.name}</span>
                      {review.isVerified && (
                        <span className="text-[10px] font-medium bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                          ✓ Verified Purchase
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                      ))}
                    </div>
                    {review.title && <p className="font-medium text-gray-900 text-sm mt-2">{review.title}</p>}
                    {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
