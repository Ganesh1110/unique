'use client';

import { useMemo, useState } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { LookbookStrip, SAREE_LOOKBOOKS } from '@/components/product/LookbookStrip';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/shopify';

interface CollectionBrowserProps {
  products: Product[];
  collectionHandle: string;
  interleaveLookbooks?: boolean;
}

const FABRIC_FILTERS = ['Silk', 'Cotton', 'Linen', 'Organza', 'Georgette', 'Velvet'];
const OCCASION_FILTERS = ['Bridal', 'Festive', 'Casual', 'Party', 'Work'];

function productText(p: Product): string {
  return `${p.title} ${p.description} ${p.productType || ''} ${Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || '')}`.toLowerCase();
}

const ROW_SIZE = 8;

export function CollectionBrowser({
  products,
  collectionHandle,
  interleaveLookbooks = false,
}: CollectionBrowserProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const availableFilters = useMemo(() => {
    const filters: string[] = [];
    const text = products.map(productText).join(' ');
    for (const f of FABRIC_FILTERS) {
      if (text.includes(f.toLowerCase())) filters.push(f);
    }
    for (const f of OCCASION_FILTERS) {
      if (text.includes(f.toLowerCase())) filters.push(f);
    }
    return filters;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!activeFilter) return products;
    return products.filter((p) => productText(p).includes(activeFilter.toLowerCase()));
  }, [products, activeFilter]);

  const resultCount = filteredProducts.length;

  // Interleave lookbook editorial strips between grid rows (All view only)
  const lookbooks = interleaveLookbooks ? SAREE_LOOKBOOKS : [];
  const showInterleaved = activeFilter === null;

  const renderRow = (startIndex: number, endIndex: number) => {
    const slice = filteredProducts.slice(startIndex, endIndex);
    return <ProductGrid key={`row-${startIndex}`} products={slice} columns={4} />;
  };

  const rows: React.ReactNode[] = [];
  for (let i = 0; i < resultCount; i += ROW_SIZE) {
    rows.push(renderRow(i, i + ROW_SIZE));
    const lookbookIndex = Math.floor(i / ROW_SIZE);
    if (showInterleaved && lookbooks[lookbookIndex]) {
      rows.push(<LookbookStrip key={`lookbook-${i}`} {...lookbooks[lookbookIndex]} className="my-12 lg:my-16" />);
    }
  }

  if (availableFilters.length === 0 && rows.length === 0) return null;

  return (
    <div>
      {/* Filter pills — actually filter the grid client-side */}
      <div className="bg-surface border-b border-ink/10">
        <div className="container py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide" role="group" aria-label="Filter products">
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              aria-pressed={activeFilter === null}
              className={cn(
                'flex-shrink-0 inline-flex items-center px-4 py-2 rounded-full text-caption font-semibold uppercase tracking-wider transition-all duration-200',
                activeFilter === null
                  ? 'bg-accent text-accent-ink shadow-soft'
                  : 'bg-sunken text-ink/70 hover:bg-accent/10 hover:text-ink'
              )}
            >
              All ({products.length})
            </button>

            {availableFilters.map((filter) => {
              const isActive = activeFilter === filter;
              const count = products.filter((p) => productText(p).includes(filter.toLowerCase())).length;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(isActive ? null : filter)}
                  aria-pressed={isActive}
                  className={cn(
                    'flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-caption font-semibold uppercase tracking-wider transition-all duration-200',
                    isActive
                      ? 'bg-accent text-accent-ink shadow-soft'
                      : 'bg-sunken text-ink/70 hover:bg-accent/10 hover:text-ink'
                  )}
                >
                  {filter}
                  <span className={cn('tabular-nums font-medium', isActive ? 'text-accent-ink/70' : 'text-faint')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products + interleaved lookbooks */}
      <section className="section" aria-labelledby="products-heading">
        <div className="container">
          <div className="flex items-center justify-between gap-4 mb-10">
            <h2 id="products-heading" className="sr-only">Products</h2>
            <p className="text-body-sm text-faint" aria-live="polite">
              {resultCount} {resultCount !== 1 ? 'pieces' : 'piece'}
              {activeFilter && (
                <>
                  {' '}· <span className="text-ink font-medium capitalize">{activeFilter}</span>
                </>
              )}
            </p>
          </div>

          {rows.length > 0 ? (
            <div className="space-y-12 lg:space-y-0">{rows}</div>
          ) : (
            <p className="text-body text-faint py-12 text-center">No pieces match this filter.</p>
          )}
        </div>
      </section>

      <span className="hidden" data-collection-handle={collectionHandle} aria-hidden="true" />
    </div>
  );
}