'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Package, Archive, ExternalLink, ShieldCheck, Tag, DollarSign, Layers, TrendingUp, Sparkles, ShoppingBag, ArrowUpRight, Award, Users, Truck, Printer, Settings, Eye, LayoutGrid, FileText, ChevronRight } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import type { Product } from '@/types/shopify';
import type { StoredOrder } from '@/types/admin';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/context/ToastContext';
import { OptimizedImage } from '@/components/ui/Image';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<{ id: string; title: string } | null>(null);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/products?first=100').then((res) => (res.ok ? res.json() : { edges: [] })),
      fetch('/api/admin/orders').then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([productsData, ordersData]) => {
        setCustomProducts(productsData.edges ? productsData.edges.map((e: { node: Product }) => e.node) : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const confirmArchive = async () => {
    if (!archiveTarget) return;
    setArchiving(true);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(archiveTarget.id)}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomProducts((prev) => prev.filter((p) => p.id !== archiveTarget.id));
        showToast(`Product "${archiveTarget.title}" has been archived.`, 'success');
      } else {
        showToast('Failed to archive product. Please try again.', 'error');
      }
    } catch {
      showToast('An error occurred while archiving product.', 'error');
    } finally {
      setArchiving(false);
      setArchiveTarget(null);
    }
  };

  // ── Financial & Profit Calculations for Entrepreneur ──
  const totalRetailValue = customProducts.reduce((sum, p) => {
    const unitPrice = p.priceRange.minVariantPrice.amount || 0;
    const qty = p.totalInventory || 10;
    return sum + unitPrice * qty;
  }, 0);

  // Assuming average sourcing/manufacturing cost is 45% of retail price (55% profit margin)
  const totalInvestment = Math.round(totalRetailValue * 0.45);
  const projectedGrossProfit = totalRetailValue - totalInvestment;
  const marginPercentage = totalRetailValue > 0 ? ((projectedGrossProfit / totalRetailValue) * 100).toFixed(1) : '55.0';

  const realizedRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const realizedProfit = Math.round(realizedRevenue * 0.55);

  const handleExportFinancialCSV = () => {
    const headers = ['Product Handle', 'Title', 'Category', 'Stock Qty', 'Retail Price (INR)', 'Est. Unit Cost (INR)', 'Est. Unit Profit (INR)', 'Total Retail Value (INR)', 'Projected Gross Profit (INR)'];
    const rows = customProducts.map((p) => {
      const price = p.priceRange.minVariantPrice.amount || 0;
      const qty = p.totalInventory || 10;
      const estCost = Math.round(price * 0.45);
      const estProfit = price - estCost;
      const totalVal = price * qty;
      const projProfit = estProfit * qty;
      return [
        `"${p.handle}"`,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.productType || 'Sarees'}"`,
        qty,
        price,
        estCost,
        estProfit,
        totalVal,
        projProfit
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AURA_Financial_Profit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Financial & Profit CSV report downloaded successfully!', 'success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      {/* Header */}
      <header className="section-sm bg-white border-b border-neutral-200">
        <div className="container">
          <nav className="flex items-center gap-2 text-caption text-neutral-500 mb-4" aria-label="Breadcrumb">
            <span className="text-neutral-950 font-medium">Store Admin</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="overline text-gold-600 block mb-1">Entrepreneur Dashboard</span>
              <h1 className="font-heading text-display-md text-neutral-950">Financial &amp; Profit Analytics</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleExportFinancialCSV}
                className="btn-secondary inline-flex items-center gap-2 text-emerald-800 border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
              >
                Export Financial CSV
              </button>
              <Link href="/admin/orders" className="btn-secondary inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Orders ({orders.length})
              </Link>
              <Link href="/admin/inventory" className="btn-secondary inline-flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory Stock
              </Link>
              <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Product
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Admin Suite Operations Command Hub ── */}
      <section className="py-6 bg-cream-100/60 border-b border-neutral-200" aria-label="Admin command hub">
        <div className="container space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-gold-600" />
              <h2 className="font-heading text-heading-md text-neutral-950">Enterprise Admin Operations Suite</h2>
            </div>
            <span className="text-caption font-bold text-neutral-500 uppercase tracking-widest">8 Active Modules</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {[
              { title: 'Add Product', desc: 'Catalog Editor', href: '/admin/products/new', icon: Plus, badge: 'New', color: 'bg-red-50 text-[#E60012] border-red-200' },
              { title: 'Inventory', desc: `${customProducts.length} Items`, href: '/admin/inventory', icon: Package, badge: 'Stock', color: 'bg-amber-50 text-amber-800 border-amber-200' },
              { title: 'Orders', desc: `${orders.length} Placed`, href: '/admin/orders', icon: ShoppingBag, badge: 'Invoices', color: 'bg-purple-50 text-purple-800 border-purple-200' },
              { title: 'Customers', desc: 'CRM & LTV', href: '/admin/customers', icon: Users, badge: 'Loyalty', color: 'bg-sky-50 text-sky-800 border-sky-200' },
              { title: 'Discounts', desc: 'Promo Coupons', href: '/admin/discounts', icon: Tag, badge: 'Offers', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              { title: 'Weavers', desc: 'Restock POs', href: '/admin/suppliers', icon: Truck, badge: 'Supply', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
              { title: 'CSV Report', desc: 'Financial COGS', href: '#', onClick: handleExportFinancialCSV, icon: FileText, badge: 'Export', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              { title: 'Settings', desc: 'Feature Flags', href: '/admin/settings', icon: Settings, badge: 'Toggles', color: 'bg-neutral-100 text-neutral-800 border-neutral-300' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={item.onClick}
                className={`p-3.5 rounded-xl border ${item.color} hover:shadow-md transition-all flex flex-col justify-between group space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <item.icon className="h-5 w-5" />
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/80 border border-current opacity-80">{item.badge}</span>
                </div>
                <div>
                  <h3 className="font-heading text-body-xs font-bold truncate group-hover:underline">{item.title}</h3>
                  <p className="text-[10px] opacity-80 truncate">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Financial & Profit Stat Cards ── */}
      <section className="py-8 bg-white border-b border-neutral-200" aria-label="Store financial stats">
        <div className="container space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Investment */}
            <div className="card p-5 space-y-2 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <p className="text-caption uppercase text-neutral-500 font-semibold tracking-wider">Total Inventory Capital</p>
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">
                {formatMoney(totalInvestment, 'INR')}
              </p>
              <p className="text-caption text-neutral-500">Capital invested in stock COGS</p>
            </div>

            {/* Catalog Retail Value */}
            <div className="card p-5 space-y-2 border-l-4 border-l-sky-500">
              <div className="flex items-center justify-between">
                <p className="text-caption uppercase text-neutral-500 font-semibold tracking-wider">Catalog Retail Value</p>
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">
                {formatMoney(totalRetailValue, 'INR')}
              </p>
              <p className="text-caption text-neutral-500">{customProducts.length} published products</p>
            </div>

            {/* Projected Gross Profit */}
            <div className="card p-5 space-y-2 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <p className="text-caption uppercase text-neutral-500 font-semibold tracking-wider">Projected Gross Profit</p>
                <span className="badge-gold text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border-emerald-200">
                  +{marginPercentage}% Margin
                </span>
              </div>
              <p className="font-heading text-display-sm text-emerald-700 tabular-nums">
                {formatMoney(projectedGrossProfit, 'INR')}
              </p>
              <p className="text-caption text-emerald-600 font-medium">Expected sell-out earnings</p>
            </div>

            {/* Realized Sales Revenue */}
            <div className="card p-5 space-y-2 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <p className="text-caption uppercase text-neutral-500 font-semibold tracking-wider">Realized Checkout Sales</p>
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">
                {formatMoney(realizedRevenue, 'INR')}
              </p>
              <p className="text-caption text-neutral-500">Realized Profit: <strong className="text-emerald-700">{formatMoney(realizedProfit, 'INR')}</strong></p>
            </div>
          </div>

          {/* ── Entrepreneur Motivation & Selling Insights Banner ── */}
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-gold-400 text-caption font-bold uppercase tracking-widest">
                <Sparkles className="h-4 w-4 text-gold-400" />
                <span>Entrepreneur Strategy Insights</span>
              </div>
              <h2 className="font-heading text-heading-lg text-white">
                Sarees yield a high 55%+ profit margin per drape
              </h2>
              <p className="text-body-sm text-neutral-300 leading-relaxed">
                Your store currently holds <strong className="text-white">{formatMoney(totalRetailValue, 'INR')}</strong> in retail inventory with a potential net profit of <strong className="text-emerald-400">{formatMoney(projectedGrossProfit, 'INR')}</strong>. Silk Sarees (Kanjeevaram &amp; Banarasi) drive the highest customer basket size.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/admin/products/new"
                className="inline-flex items-center justify-center gap-2 bg-[#E60012] hover:bg-red-700 text-white text-caption font-bold uppercase tracking-wider px-6 py-3 rounded-md transition-colors shadow-md"
              >
                <span>Add More Products</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ── Visual Analytics Charts ── */}
          <AnalyticsCharts
            products={customProducts}
            totalRevenue={realizedRevenue || totalRetailValue * 0.3}
            totalProfit={realizedProfit || projectedGrossProfit * 0.3}
          />
        </div>
      </section>

      {/* Product List */}
      <section className="section" aria-label="Custom products list">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-heading-lg text-neutral-950">Published Catalog Products ({customProducts.length})</h2>
            <Link href="/collections" className="text-body-sm text-gold-600 hover:underline flex items-center gap-1">
              View All on Storefront <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!loaded ? (
            <div className="py-12 text-center text-neutral-500">Loading catalog...</div>
          ) : customProducts.length === 0 ? (
            <div className="card p-10 text-center space-y-4 max-w-lg mx-auto">
              <Package className="h-12 w-12 text-neutral-300 mx-auto" />
              <h3 className="font-heading text-heading-md text-neutral-950">No Custom Products Added Yet</h3>
              <p className="text-body-sm text-neutral-600">
                You haven&apos;t published any custom products yet. Click below to add your first piece to the storefront.
              </p>
              <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add First Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customProducts.map((product) => {
                const imgNode = product.featuredImage || product.images.edges[0]?.node;
                const price = product.priceRange.minVariantPrice.amount;
                const currency = product.priceRange.minVariantPrice.currencyCode;
                const estCost = Math.round(price * 0.45);
                const estProfit = price - estCost;

                return (
                  <article key={product.id} className="card p-5 flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-colors">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-24 rounded overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        {imgNode?.url ? (
                          <OptimizedImage src={imgNode.url} alt={imgNode.altText || product.title} fill objectFit="cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="badge-gold text-[10px] px-2 py-0.5">{product.productType || 'Sarees'}</span>
                        <h3 className="font-sans text-body-sm font-semibold text-neutral-950 truncate" title={product.title}>
                          {product.title}
                        </h3>
                        <p className="text-body-sm font-bold text-[#E60012] tabular-nums">{formatMoney(price, currency)}</p>
                        <p className="text-caption text-neutral-500">Est. Profit: <span className="text-emerald-700 font-semibold">{formatMoney(estProfit, currency)}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200 text-caption text-neutral-500">
                      <span>Stock: <strong className="text-neutral-950">{product.totalInventory ?? 10} pcs</strong></span>
                      <div className="flex items-center gap-2">
                        <Link href={`/products/${product.handle}`} target="_blank" className="hover:text-neutral-950 transition-colors" title="Preview on Storefront">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setArchiveTarget({ id: product.id, title: product.title })}
                          className="hover:text-red-600 transition-colors"
                          title="Archive Product"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Archive Modal */}
      <ConfirmModal
        isOpen={!!archiveTarget}
        title="Archive Product"
        description={`Are you sure you want to archive "${archiveTarget?.title}"? It will be removed from the public storefront.`}
        confirmText="Archive Product"
        cancelText="Cancel"
        variant="danger"
        loading={archiving}
        onConfirm={confirmArchive}
        onClose={() => setArchiveTarget(null)}
      />
    </div>
  );
}
