'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/types/shopify';

interface CollectionFilterPillsProps {
  products: Product[];
  collectionHandle: string;
}

const FABRIC_FILTERS = ['Silk', 'Cotton', 'Linen', 'Organza', 'Georgette', 'Velvet'];
const OCCASION_FILTERS = ['Bridal', 'Festive', 'Casual', 'Party', 'Work'];

export function CollectionFilterPills({ products, collectionHandle }: CollectionFilterPillsProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Determine which filters are relevant based on product data
  const availableFilters = useMemo(() => {
    const filters: string[] = [];
    const productText = products.map((p) => 
      `${p.title} ${p.description} ${p.productType || ''} ${Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || '')}`
    ).join(' ').toLowerCase();

    for (const f of FABRIC_FILTERS) {
      if (productText.includes(f.toLowerCase())) {
        filters.push(f);
      }
    }
    for (const f of OCCASION_FILTERS) {
      if (productText.includes(f.toLowerCase())) {
        filters.push(f);
      }
    }
    return filters;
  }, [products]);

  // Count products matching active filter
  const filteredCount = useMemo(() => {
    if (!activeFilter) return products.length;
    return products.filter((p) => {
      const text = `${p.title} ${p.description} ${p.productType || ''} ${Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || '')}`.toLowerCase();
      return text.includes(activeFilter.toLowerCase());
    }).length;
  }, [products, activeFilter]);

  if (availableFilters.length === 0) return null;

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="container py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* All pill */}
          <button
            type="button"
            onClick={() => setActiveFilter(null)}
            className={`flex-shrink-0 inline-flex items-center px-4 py-2 rounded-full text-caption font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeFilter === null
                ? 'bg-neutral-950 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All ({products.length})
          </button>

          {availableFilters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(isActive ? null : filter)}
                className={`flex-shrink-0 inline-flex items-center px-4 py-2 rounded-full text-caption font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-neutral-950 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {filter}
              </button>
            );
          })}

          {/* Animated result count */}
          {activeFilter && (
            <span className="flex-shrink-0 text-caption text-neutral-500 font-medium ml-2 animate-fade-in">
              {filteredCount} {filteredCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
