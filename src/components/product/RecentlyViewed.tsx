'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types/shopify';

const RECENTLY_VIEWED_KEY = 'aura_recently_viewed_products';

export function recordRecentlyViewed(product: Product) {
  if (typeof window === 'undefined' || !product?.id) return;
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let list: Product[] = raw ? JSON.parse(raw) : [];
    // Remove duplicate if already present
    list = list.filter((p) => p.id !== product.id);
    // Unshift to top of array
    list.unshift(product);
    // Limit to 6 items
    list = list.slice(0, 6);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
  } catch {}
}

export function RecentlyViewed({ currentProductId, className }: { currentProductId?: string; className?: string }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (raw) {
        let list: Product[] = JSON.parse(raw);
        if (currentProductId) {
          list = list.filter((p) => p.id !== currentProductId);
        }
        setItems(list);
      }
    } catch {}
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className={`py-12 bg-white border-t border-neutral-200 ${className || ''}`} aria-labelledby="recently-viewed-heading">
      <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1 block">
              Your History
            </span>
            <h2 id="recently-viewed-heading" className="font-sans text-heading-md sm:text-heading-lg font-bold tracking-tight text-neutral-950">
              Recently Viewed Drapes
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} showQuickAdd={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
