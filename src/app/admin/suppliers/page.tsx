'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Plus, ArrowLeft, Phone, MapPin, CheckCircle2, Clock, Truck, MessageCircle, DollarSign, Filter, Sparkles, X } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { formatMoney } from '@/lib/utils';

interface WeaverSupplierOrder {
  id: string;
  masterWeaver: string;
  location: 'Kanchipuram, Tamil Nadu' | 'Varanasi, Uttar Pradesh' | 'Chanderi, Madhya Pradesh';
  phone: string;
  sareeDescription: string;
  quantity: number;
  totalCost: number;
  advancePaid: number;
  expectedDate: string;
  status: 'Weaving In Progress' | 'In Transit' | 'Received & QC Passed';
}

const DEFAULT_WEAVER_ORDERS: WeaverSupplierOrder[] = [
  {
    id: 'PO-2026-0801',
    masterWeaver: 'Sri Varadaraja Handloom Guild (Master Weaver Murugan)',
    location: 'Kanchipuram, Tamil Nadu',
    phone: '+919840012345',
    sareeDescription: '10x Kanjeevaram Mulberry Silk Sarees (Bridal Crimson & Gold Zari)',
    quantity: 10,
    totalCost: 180000,
    advancePaid: 90000,
    expectedDate: '2026-09-05',
    status: 'Weaving In Progress',
  },
  {
    id: 'PO-2026-0802',
    masterWeaver: 'Banaras Zari Heritage Looms (Master Artisan Ansari)',
    location: 'Varanasi, Uttar Pradesh',
    phone: '+919839067890',
    sareeDescription: '8x Banarasi Tanchoi Silk Brocade Sarees (Royal Blue)',
    quantity: 8,
    totalCost: 144000,
    advancePaid: 144000,
    expectedDate: '2026-08-30',
    status: 'In Transit',
  },
  {
    id: 'PO-2026-0715',
    masterWeaver: 'Chanderi Weavers Co-Op',
    location: 'Chanderi, Madhya Pradesh',
    phone: '+919826011223',
    sareeDescription: '15x Chanderi Lightweight Tissue Organza Sarees (Pastels)',
    quantity: 15,
    totalCost: 90000,
    advancePaid: 90000,
    expectedDate: '2026-08-20',
    status: 'Received & QC Passed',
  },
];

