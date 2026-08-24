'use client';

import { useState, useEffect } from 'react';
import { Layers, X, Trash2, ArrowRight, Check } from 'lucide-react';
import { getLocalFeatureFlags } from '@/lib/feature-flags';
import { formatMoney } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/Image';
import type { Product } from '@/types/shopify';

const COMPARE_STORAGE_KEY = 'aura_compare_sarees_list';

export function addToCompareList(product: Product): { success: boolean; message: string } {
  if (typeof window === 'undefined') return { success: false, message: 'Browser required' };
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
    let list: Product[] = raw ? JSON.parse(raw) : [];

    if (list.some((p) => p.id === product.id)) {
      return { success: false, message: 'Saree is already in your comparison list' };
    }

    if (list.length >= 3) {
      return { success: false, message: 'You can compare up to 3 sarees at a time' };
    }

    list.push(product);
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('aura_compare_updated'));
    return { success: true, message: `Added "${product.title}" to compare list` };
  } catch {
    return { success: false, message: 'Could not add to compare list' };
  }
}

export function CompareDrawer() {
  const [enabled, setEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Product[]>([]);

  const loadList = () => {
    try {
      const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      else setItems([]);
    } catch {}
  };

  useEffect(() => {
    const flags = getLocalFeatureFlags();
    setEnabled(flags.compareDrawer);

    loadList();

    const handleFlagUpdate = () => {
      const updated = getLocalFeatureFlags();
      setEnabled(updated.compareDrawer);
      if (!updated.compareDrawer) setIsOpen(false);
    };

    window.addEventListener('aura_feature_flags_updated', handleFlagUpdate);
    window.addEventListener('aura_compare_updated', loadList);

    return () => {
      window.removeEventListener('aura_feature_flags_updated', handleFlagUpdate);
      window.removeEventListener('aura_compare_updated', loadList);
    };
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter((p) => p.id !== id);
    setItems(updated);
    localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(updated));
    if (updated.length === 0) setIsOpen(false);
  };

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem(COMPARE_STORAGE_KEY);
    setIsOpen(false);
  };

  if (!enabled || items.length === 0) return null;

  return (
    <>
      {/* Floating Compare Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2.5 bg-neutral-950 text-white px-4 py-3 rounded-full shadow-2xl hover:bg-neutral-800 transition-all transform hover:scale-105 border border-neutral-800"
        >
          <Layers className="h-4 w-4 text-gold-400" />
          <span className="text-body-xs font-bold uppercase tracking-wider">Compare ({items.length})</span>
        </button>
      </div>

      {/* Compare Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Side-by-Side Comparison</span>
                <h2 className="font-heading text-display-sm font-medium text-neutral-950">Compare Sarees &amp; Fabrics</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-body-xs text-neutral-500 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Side by Side Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-x-auto">
              {items.map((product) => {
                const imgNode = product.featuredImage || product.images.edges[0]?.node;
                const price = product.priceRange.minVariantPrice.amount;
                const currency = product.priceRange.minVariantPrice.currencyCode;
                const isSaree = product.productType?.toLowerCase().includes('saree');

                return (
                  <div key={product.id} className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="relative aspect-4-5 rounded-lg overflow-hidden bg-neutral-200">
                        {imgNode?.url && (
                          <OptimizedImage src={imgNode.url} alt={product.title} fill objectFit="cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-neutral-600 hover:text-red-600 shadow-md transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div>
                        <span className="badge-gold text-[9px] px-2 py-0.5">{product.productType || 'Sarees'}</span>
                        <h3 className="font-heading text-body font-medium text-neutral-950 truncate mt-1">{product.title}</h3>
                        <p className="text-body-sm font-bold text-[#E60012] tabular-nums mt-0.5">{formatMoney(price, currency)}</p>
                      </div>

                      {/* Specs List */}
                      <ul className="text-body-xs text-neutral-600 space-y-1.5 pt-2 border-t border-neutral-200">
                        <li className="flex justify-between">
                          <span className="text-neutral-400">Drape Length:</span>
                          <span className="font-semibold text-neutral-900">{isSaree ? '5.5m + 0.8m Blouse' : 'Standard'}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-neutral-400">Blouse Piece:</span>
                          <span className="font-semibold text-neutral-900">Included</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-neutral-400">Handloom Mark:</span>
                          <span className="font-semibold text-emerald-700">Certified</span>
                        </li>
                      </ul>
                    </div>

                    <a
                      href={`/products/${product.handle}`}
                      className="w-full btn-primary text-caption font-bold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
