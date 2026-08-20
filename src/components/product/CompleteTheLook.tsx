'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/Image';
import { formatMoney } from '@/lib/utils';
import type { Product } from '@/types/shopify';

interface CompleteTheLookProps {
  products: Product[];
  className?: string;
}

export function CompleteTheLook({ products, className }: CompleteTheLookProps) {
  if (products.length === 0) return null;

  return (
    <div className={className}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="font-sans text-caption font-semibold uppercase tracking-[0.16em] text-ink">
          Complete the Look
        </h3>
        <span className="text-caption text-faint">Pairs well with</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {products.slice(0, 3).map((product, idx) => {
          const price = product.priceRange.minVariantPrice.amount;
          const currencyCode = product.priceRange.minVariantPrice.currencyCode;
          const image = product.featuredImage;

          return (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group relative flex-shrink-0 w-[152px] sm:w-[168px]"
            >
              <div className="relative aspect-4-5 overflow-hidden bg-sunken">
                {image && (
                  <OptimizedImage
                    src={image.url}
                    alt={image.altText || product.title}
                    fill
                    objectFit="cover"
                    className="transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
                  />
                )}
                <span className="absolute top-2.5 left-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-ink tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="absolute top-2.5 right-2.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity duration-fast group-hover:opacity-100 dark:bg-white/90">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="pt-2.5 flex items-baseline justify-between gap-2">
                <p className="text-body-xs font-medium text-ink line-clamp-1 group-hover:text-accent transition-colors duration-fast">
                  {product.title}
                </p>
                <p className="text-body-xs font-medium text-ink tabular-nums whitespace-nowrap">
                  {formatMoney(price, currencyCode)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}