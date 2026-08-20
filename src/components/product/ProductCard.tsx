'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/ui/Image';
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
}

export function ProductCard({ product, variant, priority = false, showQuickAdd = true }: ProductCardProps) {
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

  // Secondary image for fabric/texture hover preview
  const secondaryImage = images.length > 1 ? images[1] : null;

  // Extract material / finish swatch values if present
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

  const onSale = compareAtPrice && compareAtPrice > price;

  return (
    <article className="group relative flex flex-col">
      {/* Product Image Container — Fashion 3:4 Aspect Ratio */}
      <div
        className={cn(
          'relative overflow-hidden bg-neutral-100/90 transition-opacity duration-300',
          !available && 'opacity-60'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/products/${product.handle}`}
          aria-label={`${product.title}${onSale ? ' - Sale' : ''}`}
          className="block w-full h-full overflow-hidden"
          data-testid="product-card-link"
        >
          {/* Primary Image */}
          <div className={cn(
            'transition-all duration-500 ease-expo',
            isHovered && secondaryImage ? 'opacity-0' : 'opacity-100',
            'group-hover:scale-[1.02]'
          )}>
            <ProductImage
              images={images}
              selectedVariantImage={featuredImage ? { url: featuredImage.url, altText: featuredImage.altText } : null}
              aspectRatio="3:4"
              priority={priority}
            />
          </div>

          {/* Secondary Fabric/Texture Image on Hover */}
          {secondaryImage && (
            <div className={cn(
              'absolute inset-0 transition-opacity duration-500 ease-expo',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}>
              <OptimizedImage
                src={secondaryImage.url}
                alt={secondaryImage.altText || `${product.title} - texture detail`}
                fill
                objectFit="cover"
              />
            </div>
          )}
        </Link>

        {/* Wishlist Heart Icon — persistent on mobile, hover-reveal desktop */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            'absolute top-2.5 right-2.5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200',
            'sm:opacity-0 sm:group-hover:opacity-100',
            isSaved && 'sm:opacity-100'
          )}
          aria-label={isSaved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              isSaved ? 'fill-[#E60012] text-[#E60012]' : 'text-neutral-600 hover:text-neutral-950'
            )}
          />
        </button>

        {/* UNIQLO Red Offer Tag */}
        {onSale && available && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] uppercase font-black tracking-wider bg-[#E60012] text-white shadow-sm z-10">
            LIMITED OFFER
          </span>
        )}

        {/* Muted Sold Out Overlay Tag */}
        {!available && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-neutral-900/80 text-white backdrop-blur-sm z-10">
            Sold Out
          </span>
        )}

        {/* Quick Add Overlay Button */}
        {showQuickAdd && available && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 ease-expo z-10">
            <button
              onClick={handleQuickAdd}
              disabled={!primaryVariant?.id || quickAddLoading === primaryVariant?.id || cartLoading}
              className="w-full min-h-[40px] bg-white/95 backdrop-blur-sm text-neutral-950 text-caption font-bold uppercase tracking-wider px-3 flex items-center justify-center gap-2 border border-neutral-300 hover:bg-[#E60012] hover:text-white hover:border-[#E60012] transition-colors shadow-sm"
              aria-label={`Quick add ${product.title}`}
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{quickAddLoading === primaryVariant?.id ? 'Adding…' : 'Quick Add'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Info — Clean UNIQLO Apparel Typography */}
      <Link
        href={`/products/${product.handle}`}
        className="block pt-2.5 space-y-1"
        data-testid="product-card-link"
      >
        <h3 className="font-sans text-body-sm font-semibold tracking-tight text-neutral-900 group-hover:text-[#E60012] transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Color Swatch Dots */}
        {finishOption && finishOption.values.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5 pb-0.5">
            {finishOption.values.slice(0, 5).map((val) => (
              <span
                key={val}
                title={val}
                className={cn(
                  'w-2.5 h-2.5 rounded-full border border-neutral-400 inline-block',
                  val.toLowerCase().includes('white') && 'bg-white',
                  val.toLowerCase().includes('black') && 'bg-neutral-900',
                  val.toLowerCase().includes('navy') && 'bg-sky-900',
                  val.toLowerCase().includes('olive') && 'bg-olive-800 bg-emerald-900',
                  val.toLowerCase().includes('beige') && 'bg-amber-100',
                  !val.toLowerCase().includes('white') && !val.toLowerCase().includes('black') && !val.toLowerCase().includes('navy') && !val.toLowerCase().includes('olive') && !val.toLowerCase().includes('beige') && 'bg-neutral-300'
                )}
              />
            ))}
          </div>
        )}

        {/* UNIQLO Bold Red Price Display */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className={cn(
            'font-sans text-body font-bold tabular-nums',
            onSale ? 'text-[#E60012]' : 'text-neutral-950'
          )}>
            {formatMoney(price, currencyCode)}
          </span>
          {onSale && compareAtPrice && (
            <span className="text-body-xs text-neutral-400 line-through tabular-nums">
              {formatMoney(compareAtPrice, currencyCode)}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}