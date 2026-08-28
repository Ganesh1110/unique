'use client';

import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatMoney, cn } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types/shopify';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useWishlist } from '@/context/WishlistContext';
import { OptimizedImage } from '@/components/ui/Image';

interface ProductCardProps {
  product: Product;
  variant?: ProductVariant;
  priority?: boolean;
  showQuickAdd?: boolean;
  className?: string;
}

function swatchClass(value: string): string {
  const v = value.toLowerCase();
  if (v.includes('white') || v.includes('ivory') || v.includes('cream')) return 'bg-cream-100';
  if (v.includes('black')) return 'bg-neutral-950';
  if (v.includes('navy')) return 'bg-sky-900';
  if (v.includes('emerald')) return 'bg-emerald-800';
  if (v.includes('olive')) return 'bg-emerald-900';
  if (v.includes('rose') || v.includes('pink')) return 'bg-rose-300';
  if (v.includes('maroon') || v.includes('burgundy')) return 'bg-red-900';
  if (v.includes('mustard')) return 'bg-yellow-500';
  if (v.includes('beige') || v.includes('sand') || v.includes('gold')) return 'bg-amber-100';
  return 'bg-neutral-300';
}

export function ProductCard({ product, variant, priority = false, showQuickAdd = true, className }: ProductCardProps) {
  const { addToCart, isLoading: cartLoading } = useCart();
  const { showToast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickAddLoading, setQuickAddLoading] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const primaryVariant = variant || product.variants.edges[0]?.node;
  const price = primaryVariant?.price.amount || product.priceRange.minVariantPrice.amount;
  const compareAtPrice = primaryVariant?.compareAtPrice?.amount;
  const currencyCode = primaryVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode;
  const available = primaryVariant?.availableForSale ?? product.availableForSale;
  const images = product.images.edges.map(({ node }) => node);
  const featuredImage = product.featuredImage;
  const isSaved = isInWishlist(product.id);
  const onSale = compareAtPrice && compareAtPrice > price;

  // Secondary image doubles as a fabric / texture detail on hover
  const secondaryImage = images.length > 1 ? images[1] : null;

  const finishOption = product.options.find((opt) =>
    ['Finish', 'Material', 'Color', 'Colour'].includes(opt.name)
  );

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!primaryVariant?.id || !available) return;

    setQuickAddLoading(primaryVariant.id);
    try {
      await addToCart(primaryVariant.id, 1);
      showToast(`Added "${product.title}" to bag`, 'success');
    } catch {
      showToast('Could not add item to bag', 'error');
    } finally {
      setQuickAddLoading(null);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isSaved ? `Removed "${product.title}" from saved items` : `Saved "${product.title}" to wishlist`,
      'success'
    );
  };

  return (
    <article
      className={cn('group relative flex flex-col', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image tile — uniform 4:5 */}
      <div
        className={cn(
          'relative overflow-hidden bg-sunken transition-opacity duration-300',
          !available && 'opacity-60'
        )}
      >
        <a
          href={`/products/${product.handle}`}
          aria-label={`${product.title}${onSale ? ' — on sale' : ''}`}
          className="block w-full h-full overflow-hidden"
          data-testid="product-card-link"
        >
          <div className="relative aspect-4-5">
            {/* Primary image */}
            <div
              className={cn(
                'absolute inset-0 transition-opacity ease-expo',
                // Luxury: slow, deliberate crossfade — 700ms
                'duration-[700ms]',
                isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
              )}
            >
              <OptimizedImage
                src={featuredImage?.url || images[0]?.url}
                alt={featuredImage?.altText || product.title}
                fill
                priority={priority}
                objectFit="cover"
                className={cn(
                  'transition-transform ease-expo',
                  // Subtle scale on hover — slower for luxury feel
                  'duration-[1100ms]',
                  isHovered && 'scale-[1.03]'
                )}
              />
            </div>

            {/* Secondary texture / fabric close-up */}
            {secondaryImage && (
              <div
                className={cn(
                  'absolute inset-0 transition-opacity ease-expo duration-[700ms]',
                  isHovered ? 'opacity-100' : 'opacity-0'
                )}
              >
                <OptimizedImage
                  src={secondaryImage.url}
                  alt={secondaryImage.altText || `${product.title} — texture detail`}
                  fill
                  objectFit="cover"
                />
              </div>
            )}
          </div>
        </a>

        {/* Wishlist heart — persistent, photo-overlay chip stays light */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            'absolute top-3 right-3 z-20 inline-flex h-8 w-8 items-center justify-center bg-white/95 backdrop-blur-sm shadow-subtle transition-all duration-200',
            'dark:bg-white/95',
            'sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100',
            isSaved && 'sm:opacity-100'
          )}
          style={{ borderRadius: 0 }}
          aria-label={isSaved ? `Remove ${product.title} from saved items` : `Save ${product.title} to saved items`}
          aria-pressed={isSaved}
        >
          <Heart
            className={cn(
              'h-3.5 w-3.5 transition-colors duration-fast',
              isSaved
                ? 'fill-accent text-accent'
                : 'text-neutral-700 dark:text-neutral-800 hover:text-accent'
            )}
          />
        </button>

        {/* Sale tag — near-black for luxury restraint (not brand accent) */}
        {onSale && available && (
          <span className="absolute top-3 left-3 z-10 badge-sale">
            Sale
          </span>
        )}

        {/* Sold out */}
        {!available && (
          <span className="absolute top-3 left-3 z-10 badge-sold-out">
            Sold Out
          </span>
        )}

        {/* Quick add — hover-reveal, sharp-cornered */}
        {showQuickAdd && available && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-1 opacity-0 transition-all duration-250 ease-expo group-hover:translate-y-0 group-hover:opacity-100 z-10">
            <button
              onClick={handleQuickAdd}
              disabled={!primaryVariant?.id || quickAddLoading === primaryVariant?.id || cartLoading}
              className="w-full min-h-[40px] bg-white/95 backdrop-blur-sm text-neutral-950 text-[10px] font-semibold uppercase tracking-[0.14em] px-3 flex items-center justify-center gap-2 border-t border-ink/10 hover:bg-accent hover:text-accent-ink transition-colors duration-fast dark:bg-white/95"
              style={{ borderRadius: 0 }}
              aria-label={`Quick add ${product.title}`}
            >
              <ShoppingBag className="h-3 w-3" aria-hidden="true" />
              <span>{quickAddLoading === primaryVariant?.id ? 'Adding…' : 'Quick Add'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Product info — name + price, editorial typographic restraint */}
      <div className="pt-3.5 space-y-1">
        <div className="flex items-start justify-between gap-2">
          {/* Title: font-normal for quieter NAP editorial tone */}
          <h3 className="text-body-sm font-normal text-ink leading-snug line-clamp-2 m-0">
            <a
              href={`/products/${product.handle}`}
              className="hover:text-accent transition-colors duration-fast"
              data-product-title
            >
              {product.title}
            </a>
          </h3>
        </div>

        {/* Price */}
        <p className="flex items-baseline gap-2 m-0">
          <span
            className={cn(
              'text-body font-medium tabular-nums tracking-tight',
              onSale ? 'text-ink' : 'text-ink'
            )}
          >
            {formatMoney(price, currencyCode)}
          </span>
          {onSale && compareAtPrice && (
            <span className="text-body-xs text-faint line-through tabular-nums">
              {formatMoney(compareAtPrice, currencyCode)}
            </span>
          )}
        </p>

        {/* Colour swatches */}
        {finishOption && finishOption.values.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {finishOption.values.slice(0, 5).map((val) => (
              <span
                key={val}
                title={val}
                className={cn(
                  'h-2.5 w-2.5 rounded-full border border-ink/15 inline-block',
                  swatchClass(val)
                )}
              />
            ))}
            {finishOption.values.length > 5 && (
              <span className="text-[9px] text-faint font-medium">
                +{finishOption.values.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}