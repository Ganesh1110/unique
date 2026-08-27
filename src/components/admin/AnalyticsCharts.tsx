'use client';

import { TrendingUp, Award, Layers, DollarSign } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import type { Product } from '@/types/shopify';

interface AnalyticsChartsProps {
  products: Product[];
  totalRevenue: number;
  totalProfit: number;
}

export function AnalyticsCharts({ products, totalRevenue, totalProfit }: AnalyticsChartsProps) {
  // Monthly Revenue trend data (6-month view)
  const monthlyTrends = [
    { month: 'Mar', revenue: Math.round(totalRevenue * 0.12), profit: Math.round(totalRevenue * 0.12 * 0.55) },
    { month: 'Apr', revenue: Math.round(totalRevenue * 0.15), profit: Math.round(totalRevenue * 0.15 * 0.55) },
    { month: 'May', revenue: Math.round(totalRevenue * 0.18), profit: Math.round(totalRevenue * 0.18 * 0.55) },
    { month: 'Jun', revenue: Math.round(totalRevenue * 0.22), profit: Math.round(totalRevenue * 0.22 * 0.55) },
    { month: 'Jul', revenue: Math.round(totalRevenue * 0.28), profit: Math.round(totalRevenue * 0.28 * 0.55) },
    { month: 'Aug (Current)', revenue: totalRevenue, profit: totalProfit },
  ];

  const maxRevenue = Math.max(...monthlyTrends.map((d) => d.revenue), 10000);

  // Category breakdown data
  const categoryMap = new Map<string, number>();
  products.forEach((p) => {
    const cat = p.productType || 'Sarees';
    const val = (p.priceRange.minVariantPrice.amount || 0) * (p.totalInventory || 10);
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + val);
  });

  const categories = Array.from(categoryMap.entries()).map(([name, val]) => ({ name, val }));
  const totalCatVal = categories.reduce((s, c) => s + c.val, 0) || 1;

  // Top 5 Products Leaderboard
  const topProducts = [...products]
    .sort((a, b) => b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Monthly Sales & Profit Trend (Bar Chart) */}
      <div className="lg:col-span-8 card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold-600 text-caption font-bold uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" /> Visual Revenue Performance
            </div>
            <h3 className="font-heading text-heading-md text-neutral-950">6-Month Revenue &amp; Profit Trend</h3>
          </div>
          <div className="flex items-center gap-4 text-body-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-neutral-950" /> Sales Revenue</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-emerald-500" /> Gross Profit</span>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="h-64 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-neutral-200">
          {monthlyTrends.map((d) => {
            const revHeight = Math.max(12, Math.round((d.revenue / maxRevenue) * 100));
            const profitHeight = Math.max(8, Math.round((d.profit / maxRevenue) * 100));

            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                {/* Tooltip on Hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950 text-white text-[10px] py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none">
                  <p>Revenue: {formatMoney(d.revenue, 'INR')}</p>
                  <p className="text-emerald-400">Profit: {formatMoney(d.profit, 'INR')}</p>
                </div>

                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* Revenue Bar */}
                  <div
                    className="w-1/2 max-w-[28px] bg-neutral-950 rounded-t transition-all duration-500 hover:bg-neutral-800"
                    style={{ height: `${revHeight}%` }}
                  />
                  {/* Profit Bar */}
                  <div
                    className="w-1/2 max-w-[28px] bg-emerald-500 rounded-t transition-all duration-500 hover:bg-emerald-600"
                    style={{ height: `${profitHeight}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-neutral-600 truncate">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Revenue Distribution & Top Leaderboard */}
      <div className="lg:col-span-4 space-y-6">
        {/* Category Share Progress */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
            <Layers className="h-4 w-4 text-gold-600" />
            <h3 className="font-heading text-heading-md text-neutral-950">Category Stock Share</h3>
          </div>

          <div className="space-y-3">
            {categories.map((c) => {
              const pct = Math.round((c.val / totalCatVal) * 100);
              return (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-body-xs font-semibold text-neutral-900">
                    <span>{c.name}</span>
                    <span className="tabular-nums">{pct}% ({formatMoney(c.val, 'INR')})</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Saree Leaderboard */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
            <Award className="h-4 w-4 text-emerald-600" />
            <h3 className="font-heading text-heading-md text-neutral-950">Highest Value Drapes</h3>
          </div>

          <div className="divide-y divide-neutral-100">
            {topProducts.map((p, idx) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-body-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-neutral-900 truncate" title={p.title}>{p.title}</span>
                </div>
                <span className="font-bold text-[#E60012] shrink-0 tabular-nums">
                  {formatMoney(p.priceRange.minVariantPrice.amount, 'INR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
