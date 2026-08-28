'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, ShoppingBag, DollarSign, Award, ArrowLeft, Mail, Phone, MapPin, Sparkles, Filter, Copy } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import type { StoredOrder } from '@/types/admin';
import { useToast } from '@/context/ToastContext';

interface CustomerProfile {
  email: string;
  name: string;
  phone?: string;
  city?: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  tier: 'VIP Collector' | 'Loyal Buyer' | 'First Timer';
}

export default function AdminCustomersPage() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [search, setSearch] = useState('');
  const [activeTierFilter, setActiveTierFilter] = useState<'ALL' | 'VIP Collector' | 'Loyal Buyer' | 'First Timer'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const orders: StoredOrder[] = Array.isArray(data) ? data : data?.orders || [];
        const customerMap = new Map<string, CustomerProfile>();

        orders.forEach((o) => {
          const key = (o.email || o.name).toLowerCase();
          const existing = customerMap.get(key);
          const amt = Number(o.total || 0);

          if (existing) {
            existing.orderCount += 1;
            existing.totalSpent += amt;
            if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
              existing.lastOrderDate = o.createdAt;
            }
          } else {
            customerMap.set(key, {
              email: o.email || 'guest@aura.com',
              name: o.name || 'Valued Guest',
              phone: o.phone,
              city: o.address?.city || 'India',
              orderCount: 1,
              totalSpent: amt,
              lastOrderDate: o.createdAt,
              tier: 'First Timer',
            });
          }
        });

        // Assign Tiers
        const list = Array.from(customerMap.values()).map((c) => {
          if (c.totalSpent >= 40000 || c.orderCount >= 3) c.tier = 'VIP Collector';
          else if (c.totalSpent >= 15000 || c.orderCount >= 2) c.tier = 'Loyal Buyer';
          else c.tier = 'First Timer';
          return c;
        });

        setCustomers(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`, 'success');
    }
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()));

    const matchesTier = activeTierFilter === 'ALL' || c.tier === activeTierFilter;
    return matchesSearch && matchesTier;
  });

  const totalSpentAll = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderVal = customers.length > 0 ? Math.round(totalSpentAll / (customers.reduce((s, c) => s + c.orderCount, 0) || 1)) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F0]">
      {/* Header */}
      <header className="section-sm bg-white border-b border-neutral-200 shadow-sm">
        <div className="container max-w-6xl space-y-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-body-xs text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="overline text-gold-600 block mb-1">Customer Relationship Management</span>
              <h1 className="font-heading text-display-md text-neutral-950">Customer Profiles &amp; LTV</h1>
            </div>
            <span className="badge-gold text-[10px] uppercase font-bold self-start sm:self-auto">Auto-Tiering Active</span>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="card p-5 space-y-1.5 border-l-4 border-l-gold-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-neutral-500 text-caption font-semibold uppercase">
                <span>Total Unique Buyers</span>
                <Users className="h-4 w-4 text-gold-600" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{customers.length}</p>
              <p className="text-caption text-neutral-500">Registered &amp; Guest Profiles</p>
            </div>

            <div className="card p-5 space-y-1.5 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-emerald-600 text-caption font-semibold uppercase">
                <span>Total Lifetime Revenue</span>
                <DollarSign className="h-4 w-4" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{formatMoney(totalSpentAll, 'INR')}</p>
              <p className="text-caption text-emerald-700 font-medium">Realized sales volume</p>
            </div>

            <div className="card p-5 space-y-1.5 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-purple-600 text-caption font-semibold uppercase">
                <span>Avg. Basket Value</span>
                <ShoppingBag className="h-4 w-4" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{formatMoney(avgOrderVal, 'INR')}</p>
              <p className="text-caption text-neutral-500">Average spend per checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer List */}
      <section className="section py-8" aria-label="Customer profiles list">
        <div className="container max-w-6xl space-y-6">
          {/* Controls Bar: Search & Tier Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer by name, email, or city..."
                className="input pl-10 text-body-sm min-h-[44px] bg-white border-neutral-200 shadow-sm"
              />
            </div>

            {/* Tier Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'ALL', label: 'All Buyers' },
                { id: 'VIP Collector', label: 'VIP Collectors' },
                { id: 'Loyal Buyer', label: 'Loyal Buyers' },
                { id: 'First Timer', label: 'First Timers' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTierFilter(t.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-body-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                    activeTierFilter === t.id
                      ? 'bg-neutral-950 text-white shadow-md'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden bg-white border border-neutral-200 shadow-sm rounded-2xl">
            {loading ? (
              <div className="p-8 text-center text-body-sm text-neutral-500">Loading customer profiles...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-body-sm text-neutral-500">No customer profiles found matching your search.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-body-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-100/80 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-5">Customer Name &amp; Contact</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4 text-center">Orders</th>
                      <th className="py-3.5 px-5 text-right">Lifetime Spend</th>
                      <th className="py-3.5 px-4 text-center">Loyalty Tier</th>
                      <th className="py-3.5 px-5 text-right">Last Purchase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filtered.map((c, idx) => {
                      const initials = c.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-neutral-950 font-extrabold flex items-center justify-center text-body-xs shrink-0 shadow-sm">
                                {initials || 'CU'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-neutral-950 text-body-sm">{c.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-caption text-neutral-500 flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-neutral-400" /> {c.email}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(c.email, 'email')}
                                    className="text-neutral-400 hover:text-neutral-900 transition-colors"
                                    title="Copy email"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-neutral-700 font-medium">
                            <span className="inline-flex items-center gap-1 text-body-xs">
                              <MapPin className="h-3.5 w-3.5 text-gold-600" /> {c.city}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-neutral-950 text-body-sm tabular-nums">
                            {c.orderCount}
                          </td>
                          <td className="py-4 px-5 text-right font-bold text-[#E60012] text-body-sm tabular-nums">
                            {formatMoney(c.totalSpent, 'INR')}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                                c.tier === 'VIP Collector'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : c.tier === 'Loyal Buyer'
                                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                  : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                              }`}
                            >
                              {c.tier === 'VIP Collector' && <Sparkles className="h-3 w-3 text-amber-600" />}
                              {c.tier}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right text-caption text-neutral-500 font-medium">
                            {new Date(c.lastOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
