'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, Plus, ArrowLeft, Trash2, Check, Sparkles, Copy, Percent, DollarSign } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { formatMoney } from '@/lib/utils';
import type { StoredDiscount } from '@/app/api/admin/discounts/route';

export default function AdminDiscountsPage() {
  const { showToast } = useToast();
  const [discounts, setDiscounts] = useState<StoredDiscount[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('10');
  const [minSubtotal, setMinSubtotal] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  const loadDiscounts = () => {
    fetch('/api/admin/discounts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.discounts) setDiscounts(data.discounts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadDiscounts();
  }, []);

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, type, value: Number(value), minSubtotal: Number(minSubtotal) }),
      });

      if (!res.ok) throw new Error('Failed to create coupon');
      const data = await res.json();
      setDiscounts((prev) => [data.discount, ...prev]);
      setCode('');
      setValue('10');
      setMinSubtotal('0');
      showToast(`Promo code ${data.discount.code} created successfully!`, 'success');
    } catch (err) {
      showToast('Error creating promo coupon code', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (res.ok) {
        setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, active: !currentActive } : d)));
        showToast('Coupon status updated', 'info');
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/discounts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDiscounts((prev) => prev.filter((d) => d.id !== id));
        showToast('Coupon deleted', 'info');
      }
    } catch {}
  };

  const copyCouponCode = (couponCode: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(couponCode);
      showToast(`Copied code "${couponCode}" to clipboard!`, 'success');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F0]">
      {/* Header */}
      <header className="section-sm bg-white border-b border-neutral-200 shadow-sm">
        <div className="container space-y-4 max-w-5xl">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-body-xs text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="overline text-gold-600 block mb-1">Store Marketing &amp; Campaigns</span>
              <h1 className="font-heading text-display-md text-neutral-950">Promo Coupon &amp; Offer Manager</h1>
            </div>
            <span className="badge-gold text-[10px] uppercase font-bold self-start sm:self-auto">Cart Drawer Integration Active</span>
          </div>
        </div>
      </header>

      <section className="section py-8" aria-label="Promo coupons">
        <div className="container max-w-5xl space-y-8">
          {/* Create Coupon Form Card */}
          <div className="card p-6 sm:p-8 space-y-6 bg-white border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2.5">
                <Tag className="h-5 w-5 text-gold-600" />
                <h2 className="font-heading text-heading-md text-neutral-950">Create New Promo Code</h2>
              </div>
              <span className="text-caption font-bold text-neutral-400 uppercase tracking-widest">Instant Activation</span>
            </div>

            <form onSubmit={handleCreateDiscount} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="label text-body-xs font-bold text-neutral-950">Promo Code String</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="input uppercase text-body-sm font-bold min-h-[44px] py-2.5 bg-neutral-50"
                />
              </div>

              <div>
                <label className="label text-body-xs font-bold text-neutral-950">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="input text-body-sm font-semibold min-h-[44px] py-2.5 bg-neutral-50 cursor-pointer"
                >
                  <option value="percent">Percentage Off (%)</option>
                  <option value="fixed">Fixed Amount Off (₹)</option>
                </select>
              </div>

              <div>
                <label className="label text-body-xs font-bold text-neutral-950">Discount Value</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="10"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="input text-body-sm font-semibold min-h-[44px] py-2.5 bg-neutral-50"
                />
              </div>

              <div>
                <label className="label text-body-xs font-bold text-neutral-950">Min. Order Subtotal (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minSubtotal}
                  onChange={(e) => setMinSubtotal(e.target.value)}
                  className="input text-body-sm font-semibold min-h-[44px] py-2.5 bg-neutral-50"
                />
              </div>

              <div className="sm:col-span-4 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-body-xs font-bold uppercase tracking-wider px-6 py-3 bg-[#E60012] hover:bg-red-700 text-white min-h-[44px] inline-flex items-center gap-2 rounded-xl shadow-md"
                >
                  <Plus className="h-4 w-4" /> Create Promo Code
                </button>
              </div>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="card overflow-hidden bg-white border border-neutral-200 shadow-sm rounded-2xl">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <h2 className="font-heading text-heading-md text-neutral-950">Active Promo Coupons ({discounts.length})</h2>
              </div>
              <span className="text-caption text-neutral-500 font-semibold">Available for storefront cart drawer</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-body-sm text-neutral-500">Loading coupons...</div>
            ) : discounts.length === 0 ? (
              <div className="p-8 text-center text-body-sm text-neutral-500">No promo coupons created yet.</div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {discounts.map((d) => (
                  <div key={d.id} className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E60012] flex items-center justify-center font-bold shrink-0 border border-red-200">
                        {d.type === 'percent' ? <Percent className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <strong className="font-mono text-body-sm font-bold text-neutral-950 tracking-wider uppercase bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-md">
                            {d.code}
                          </strong>
                          <button
                            type="button"
                            onClick={() => copyCouponCode(d.code)}
                            className="text-neutral-400 hover:text-neutral-950 transition-colors p-1"
                            title="Copy promo code"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${d.active ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-neutral-200 text-neutral-600'}`}>
                            {d.active ? 'Active in Cart' : 'Disabled'}
                          </span>
                        </div>

                        <p className="text-body-xs text-neutral-600 font-medium truncate">
                          Discount: <strong className="text-[#E60012]">{d.type === 'percent' ? `${d.value}% OFF` : `₹${d.value} OFF`}</strong>
                          {d.minSubtotal ? ` on orders over ${formatMoney(d.minSubtotal, 'INR')}` : ' on all orders'}
                          <span className="mx-2 text-neutral-300">•</span>
                          Total Redemptions: <strong className="text-neutral-950">{d.usedCount} times</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(d.id, d.active)}
                        className={`btn-secondary text-caption font-bold py-1.5 px-3.5 rounded-xl transition-all ${d.active ? 'text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100' : 'text-emerald-800 border-emerald-300 bg-emerald-50 hover:bg-emerald-100'}`}
                      >
                        {d.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
