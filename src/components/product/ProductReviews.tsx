'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, AlertCircle } from 'lucide-react';

type Review = {
  id: number;
  rating: number;
  authorName: string;
  title: string | null;
  comment: string;
  createdAt: string;
};

export default function ProductReviews({ productHandle }: { productHandle: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [authorName, setAuthorName] = useState<string>('');
  const [authorEmail, setAuthorEmail] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReviews = () => {
    fetch(`/api/products/${productHandle}/reviews`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok) {
          setReviews(data.reviews || []);
          setAverageRating(data.averageRating || 0);
          setTotalReviews(data.totalReviews || 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [productHandle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/products/${productHandle}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, authorName, authorEmail, title, comment }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setFeedback({ type: 'success', message: data.message });
        setAuthorName('');
        setAuthorEmail('');
        setTitle('');
        setComment('');
        setRating(5);
        setTimeout(() => setShowModal(false), 2500);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to submit review' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-neutral-200 pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-neutral-100">
        <div>
          <h2 className="font-heading text-heading-md font-bold text-neutral-950">Customer Reviews &amp; Ratings</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-neutral-300'}`}
                />
              ))}
            </div>
            <span className="font-bold text-neutral-900 text-body">{averageRating > 0 ? averageRating.toFixed(1) : 'No reviews yet'}</span>
            <span className="text-neutral-500 text-body-xs font-medium">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary inline-flex items-center justify-center gap-2 bg-brand-[#1e3932] text-white px-6 py-3 rounded-lg text-body-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
        >
          <MessageSquarePlus className="h-4 w-4" /> Write a Review
        </button>
      </div>

      {/* Review List */}
      <div className="mt-8 space-y-6">
        {loading ? (
          <p className="text-neutral-500 text-body-xs">Loading customer reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="bg-neutral-50 p-8 text-center rounded-xl border border-neutral-200">
            <p className="text-body text-neutral-700 font-medium">Be the first to review this product!</p>
            <p className="text-caption text-neutral-500 mt-1">Share your experience with fellow handloom connoisseurs.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${star <= rev.rating ? 'fill-current' : 'text-neutral-300'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-neutral-900 text-body-xs">{rev.authorName}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="h-3 w-3" /> Verified Customer
                  </span>
                </div>
                <span className="text-caption text-neutral-400">{new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              {rev.title && <h4 className="font-bold text-neutral-900 text-body-sm">{rev.title}</h4>}
              <p className="text-neutral-700 text-body-xs leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative space-y-5 border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="font-heading text-heading-sm font-bold text-neutral-950">Write a Review</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-800 text-body-lg font-bold">×</button>
            </div>

            {feedback && (
              <div className={`p-4 rounded-lg flex items-center gap-3 text-body-xs font-medium ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {feedback.type === 'success' ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-600" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-body-xs font-bold text-neutral-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition"
                    >
                      <Star className={`h-7 w-7 ${star <= rating ? 'fill-current' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption font-bold text-neutral-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-xs text-neutral-950 focus:ring-2 focus:ring-emerald-800 outline-none"
                    placeholder="e.g. Ananya Roy"
                  />
                </div>
                <div>
                  <label className="block text-caption font-bold text-neutral-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-xs text-neutral-950 focus:ring-2 focus:ring-emerald-800 outline-none"
                    placeholder="ananya@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-caption font-bold text-neutral-700 mb-1">Headline / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-xs text-neutral-950 focus:ring-2 focus:ring-emerald-800 outline-none"
                  placeholder="e.g. Stunning craftsmanship & silk luster!"
                />
              </div>

              <div>
                <label className="block text-caption font-bold text-neutral-700 mb-1">Review *</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-xs text-neutral-950 focus:ring-2 focus:ring-emerald-800 outline-none"
                  placeholder="Describe the fabric quality, weave detail, drape, or fit..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-body-xs font-bold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#1e3932] text-white rounded-lg text-body-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
