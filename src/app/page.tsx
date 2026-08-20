import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroSlider } from '@/components/home/HeroSlider';
import { Testimonials } from '@/components/home/Testimonials';
import { OptimizedImage } from '@/components/ui/Image';
import { fetchProducts, fetchCollections, fetchShop } from '@/lib/shopify';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'AURA LifeWear — Modern Clothing & Apparel',
  description: 'Simple, high-quality, everyday clothing designed to make life better. Explore AIRism t-shirts, waffle easy pants, outerwear, and linen tops.',
};

const heroSlides = [
  { src: '/images/Image1.jpeg', alt: 'AIRism Cotton Oversized T-Shirt photoshoot' },
  { src: '/images/Image5.jpeg', alt: 'Waffle Easy Pants everyday wear' },
  { src: '/images/Image9.jpeg', alt: 'LifeWear Collection Fall/Winter' },
];

const categoryIcons = [
  { label: 'All T-Shirts & Tops', image: '/images/Image1.jpeg', href: '/collections/tops' },
  { label: 'Bra Tops', image: '/images/Image5.jpeg', href: '/collections/tops' },
  { label: 'Shirts & Polo', image: '/images/Image9.jpeg', href: '/collections/tops' },
  { label: 'Sweat & Cardigans', image: '/images/Image2.jpeg', href: '/collections/tops' },
  { label: 'Knitwear', image: '/images/Image6.jpeg', href: '/collections/tops' },
  { label: 'Bottoms & Pants', image: '/images/Image5.jpeg', href: '/collections/bottoms' },
  { label: 'Outerwear', image: '/images/Image9.jpeg', href: '/collections/outerwear' },
  { label: 'Dresses & Skirts', image: '/images/Image1.jpeg', href: '/collections/dresses' },
  { label: 'Shorts & Culottes', image: '/images/Image2.jpeg', href: '/collections/bottoms' },
  { label: 'Loungewear', image: '/images/Image5.jpeg', href: '/collections/bottoms' },
  { label: 'Innerwear', image: '/images/Image6.jpeg', href: '/collections/tops' },
  { label: 'Accessories', image: '/images/Image9.jpeg', href: '/collections/new-arrivals' },
];

async function getHomepageData() {
  const [featuredProducts, collections, shop] = await Promise.all([
    fetchProducts(4, undefined, 'BEST_SELLING'),
    fetchCollections(4),
    fetchShop(),
  ]);

  return {
    featuredProducts: featuredProducts.edges.map(({ node }) => node).slice(0, 4),
    collections: collections.edges.map(({ node }) => node).slice(0, 4),
    shop,
  };
}

export default async function HomePage() {
  const { featuredProducts } = await getHomepageData();

  return (
    <div className="flex flex-col bg-white text-neutral-950">
      
      {/* UNIQLO Style Hero Slider */}
      <HeroSlider slides={heroSlides} className="min-h-[70svh] sm:min-h-[80svh]">
        <div className="max-w-2xl text-left">
          <span className="inline-block bg-[#E60012] text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-sm mb-4">
            APP ONLY
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-display-md lg:text-display-lg tracking-tight text-white mb-3 drop-shadow-md">
            AIRism Cotton T-Shirt
          </h1>
          <p className="text-body-sm sm:text-body text-white/90 max-w-lg mb-4 leading-relaxed drop-shadow">
            Smooth &lsquo;AIRism&rsquo; fabric with the look of natural cotton. Featuring quick-drying DRY technology.
          </p>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-sans text-display-xs sm:text-display-sm font-black text-[#E60012] bg-white/95 px-3 py-1 rounded-sm">
              ₹ 990.00
            </span>
            <span className="text-body text-white/70 line-through">
              ₹ 1,490.00
            </span>
          </div>
          <p className="text-caption font-bold text-[#E60012] bg-white/90 inline-block px-2.5 py-1 mb-8 rounded-sm">
            APP Exclusive Limited Offer Until 20 Aug
          </p>
          <div>
            <Link
              href="/collections/tops"
              className="inline-flex items-center gap-2 bg-[#E60012] text-white font-bold text-body-sm uppercase tracking-wider px-8 py-3.5 hover:bg-red-700 transition-colors shadow-md"
            >
              <span>Shop Collection</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </HeroSlider>

      {/* UNIQLO "Search by category" Section (Matching Screenshot 2) */}
      <section className="py-12 sm:py-16 bg-white" aria-labelledby="category-search-heading">
        <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="category-search-heading" className="font-sans text-heading-lg sm:text-display-xs font-bold tracking-tight text-neutral-950 mb-8 sm:mb-12">
            Search by category
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-14">
            {categoryIcons.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group flex flex-col items-center text-center space-y-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 group-hover:border-neutral-400 transition-all flex items-center justify-center p-1">
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.label}
                    fill
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="font-sans text-caption sm:text-body-xs font-semibold text-neutral-900 group-hover:text-[#E60012] transition-colors leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          {/* VIEW ALL CATEGORIES Pill Button */}
          <div className="text-center">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center border border-neutral-950 text-neutral-950 font-sans font-bold text-caption uppercase tracking-wider px-10 py-3 rounded-full hover:bg-neutral-950 hover:text-white transition-colors"
            >
              VIEW ALL CATEGORIES
            </Link>
          </div>
        </div>
      </section>

      {/* LifeWear Collection Banners (Matching Screenshot 3 & 5) */}
      <section className="py-12 sm:py-16 bg-neutral-50 border-y border-neutral-200" aria-labelledby="lifewear-heading">
        <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-neutral-900 text-white min-h-[400px] flex items-center p-8 sm:p-14 mb-12">
            <OptimizedImage
              src="/images/Image9.jpeg"
              alt="LifeWear Collection 2026 Fall/Winter"
              fill
              priority
              className="object-cover opacity-60"
            />
            <div className="relative z-10 max-w-xl space-y-4">
              <span className="text-caption font-bold uppercase tracking-widest text-neutral-300">
                LifeWear Collection
              </span>
              <h2 id="lifewear-heading" className="font-sans text-display-sm sm:text-display-md font-extrabold tracking-tight text-white">
                LifeWear Collection 2026 Fall/Winter
              </h2>
              <p className="text-body text-neutral-200 font-medium">
                Timeless essentials, new for fall. Play with layers, style it all.
              </p>
              <div className="pt-2">
                <Link
                  href="/collections/new-arrivals"
                  className="inline-flex items-center gap-2 bg-white text-neutral-950 font-bold text-caption uppercase tracking-wider px-7 py-3 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <span>Explore Fall/Winter</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Clothing Catalog */}
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-caption font-bold uppercase tracking-widest text-[#E60012]">
                  LIMITED OFFERS &amp; NEW DROPS
                </span>
                <h3 className="font-sans text-heading-lg sm:text-display-xs font-bold tracking-tight text-neutral-950">
                  Featured Clothing
                </h3>
              </div>
              <Link
                href="/collections"
                className="hidden sm:inline-flex items-center gap-1 text-body-sm font-bold text-neutral-900 hover:text-[#E60012] transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <ProductGrid products={featuredProducts} columns={4} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

    </div>
  );
}