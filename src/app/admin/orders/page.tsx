'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, PackageOpen, Search, CheckCircle2, X, Truck, Clock, Check, Printer, User, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/Image';
import type { StoredOrder } from '@/types/admin';
import { useToast } from '@/context/ToastContext';

const STATUS_STYLES: Record<string, string> = {
  Fulfilled: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  Processing: 'bg-amber-100 text-amber-900 border-amber-300',
  Shipped: 'bg-sky-100 text-sky-900 border-sky-300',
};

const AVAILABLE_STATUSES = ['Processing', 'Shipped', 'Fulfilled'] as const;

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: StoredOrder[]) => setOrders(data))
      .catch(() => setOrders([]));
  }, []);

  const statuses = ['All', 'Processing', 'Shipped', 'Fulfilled'];

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.name.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.orderNumber.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      const updatedOrder = (await res.json()) as StoredOrder;

      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      showToast(`Order ${updatedOrder.orderNumber} updated to ${newStatus}`, 'success');
    } catch {
      showToast('Could not update order status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

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
              <span className="overline text-gold-600 block mb-1">Customer Order Operations</span>
              <h1 className="font-heading text-display-md text-neutral-950 mb-1">Storefront Orders &amp; Dispatch</h1>
            </div>
            <span className="badge-gold text-[10px] uppercase font-bold self-start sm:self-auto">{orders.length} Total Orders</span>
          </div>
        </div>
      </header>

      <section className="section py-8" aria-label="Orders list">
        <div className="container max-w-6xl space-y-6">
          {/* Controls Bar: Search & Status Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex bg-white p-1 rounded-xl border border-neutral-200 shadow-sm w-full lg:w-auto overflow-x-auto scrollbar-hide" role="tablist" aria-label="Order status filters">
              {statuses.map((status) => (
                <button
                  key={status}
                  role="tab"
                  aria-selected={statusFilter === status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex items-center gap-2 py-2 px-4 text-body-xs font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-all flex-1 lg:flex-none justify-center ${
                    statusFilter === status ? 'bg-neutral-950 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="h-4 w-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order no., customer, email..."
                className="input pl-10 text-body-sm min-h-[44px] bg-white border-neutral-200 shadow-sm"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="card p-12 text-center space-y-3 max-w-md mx-auto bg-white border border-neutral-200 rounded-2xl shadow-sm">
              <PackageOpen className="h-10 w-10 text-neutral-300 mx-auto" />
              <h2 className="font-heading text-heading-md text-neutral-950">No Orders Found</h2>
              <p className="text-body-sm text-neutral-500">Customer checkout orders will automatically populate here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((order) => (
                <div
                  key={order.id}
                  className="card p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                      <div>
                        <span className="font-mono text-body-xs font-bold text-neutral-950 bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-md">
                          {order.orderNumber}
                        </span>
                        <p className="text-caption text-neutral-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 text-caption font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          STATUS_STYLES[order.status] || 'bg-neutral-100 text-neutral-800 border-neutral-200'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {order.status}
                      </span>
                    </div>

                    {/* Customer Contact */}
                    <div className="bg-neutral-50/80 p-3 rounded-xl border border-neutral-200 text-body-xs space-y-1">
                      <p className="font-bold text-neutral-950 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-gold-600" /> {order.name}
                      </p>
                      <p className="text-caption text-neutral-500 flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-neutral-400" /> {order.email}
                      </p>
                    </div>

                    {/* Line Items */}
                    <div className="space-y-2.5">
                      {order.lineItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                            <OptimizedImage src={item.image} alt={item.title} width={48} height={48} objectFit="cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-body-xs font-bold text-neutral-950 truncate">
                              {item.title}
                            </p>
                            <p className="text-caption text-neutral-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-body-xs font-bold text-[#E60012] tabular-nums">
                            {formatMoney(order.total, order.currencyCode as 'INR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Total Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Total Amount</span>
                      <p className="text-body-sm font-bold text-[#E60012] tabular-nums">{formatMoney(order.total, order.currencyCode as 'INR')}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}/print`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 bg-white text-neutral-800 border border-neutral-300 text-caption font-bold uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors shadow-sm"
                      >
                        <Printer className="h-3.5 w-3.5 text-neutral-600" />
                        Print Invoice
                      </Link>

                      {order.status !== 'Fulfilled' && (
                        <button
                          type="button"
                          disabled={updatingStatus}
                          onClick={() => handleUpdateStatus(order.id, 'Fulfilled')}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-caption font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Fulfill
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}