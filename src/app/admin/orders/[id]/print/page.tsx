'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, CheckCircle2, MapPin, Package, Phone, Mail } from 'lucide-react';
import { formatMoney } from '@/lib/utils';
import type { StoredOrder } from '@/types/admin';

export default function OrderPrintInvoicePage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/admin/orders/${orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <p className="text-body font-medium text-neutral-500">Loading invoice printable view...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 space-y-4">
        <p className="text-body font-bold text-neutral-900">Order not found</p>
        <button onClick={() => window.close()} className="btn-secondary">Close Window</button>
      </div>
    );
  }

  const subtotal = order.subtotal ?? (order.total - Math.round(order.total * 0.05));
  const taxAmount = order.tax ?? Math.round(order.total * 0.05);
  const shippingFee = order.shipping ?? 0;

  return (
    <div className="min-h-screen bg-neutral-100 p-4 sm:p-8 print:p-0 print:bg-white text-neutral-950 font-sans">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={() => window.history.back()}
          className="btn-secondary text-body-xs inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </button>

        <button
          onClick={() => window.print()}
          className="btn-primary text-body-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 bg-[#E60012] text-white px-5 py-2.5 rounded-lg shadow-md"
        >
          <Printer className="h-4 w-4" /> Print Tax Invoice &amp; Packing Slip
        </button>
      </div>

      {/* Printable Sheet (A4 Dimensions) */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-xl print:shadow-none border border-neutral-300 print:border-none print:p-0 space-y-8">
        {/* Invoice Header */}
        <div className="flex items-start justify-between border-b-2 border-neutral-950 pb-6">
          <div>
            <h1 className="font-heading text-display-md font-extrabold tracking-tight text-neutral-950">AURA</h1>
            <p className="text-caption text-neutral-500 uppercase tracking-widest font-semibold mt-0.5">Handcrafted Sarees &amp; Ethnic Wear</p>
            <p className="text-caption text-neutral-600 mt-2">GSTIN: 27AABCA1234F1Z0 · FSSAI / Textile License: TXT-998822</p>
            <p className="text-caption text-neutral-600">Registered Dispatch Center: Craft House, Lower Parel, Mumbai - 400013</p>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block bg-neutral-950 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded">
              TAX INVOICE
            </span>
            <p className="font-heading text-heading-sm font-bold text-neutral-950 mt-1">Invoice #{order.orderNumber}</p>
            <p className="text-caption text-neutral-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p className="text-caption font-bold text-emerald-700">Status: {order.status.toUpperCase()}</p>
          </div>
        </div>

        {/* Dispatch & Customer Addresses */}
        <div className="grid grid-cols-2 gap-8 text-body-xs bg-neutral-50 p-5 rounded-xl border border-neutral-200">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">Billed &amp; Shipped To</span>
            <p className="font-bold text-neutral-950 text-body-sm">{order.name}</p>
            {order.address && (
              <p className="text-neutral-700 leading-snug mt-1">
                {order.address.addressLine}<br />
                {order.address.city}, {order.address.state || ''} - {order.address.pincode}
              </p>
            )}
            <p className="text-neutral-600 mt-2 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-neutral-400" /> {order.email}</p>
            {order.phone && <p className="text-neutral-600 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-neutral-400" /> {order.phone}</p>}
          </div>

          <div className="space-y-2 border-l border-neutral-200 pl-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 block mb-1">Dispatch Details</span>
            <p className="text-neutral-700"><strong>Courier Partner:</strong> Standard Express Courier</p>
            <p className="text-neutral-700"><strong>AWB Airway Bill:</strong> AURA-{order.orderNumber.replace('#', '')}-IND</p>
            <p className="text-neutral-700"><strong>Payment Method:</strong> {order.paymentMethod || 'COD'}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-3">
          <h3 className="font-heading text-body font-bold text-neutral-950 uppercase tracking-wider text-[11px]">Saree &amp; Apparel Particulars</h3>
          <table className="w-full text-left border-collapse text-body-xs">
            <thead>
              <tr className="border-b-2 border-neutral-950 bg-neutral-100 text-neutral-700 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">HSN Code</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.lineItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-3 font-semibold text-neutral-950">
                    {item.title}
                    {(item as any).customizations && (
                      <div className="text-[10px] text-neutral-500 font-normal mt-0.5">
                        {Object.entries((item as any).customizations).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center text-neutral-500 font-mono text-[11px]">5007 (Silk)</td>
                  <td className="py-3 px-3 text-center font-bold text-neutral-950">{item.quantity}</td>
                  <td className="py-3 px-3 text-right text-neutral-700 tabular-nums">{formatMoney(order.total / item.quantity, order.currencyCode)}</td>
                  <td className="py-3 px-3 text-right font-bold text-neutral-950 tabular-nums">{formatMoney(order.total, order.currencyCode)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end pt-4 border-t border-neutral-200">
          <div className="w-64 space-y-2 text-body-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal (Excl. Tax):</span>
              <span className="tabular-nums font-medium">{formatMoney(subtotal, order.currencyCode)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>GST Textile (5%):</span>
              <span className="tabular-nums font-medium">{formatMoney(taxAmount, order.currencyCode)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Shipping Charge:</span>
              <span className="font-semibold text-emerald-700">
                {shippingFee > 0 ? formatMoney(shippingFee, order.currencyCode) : 'COMPLIMENTARY'}
              </span>
            </div>
            <div className="border-t-2 border-neutral-950 pt-2 flex justify-between text-body font-bold text-neutral-950">
              <span>Total Amount Paid:</span>
              <span className="tabular-nums">{formatMoney(order.total, order.currencyCode)}</span>
            </div>
          </div>
        </div>

        {/* Footer Policy Fine Print */}
        <div className="border-t border-neutral-300 pt-6 text-[10px] text-neutral-500 space-y-1">
          <p className="font-bold text-neutral-950 uppercase tracking-widest">Handloom Authenticity &amp; Care Note</p>
          <p>Thank you for supporting traditional Indian master weavers. Dry clean only recommended for pure Kanjeevaram &amp; Banarasi silks.</p>
          <p>For return or exchange inquiries within 14 days, please email hello@aura.com or WhatsApp +91 98765 43210.</p>
        </div>
      </div>
    </div>
  );
}
