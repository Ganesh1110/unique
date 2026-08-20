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
  title: 'AURA — Handcrafted Sarees & Ethnic Wear',
  description: 'Discover handwoven Kanjeevaram silk sarees, Banarasi brocade, designer lehengas & modern everyday wear. Shipped worldwide from India.',
};

/* ──────────────────────────────────────────────
   Hero Slides — confident, full-bleed
   ────────────────────────────────────────────── */
const heroSlides = [
  { src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop', alt: 'Kanjeevaram Pure Mulberry Silk Saree' },
  { src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop', alt: 'Banarasi Zari Brocade Katan Silk Saree' },
  { src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600&auto=format&fit=crop', alt: 'Chanderi Hand-Printed Tissue Organza Saree' },
];

/* ──────────────────────────────────────────────
   Category Grid — reduced to 6 clean icons
   ────────────────────────────────────────────── */
const categoryIcons = [
  { label: 'Silk Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop', href: '/collections/silk-sarees' },
  { label: 'Banarasi', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&auto=format&fit=crop', href: '/collections/sarees' },
  { label: 'Organza', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop', href: '/collections/sarees' },
  { label: 'Linen', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=400&auto=format&fit=crop', href: '/collections/sarees' },
  { label: 'Lehengas', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop', href: '/collections/lehengas' },
  { label: 'Tops & Tunics', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop', href: '/collections/tops' },
];

async function getHomepageData() {
  const [featuredProducts, collections, shop] = await Promise.all([
    fetchProducts(8, undefined, 'BEST_SELLING'),
    fetchCollections(4),
    fetchShop(),
  ]);

  return {
    featuredProducts: featuredProducts.edges.map(({ node }) => node).slice(0, 8),
    collections: collections.edges.map(({ node }) => node).slice(0, 4),
    shop,
  };
}

export default async function HomePage() {
  const { featuredProducts } = await getHomepageData();

  return (
    <div className="flex flex-col bg-white text-neutral-950">
      
      {/* ── Hero Banner — Single confident CTA ── */}
      <HeroSlider slides={heroSlides} className="min-h-[70svh] sm:min-h-[80svh]">
        <div className="max-w-2xl text-left">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-white/80 mb-4">
            Handwoven Heritage
          </span>
          <h1 className="font-heading font-medium text-4xl sm:text-display-md lg:text-display-lg tracking-tight text-white mb-4 drop-shadow-md">
            Sarees that tell <br className="hidden sm:block" />a story
          </h1>
          <p className="text-body-sm sm:text-body text-white/85 max-w-md mb-8 leading-relaxed drop-shadow">
            Pure mulberry silk, hand-woven by master artisans. Each drape carries generations of craft.
          </p>
          <Link
            href="/collections/sarees"
            className="inline-flex items-center gap-2 bg-white text-neutral-950 font-sans font-bold text-body-sm uppercase tracking-wider px-8 py-3.5 hover:bg-neutral-100 transition-colors shadow-md"
          >
            <span>Shop Sarees</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </HeroSlider>

      {/* ── Category Grid — 6 clean circles ── */}
      <section className="py-14 sm:py-20 bg-white" aria-labelledby="category-heading">
        <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="category-heading" className="font-sans text-heading-lg sm:text-display-xs font-bold tracking-tight text-neutral-950 mb-10 sm:mb-14">
            Shop by category
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-8 lg:gap-10 mb-12">
            {categoryIcons.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group flex flex-col items-center text-center space-y-3"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 group-hover:border-neutral-400 transition-all">
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.label}
                    fill
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-500 ease-expo"
                  />
                </div>
                <span className="font-sans text-body-xs sm:text-body-sm font-semibold text-neutral-800 group-hover:text-[#E60012] transition-colors leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center border border-neutral-950 text-neutral-950 font-sans font-bold text-caption uppercase tracking-wider px-10 py-3 rounded-full hover:bg-neutral-950 hover:text-white transition-colors"
            >
              VIEW ALL COLLECTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* ── Editorial Lookbook Strip ── */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-container-wide mx-auto">
          <div className="grid lg:grid-cols-2 min-h-[420px]">
            {/* Left: Full-width image */}
            <div className="relative min-h-[320px] lg:min-h-full overflow-hidden">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop"
                alt="Kanjeevaram silk saree editorial"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Right: Editorial copy */}
            <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-14 lg:py-20">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-4">
                The AURA Edit
              </span>
              <h2 className="font-heading text-display-sm sm:text-display-md font-medium tracking-tight text-neutral-950 mb-4">
                Woven with intention
              </h2>
              <p className="text-body text-neutral-600 leading-relaxed max-w-md mb-8">
                From the looms of Kanchipuram to your wardrobe — each AURA saree is handcrafted by master weavers using techniques passed down through generations. Pure mulberry silk, real gold zari, timeless drapes.
              </p>
              <div>
                <Link
                  href="/collections/silk-sarees"
                  className="inline-flex items-center gap-2 text-neutral-950 font-sans font-bold text-body-sm uppercase tracking-wider hover:text-[#E60012] transition-colors"
                >
                  <span>Explore Silk Sarees</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Collection Grid ── */}
      <section className="py-14 sm:py-20 bg-white" aria-labelledby="featured-heading">
        <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E60012] mb-2 block">
                Curated for you
              </span>
              <h2 id="featured-heading" className="font-sans text-heading-lg sm:text-display-xs font-bold tracking-tight text-neutral-950">
                Featured Collection
              </h2>
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

          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/collections"
              className="inline-flex items-center gap-1 text-body-sm font-bold text-neutral-900 hover:text-[#E60012] transition-colors"
            >
              <span>View All Products</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Testimonials />

    </div>
  );
}