export default function AdminSuppliersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<WeaverSupplierOrder[]>(DEFAULT_WEAVER_ORDERS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Weaving In Progress' | 'In Transit' | 'Received & QC Passed'>('ALL');
  const [showNewModal, setShowNewModal] = useState(false);

  // Form State
  const [weaver, setWeaver] = useState('');
  const [location, setLocation] = useState<'Kanchipuram, Tamil Nadu' | 'Varanasi, Uttar Pradesh' | 'Chanderi, Madhya Pradesh'>('Kanchipuram, Tamil Nadu');
  const [phone, setPhone] = useState('+919840012345');
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState('5');
  const [cost, setCost] = useState('75000');
  const [advance, setAdvance] = useState('37500');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weaver.trim() || !desc.trim()) return;

    const newPO: WeaverSupplierOrder = {
      id: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      masterWeaver: weaver,
      location,
      phone,
      sareeDescription: desc,
      quantity: Number(qty),
      totalCost: Number(cost),
      advancePaid: Number(advance),
      expectedDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: 'Weaving In Progress',
    };

    setOrders((prev) => [newPO, ...prev]);
    setShowNewModal(false);
    showToast(`Purchase order ${newPO.id} created successfully!`, 'success');
  };

  const updateStatus = (id: string, newStatus: WeaverSupplierOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    showToast(`Order status updated to "${newStatus}"`, 'info');
  };

  const filteredOrders = activeFilter === 'ALL' ? orders : orders.filter((o) => o.status === activeFilter);

  const totalCommitted = orders.reduce((s, o) => s + o.totalCost, 0);
  const totalAdvance = orders.reduce((s, o) => s + o.advancePaid, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F0]">
      {/* Header */}
      <header className="section-sm bg-white border-b border-neutral-200 shadow-sm">
        <div className="container space-y-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-body-xs text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="overline text-gold-600 block mb-1">Supply Chain &amp; Artisan Restock</span>
              <h1 className="font-heading text-display-md text-neutral-950">Master Weaver Purchase Orders</h1>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="btn-primary text-body-xs font-bold uppercase tracking-wider py-2.5 px-6 bg-[#E60012] hover:bg-red-700 text-white min-h-[44px] inline-flex items-center gap-2 shadow-md self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> New Weaver PO
            </button>
          </div>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="card p-5 space-y-1.5 border-l-4 border-l-gold-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-neutral-500 text-caption font-semibold uppercase">
                <span>Active Weaver POs</span>
                <Truck className="h-4 w-4 text-gold-600" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{orders.length} orders</p>
              <p className="text-caption text-neutral-500">Kanchipuram, Varanasi &amp; Chanderi</p>
            </div>

            <div className="card p-5 space-y-1.5 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-emerald-600 text-caption font-semibold uppercase">
                <span>Total Restock Value</span>
                <DollarSign className="h-4 w-4" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{formatMoney(totalCommitted, 'INR')}</p>
              <p className="text-caption text-emerald-700 font-medium">Committed wholesale PO capital</p>
            </div>

            <div className="card p-5 space-y-1.5 border-l-4 border-l-sky-500 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-sky-600 text-caption font-semibold uppercase">
                <span>Advance Paid vs Due</span>
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="font-heading text-display-sm text-neutral-950 tabular-nums">{formatMoney(totalAdvance, 'INR')}</p>
              <p className="text-caption text-neutral-500">Balance Due: <strong className="text-amber-700">{formatMoney(totalCommitted - totalAdvance, 'INR')}</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="section py-8" aria-label="Weaver purchase orders">
        <div className="container space-y-6 max-w-5xl">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'ALL', label: 'All Purchase Orders' },
              { id: 'Weaving In Progress', label: 'Weaving In Progress' },
              { id: 'In Transit', label: 'In Transit' },
              { id: 'Received & QC Passed', label: 'QC Passed & Stocked' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-body-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-neutral-950 text-white shadow-md'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="divide-y divide-neutral-200 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            {filteredOrders.map((po) => (
              <div key={po.id} className="p-6 space-y-4 hover:bg-neutral-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-body-xs font-bold text-neutral-950 bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-md">{po.id}</span>
                      <span className="text-caption font-semibold text-neutral-600 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-gold-600" /> {po.location}
                      </span>
                    </div>
                    <h3 className="font-heading text-heading-md font-bold text-neutral-950 mt-1">{po.masterWeaver}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-caption font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full ${
                        po.status === 'Weaving In Progress'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : po.status === 'In Transit'
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {po.status === 'Weaving In Progress' && <Clock className="h-3.5 w-3.5" />}
                      {po.status === 'In Transit' && <Truck className="h-3.5 w-3.5" />}
                      {po.status === 'Received & QC Passed' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                      {po.status}
                    </span>
                  </div>
                </div>

                {/* Details Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-body-xs bg-neutral-50/80 p-4 sm:p-5 rounded-xl border border-neutral-200">
                  <div className="sm:col-span-2 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Saree &amp; Weave Batch Details</span>
                    <p className="font-bold text-neutral-950 text-body-sm">{po.sareeDescription}</p>
                    <p className="text-caption text-neutral-500">Expected Batch Arrival: <strong className="text-neutral-900">{po.expectedDate}</strong></p>
                  </div>

                  <div className="space-y-1 sm:border-l border-neutral-200 sm:pl-5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Payment Financials</span>
                    <p className="font-bold text-neutral-950">Total PO Value: {formatMoney(po.totalCost, 'INR')}</p>
                    <p className="text-emerald-700 font-bold">Advance Paid: {formatMoney(po.advancePaid, 'INR')}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <a
                    href={`https://wa.me/${po.phone.replace('+', '')}?text=${encodeURIComponent(`Hi Master Weaver! Regarding Purchase Order ${po.id} (${po.sareeDescription}): Could you please update us on the weaving progress?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-body-xs font-bold flex items-center gap-2 border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors py-2 px-4 rounded-xl"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    WhatsApp Weaver Direct ({po.phone})
                  </a>

                  <div className="flex gap-2">
                    {po.status === 'Weaving In Progress' && (
                      <button
                        onClick={() => updateStatus(po.id, 'In Transit')}
                        className="btn-secondary text-body-xs font-bold py-2 px-4 rounded-xl border-sky-300 text-sky-900 bg-sky-50 hover:bg-sky-100"
                      >
                        Mark In Transit
                      </button>
                    )}
                    {po.status === 'In Transit' && (
                      <button
                        onClick={() => updateStatus(po.id, 'Received & QC Passed')}
                        className="btn-primary text-body-xs font-bold py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      >
                        Mark Stock Received &amp; QC Passed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Purchase Order Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-6 sm:p-8 rounded-2xl max-w-lg w-full space-y-5 border border-neutral-300 shadow-2xl relative">
            <button
              onClick={() => setShowNewModal(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600">Restock Ordering</span>
              <h2 className="font-heading text-heading-md text-neutral-950">Create Weaver Purchase Order</h2>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-body-xs">
              <div>
                <label className="label text-[10px] font-bold">Master Weaver / Guild Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanchipuram Royal Silk Looms"
                  value={weaver}
                  onChange={(e) => setWeaver(e.target.value)}
                  className="input py-2.5 text-body-xs font-semibold"
                />
              </div>

              <div>
                <label className="label text-[10px] font-bold">Weaving Guild Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as any)}
                  className="input py-2.5 text-body-xs font-semibold cursor-pointer"
                >
                  <option value="Kanchipuram, Tamil Nadu">Kanchipuram, Tamil Nadu</option>
                  <option value="Varanasi, Uttar Pradesh">Varanasi, Uttar Pradesh</option>
                  <option value="Chanderi, Madhya Pradesh">Chanderi, Madhya Pradesh</option>
                </select>
              </div>

              <div>
                <label className="label text-[10px] font-bold">Saree Description &amp; Weave Batch</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. 10x Pure Silk Zari Brocade Sarees (Red & Gold)"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="input py-2.5 text-body-xs font-semibold min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-[10px] font-bold">Total PO Cost (₹)</label>
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="input py-2.5 text-body-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="label text-[10px] font-bold">Advance Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={advance}
                    onChange={(e) => setAdvance(e.target.value)}
                    className="input py-2.5 text-body-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button type="button" onClick={() => setShowNewModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary bg-[#E60012] hover:bg-red-700 text-white font-bold uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-md">
                  Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
