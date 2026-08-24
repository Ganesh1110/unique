'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { OptimizedImage } from '@/components/ui/Image';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types/shopify';

interface ProductGalleryProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, value: string) => void;
  className?: string;
}

export function ProductGallery({ product, selectedVariant, className }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hoverZoom, setHoverZoom] = useState({ active: false, x: 50, y: 50 });
  const [zoomScale, setZoomScale] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const pinchRef = useRef<{ startDist: number; startScale: number } | null>(null);

  const images = product.images.edges.map(({ node }) => node);
  const variantImage = selectedVariant?.image;

  const displayImages =
    variantImage && variantImage.url
      ? [variantImage, ...images.filter((img) => img.url !== variantImage.url)]
      : images;

  const handleThumbnailClick = useCallback((index: number) => {
    setActiveIndex(index);
    setShowVideo(false);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setHoverZoom({
      active: true,
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setHoverZoom({ active: false, x: 50, y: 50 });
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
        setZoomScale(1);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
        setZoomScale(1);
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
        setZoomScale(1);
      }
    },
    [displayImages.length]
  );

  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, handleKeyDown]);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedVariant?.id]);

  const currentImage = displayImages[activeIndex] || displayImages[0];

  const zoomIn = () => setZoomScale((prev) => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoomScale((prev) => Math.max(prev - 0.5, 1));
  const resetZoom = () => setZoomScale(1);

  const handlePinchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchRef.current = { startDist: dist, startScale: zoomScale };
    }
  };

  const handlePinchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const next = pinchRef.current.startScale * (dist / pinchRef.current.startDist);
      setZoomScale(Math.min(3, Math.max(1, next)));
    }
  };

  const handlePinchEnd = () => {
    pinchRef.current = null;
  };

  const demoVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-traditional-dress-41584-large.mp4';

  return (
    <div className={cn('relative group', className)}>
      {/* Main stage */}
      <div
        className="relative aspect-4-5 overflow-hidden bg-sunken cursor-zoom-in"
        onMouseMove={showVideo ? undefined : handleMouseMove}
        onMouseLeave={showVideo ? undefined : handleMouseLeave}
        onClick={showVideo ? undefined : () => setLightboxOpen(true)}
      >
        {showVideo ? (
          <div className="w-full h-full bg-night flex items-center justify-center relative">
            <video
              src={demoVideoUrl}
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 bg-night/80 text-accent-ink p-2 rounded-full z-20 hover:bg-night transition-colors"
              aria-label="Back to images"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div
            className="w-full h-full transition-transform duration-200 ease-out"
            style={{
              transformOrigin: `${hoverZoom.x}% ${hoverZoom.y}%`,
              transform: hoverZoom.active ? 'scale(1.8)' : 'scale(1)',
            }}
          >
            <OptimizedImage
              src={currentImage?.url}
              alt={currentImage?.altText || product.title}
              fill
              priority={activeIndex === 0}
              objectFit="cover"
            />
          </div>
        )}

        {!showVideo && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none bg-night/70 text-accent-ink text-caption px-3 py-1.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Click for full screen view
          </div>
        )}

        {!showVideo && displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-canvas/90 backdrop-blur-md text-ink hover:text-accent transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-canvas/90 backdrop-blur-md text-ink hover:text-accent transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-20"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail rail */}
      <div className="flex gap-3 mt-4 overflow-x-auto pb-1 items-center scrollbar-hide" role="tablist" aria-label="Product media thumbnails">
        {displayImages.map((image, index) => (
          <button
            key={image.url}
            onClick={() => handleThumbnailClick(index)}
            role="tab"
            aria-selected={!showVideo && index === activeIndex}
            aria-label={`View image ${index + 1}`}
            className={cn(
              'relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-200',
              !showVideo && index === activeIndex
                ? 'ring-2 ring-accent ring-offset-2 ring-offset-canvas'
                : 'opacity-60 hover:opacity-100'
            )}
          >
            <OptimizedImage src={image.url} alt={image.altText || ''} fill objectFit="cover" />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowVideo(true)}
          role="tab"
          aria-selected={showVideo}
          aria-label="Watch product in motion"
          className={cn(
            'relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-200 bg-night text-accent-ink flex flex-col items-center justify-center gap-1 text-[10px] uppercase font-semibold tracking-wider',
            showVideo ? 'ring-2 ring-accent opacity-100' : 'opacity-75 hover:opacity-100'
          )}
        >
          <Play className="h-5 w-5 text-gold-400 fill-gold-400" />
          <span>In Motion</span>
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-lightbox bg-ink/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Full screen image view"
          onClick={() => {
            setLightboxOpen(false);
            setZoomScale(1);
          }}
        >
          {/* Top control bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 w-full z-[110] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-caption sm:text-body-sm font-medium tracking-wide bg-canvas/10 text-accent-ink px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-accent-ink/15">
              {activeIndex + 1} / {displayImages.length}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={zoomIn}
                disabled={zoomScale >= 3}
                className="p-2 sm:p-3 bg-canvas/10 text-accent-ink hover:bg-accent hover:text-accent-ink rounded-full border border-accent-ink/15 transition-all disabled:opacity-30"
                aria-label="Zoom in"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={zoomOut}
                disabled={zoomScale <= 1}
                className="p-2 sm:p-3 bg-canvas/10 text-accent-ink hover:bg-accent hover:text-accent-ink rounded-full border border-accent-ink/15 transition-all disabled:opacity-30"
                aria-label="Zoom out"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              {zoomScale > 1 && (
                <button
                  onClick={resetZoom}
                  className="p-2 sm:p-3 bg-canvas/10 text-accent-ink hover:bg-accent hover:text-accent-ink rounded-full border border-accent-ink/15 transition-all"
                  aria-label="Reset zoom"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              <button
                onClick={() => {
                  setLightboxOpen(false);
                  setZoomScale(1);
                }}
                className="p-2 sm:p-3 bg-accent text-accent-ink hover:bg-accent-hover rounded-full transition-transform hover:scale-105 ml-1 sm:ml-2 flex items-center gap-1.5 px-3 sm:px-4 font-sans font-medium text-body-sm"
                aria-label="Close zoom modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>

          {/* Main zoomed image */}
          <div
            className="flex-1 flex items-center justify-center relative overflow-hidden py-4 my-2"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.length > 1 && (
              <button
                onClick={() => {
                  setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
                  setZoomScale(1);
                }}
                className="absolute left-2 sm:left-4 z-[110] p-2 sm:p-4 bg-canvas/10 text-accent-ink hover:text-accent-ink hover:bg-accent rounded-full border border-accent-ink/15 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 sm:h-8 sm:w-8" />
              </button>
            )}

            <div
              className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center transition-transform duration-300 ease-out cursor-pointer touch-none"
              style={{ transform: `scale(${zoomScale})` }}
              onClick={() => setZoomScale((prev) => (prev === 1 ? 2 : 1))}
              onTouchStart={handlePinchStart}
              onTouchMove={handlePinchMove}
              onTouchEnd={handlePinchEnd}
            >
              <OptimizedImage
                src={currentImage?.url}
                alt={currentImage?.altText || product.title}
                width={1400}
                height={1750}
                objectFit="contain"
              />
            </div>

            {displayImages.length > 1 && (
              <button
                onClick={() => {
                  setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
                  setZoomScale(1);
                }}
                className="absolute right-2 sm:right-4 z-[110] p-2 sm:p-4 bg-canvas/10 text-accent-ink hover:text-accent-ink hover:bg-accent rounded-full border border-accent-ink/15 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 sm:h-8 sm:w-8" />
              </button>
            )}
          </div>

          {/* Bottom thumbnails */}
          {displayImages.length > 1 && (
            <div
              className="flex justify-center gap-2 sm:gap-3 z-[110] relative pt-2 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {displayImages.map((image, index) => (
                <button
                  key={image.url}
                  onClick={() => {
                    setActiveIndex(index);
                    setZoomScale(1);
                  }}
                  className={cn(
                    'w-10 h-10 sm:w-14 sm:h-14 rounded-md overflow-hidden border-2 transition-all flex-shrink-0',
                    index === activeIndex
                      ? 'border-accent scale-105'
                      : 'border-canvas/10 opacity-60 hover:opacity-100'
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <OptimizedImage src={image.url} alt="" fill objectFit="cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export interface VariantSelectorProps {
  product: Product;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, value: string) => void;
  disabled?: boolean;
}

function isColorLike(name: string): boolean {
  return ['Finish', 'Material', 'Color', 'Colour'].includes(name);
}

function swatchClass(value: string): string {
  const v = value.toLowerCase();
  if (v.includes('white') || v.includes('ivory') || v.includes('cream')) return 'bg-cream-100 border border-neutral-300';
  if (v.includes('black')) return 'bg-neutral-950';
  if (v.includes('navy')) return 'bg-sky-900';
  if (v.includes('emerald')) return 'bg-emerald-800';
  if (v.includes('olive')) return 'bg-emerald-900';
  if (v.includes('rose') || v.includes('pink')) return 'bg-rose-300';
  if (v.includes('maroon') || v.includes('burgundy')) return 'bg-red-900';
  if (v.includes('mustard')) return 'bg-yellow-500';
  if (v.includes('gold')) return 'bg-amber-400';
  if (v.includes('pearl')) return 'bg-amber-50 border border-neutral-300';
  if (v.includes('beige') || v.includes('sand')) return 'bg-amber-100';
  return 'bg-neutral-400';
}

export function VariantSelector({ product, selectedOptions, onOptionChange, disabled = false }: VariantSelectorProps) {
  return (
    <div className="space-y-6" role="group" aria-label="Product options">
      {product.options.map((option) => {
        const isColorOption = isColorLike(option.name);

        return (
          <fieldset key={option.id} className="space-y-3" disabled={disabled}>
            <legend className="text-caption font-medium uppercase tracking-[0.16em] text-neutral-700 flex items-center justify-between w-full">
              <span>{option.name}</span>
              {selectedOptions[option.name] && (
                <span className="text-neutral-500 font-normal normal-case">{selectedOptions[option.name]}</span>
              )}
            </legend>
            <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label={option.name}>
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                const isAvailable = product.variants.edges.some(({ node: variant }) => {
                  const matches = variant.selectedOptions.every(
                    (opt) => (opt.name === option.name ? opt.value === value : selectedOptions[opt.name] === opt.value)
                  );
                  return matches && variant.availableForSale;
                });

                if (isColorOption) {
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={value}
                      title={value}
                      aria-disabled={!isAvailable || disabled}
                      onClick={() => !disabled && isAvailable && onOptionChange(option.name, value)}
                      disabled={!isAvailable || disabled}
                      className={cn(
                        'relative w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 p-0.5',
                        isSelected
                          ? 'ring-2 ring-accent ring-offset-2 ring-offset-canvas border-transparent'
                          : 'border-ink/20 hover:border-accent',
                        (!isAvailable || disabled) && 'opacity-35 cursor-not-allowed'
                      )}
                    >
                      <span className={cn('w-full h-full rounded-full inline-block', swatchClass(value))} />
                    </button>
                  );
                }

                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={!isAvailable || disabled}
                    onClick={() => !disabled && isAvailable && onOptionChange(option.name, value)}
                    disabled={!isAvailable || disabled}
                    className={cn(
                      'inline-flex min-h-[42px] items-center justify-center px-4 rounded-full text-caption font-medium border transition-colors duration-200',
                      isSelected
                        ? 'border-accent bg-accent text-accent-ink'
                        : isAvailable
                          ? 'border-ink/20 text-ink hover:border-accent'
                          : 'border-ink/10 text-faint cursor-not-allowed line-through'
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({ value, onChange, max = 99, disabled = false }: QuantitySelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <label htmlFor="quantity" className="text-caption font-medium uppercase tracking-[0.16em] text-neutral-700 whitespace-nowrap">
        Quantity
      </label>
      <div className="flex items-center border border-ink/20">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1 || disabled}
          className="inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
          </svg>
        </button>
        <input
          type="number"
          id="quantity"
          value={value}
          onChange={(e) => {
            const val = Math.min(Math.max(1, parseInt(e.target.value) || 1), max);
            onChange(val);
          }}
          min="1"
          max={max}
          className="w-14 text-center text-body font-medium text-ink border-x border-ink/20 bg-transparent focus:outline-none focus:ring-0 tabular-nums"
          aria-label="Quantity"
          disabled={disabled}
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max || disabled}
          className="inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export interface AddToCartButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function AddToCartButton({ onClick, loading = false, disabled = false, children, className }: AddToCartButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'btn-primary w-full sm:w-auto min-h-[52px] text-body font-medium',
        'flex items-center justify-center gap-2',
        disabled && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children || (loading ? 'Adding...' : 'Add to Bag')}
    </button>
  );
}