'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, ShoppingBag, DollarSign, Award, ArrowLeft, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import type { StoredOrder } from '@/types/admin';

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
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const orders: StoredOrder[] = data?.orders || [];
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

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  const totalSpentAll = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrderVal = customers.length > 0 ? Math.round(totalSpentAll / customers.reduce((s, c) => s + c.orderCount, 0) || 1) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      {/* Header */}
      <header className="section-sm bg-white border-b border-neutral-200">
        <div className="container space-y-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-body-xs text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="overline text-gold-600 block mb-1">Customer CRM &amp; Loyalty</span>
              <h1 className="font-heading text-display-md text-neutral-950">Customer Profiles &amp; LTV</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="card p-5 space-y-1 border-l-4 border-l-gold-500">
              <div className="flex items-center justify-between text-neutral-500 text-caption font-semibold uppercase">
                <span>Total Unique Buyers</span>
                <Users className="h-4 w-4 text-gold-600" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{customers.length}</p>
              <p className="text-caption text-neutral-500">Registered &amp; Guest Profiles</p>
            </div>

            <div className="card p-5 space-y-1 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between text-emerald-600 text-caption font-semibold uppercase">
                <span>Total Lifetime Revenue</span>
                <DollarSign className="h-4 w-4" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{formatMoney(totalSpentAll, 'INR')}</p>
              <p className="text-caption text-emerald-700 font-medium">Realized sales volume</p>
            </div>

            <div className="card p-5 space-y-1 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between text-purple-600 text-caption font-semibold uppercase">
                <span>Avg. Basket Value</span>
                <ShoppingBag className="h-4 w-4" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{formatMoney(avgOrderVal, 'INR')}</p>
              <p className="text-caption text-neutral-500">Average spend per order</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer List */}
      <section className="section" aria-label="Customer profiles list">
        <div className="container space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email, or city..."
              className="input pl-10 text-body-sm min-h-[44px] bg-white"
            />
          </div>

          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-body-sm text-neutral-500">Loading customer profiles...</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-body-sm text-neutral-500">No customer profiles found matching your search.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-body-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-100 text-neutral-600 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Customer Name &amp; Contact</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4 text-center">Orders Placed</th>
                      <th className="py-3 px-4 text-right">Total Lifetime Spend</th>
                      <th className="py-3 px-4 text-center">Customer Tier</th>
                      <th className="py-3 px-4 text-right">Last Purchase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {filtered.map((c, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-neutral-950 text-body-sm">{c.name}</p>
                          <p className="text-caption text-neutral-500 flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</p>
                          {c.phone && <p className="text-caption text-neutral-500 flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</p>}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-700 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-neutral-400" /> {c.city}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-neutral-950 text-body-sm tabular-nums">
                          {c.orderCount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#E60012] text-body-sm tabular-nums">
                          {formatMoney(c.totalSpent, 'INR')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              c.tier === 'VIP Collector'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : c.tier === 'Loyal Buyer'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {c.tier === 'VIP Collector' && <Sparkles className="h-3 w-3 text-amber-600" />}
                            {c.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-caption text-neutral-500">
                          {new Date(c.lastOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
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
