'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type AdminReview = {
  id: number;
  productId: number;
  productTitle: string;
  productHandle: string;
  rating: number;
  authorName: string;
  authorEmail: string;
  title: string | null;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    fetch('/api/admin/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok) setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    const res = await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    const res = await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'delete' }),
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-6 sm:p-10 space-y-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-heading text-heading-md font-bold text-white">Product Reviews Moderation</h1>
              <p className="text-caption text-neutral-400">Review and approve customer ratings for store catalog</p>
            </div>
          </div>

          <button
            onClick={fetchReviews}
            className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg flex items-center gap-2 text-body-xs font-medium"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-400">Loading reviews database...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 bg-neutral-800/50 rounded-xl border border-neutral-700 text-center text-neutral-400">
            No customer reviews submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-700/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      rev.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : rev.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {rev.status}
                    </span>
                    <Link href={`/products/${rev.productHandle}`} target="_blank" className="font-bold text-emerald-400 hover:underline text-body-xs">
                      Product: {rev.productTitle}
                    </Link>
                  </div>

                  <span className="text-caption text-neutral-400">
                    {new Date(rev.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= rev.rating ? 'fill-current' : 'text-neutral-600'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-white text-body-xs">{rev.authorName}</span>
                    <span className="text-caption text-neutral-400">({rev.authorEmail})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {rev.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'APPROVED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-caption font-bold flex items-center gap-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </button>
                    )}
                    {rev.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateStatus(rev.id, 'REJECTED')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-caption font-bold flex items-center gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {rev.title && <h3 className="font-bold text-white text-body-xs">{rev.title}</h3>}
                <p className="text-neutral-300 text-body-xs leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
