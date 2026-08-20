'use client';

import Link from 'next/link';
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
      <h3 className="font-sans text-body-sm font-bold uppercase tracking-wider text-neutral-950 mb-4">
        Complete the Look
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {products.slice(0, 3).map((product) => {
          const price = product.priceRange.minVariantPrice.amount;
          const currencyCode = product.priceRange.minVariantPrice.currencyCode;
          const image = product.featuredImage;

          return (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className="group flex-shrink-0 w-[140px] sm:w-[160px]"
            >
              <div className="relative aspect-4-5 overflow-hidden bg-neutral-100 mb-2">
                {image && (
                  <OptimizedImage
                    src={image.url}
                    alt={image.altText || product.title}
                    fill
                    objectFit="cover"
                    className="group-hover:scale-[1.03] transition-transform duration-500 ease-expo"
                  />
                )}
              </div>
              <p className="font-sans text-caption font-semibold text-neutral-800 group-hover:text-[#E60012] transition-colors line-clamp-1">
                {product.title}
              </p>
              <p className="font-sans text-caption font-bold text-neutral-950 tabular-nums">
                {formatMoney(price, currencyCode)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
