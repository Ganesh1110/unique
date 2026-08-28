import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
   Category Grid — Uniqlo-style portrait tiles
   (3:4 image cards, not circle icons)
   ────────────────────────────────────────────── */
const categoryTiles = [
  {
    label: 'Silk Sarees',
    sublabel: 'Pure mulberry, Kanjeevaram',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop',
    href: '/collections/silk-sarees',
  },
  {
    label: 'Banarasi',
    sublabel: 'Zari brocade, katan silk',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop',
    href: '/collections/sarees',
  },
  {
    label: 'Organza',
    sublabel: 'Chanderi & tissue weaves',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop',
    href: '/collections/sarees',
  },
  {
    label: 'Linen',
    sublabel: 'Handloom everyday drapes',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&auto=format&fit=crop',
    href: '/collections/sarees',
  },
  {
    label: 'Lehengas',
    sublabel: 'Bridal & festive sets',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop',
    href: '/collections/lehengas',
  },
  {
    label: 'Tops & Tunics',
    sublabel: 'Modern ethnic separates',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop',
    href: '/collections/tops',
  },
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
    <div className="flex flex-col bg-surface text-ink">

      {/* ── Hero Banner — Full-bleed, restrained CTA (NAP pattern) ── */}
      <HeroSlider slides={heroSlides} className="min-h-[72svh] sm:min-h-[82svh]">
        <div className="max-w-xl text-left">
          {/* NAP-style eyebrow */}
          <span className="section-label mb-5 inline-block text-accent-ink/70">
            Handwoven Heritage
          </span>
          {/* Confident serif display headline */}
          <h1 className="font-heading font-medium text-display-md sm:text-display-lg lg:text-display-xl tracking-tight text-accent-ink mb-5 leading-[1.08] drop-shadow-sm">
            Sarees that tell<br className="hidden sm:block" /> a story
          </h1>
          {/* Quiet body copy */}
          <p className="text-body-sm sm:text-body text-accent-ink/80 max-w-sm mb-10 leading-relaxed">
            Pure mulberry silk, hand-woven by master artisans. Each drape carries generations of craft.
          </p>
          {/* Primary CTA — sharp, bold */}
          <div className="flex flex-col xs:flex-row items-start gap-4">
            <Link
              href="/collections/sarees"
              className="btn-primary"
            >
              Shop Sarees
            </Link>
            {/* Secondary ghost link — NAP pattern */}
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-accent-ink/80 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] py-4 hover:text-accent-ink transition-colors"
            >
              All Collections
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </HeroSlider>

      {/* ── Category Grid — Uniqlo portrait tile pattern ── */}
      <section className="py-16 sm:py-24 bg-surface" aria-labelledby="category-heading">
        <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="flex items-end justify-between mb-8 sm:mb-12">
            <div>
              <span className="section-label mb-2 inline-block">Browse</span>
              <h2
                id="category-heading"
                className="font-sans text-heading-lg sm:text-display-xs font-semibold tracking-tight text-ink"
              >
                Shop by category
              </h2>
            </div>
            <Link
              href="/collections"
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60 hover:text-ink transition-colors"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/*
            Portrait tile grid — 3:4 aspect, no circles
            Desktop: 6 columns | Tablet: 3 columns | Mobile: 2 columns
          */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {categoryTiles.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group flex flex-col"
              >
                {/* Portrait image tile */}
                <div className="relative aspect-[3/4] overflow-hidden bg-sunken mb-3">
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.label}
                    fill
                    objectFit="cover"
                    className="transition-transform duration-[900ms] ease-expo group-hover:scale-[1.04]"
                  />
                  {/* Subtle bottom gradient for legibility if ever overlaid */}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-950/15 to-transparent" />
                </div>

                {/* Text below tile — Uniqlo style */}
                <span className="font-sans text-[12px] sm:text-body-sm font-semibold text-ink uppercase tracking-[0.08em] leading-tight group-hover:text-accent transition-colors duration-fast">
                  {cat.label}
                </span>
                <span className="font-sans text-[11px] text-faint mt-0.5 leading-tight hidden sm:block">
                  {cat.sublabel}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile "View All" */}
          <div className="mt-8 sm:hidden text-center">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 border border-ink/20 text-ink font-sans text-[11px] font-semibold uppercase tracking-[0.14em] px-8 py-3.5 hover:bg-accent hover:border-accent hover:text-accent-ink transition-colors"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* ── Editorial Lookbook Strip — NAP-style content block ── */}
      <section className="bg-cream-100 border-y border-ink/10" aria-label="Editorial">
        <div className="max-w-container-wide mx-auto">
          {/*
            Asymmetric split: image 55% / copy 45%
            NAP pattern: image dominates, copy breathes
          */}
          <div className="grid lg:grid-cols-[55fr_45fr] min-h-[480px] lg:min-h-[560px]">

            {/* Left: Full-bleed image with subtle editorial label */}
            <div className="relative min-h-[320px] lg:min-h-full overflow-hidden">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop"
                alt="Kanjeevaram silk saree editorial"
                fill
                priority
                className="object-cover"
              />
              {/* Editorial story number — NAP detail */}
              <span className="absolute top-6 left-6 section-label text-accent-ink/60">
                Story No. 01
              </span>
            </div>

            {/* Right: Editorial copy — generous breathing room */}
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-16 lg:py-24">
              {/* Thin rule + eyebrow — NAP pattern */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-accent" aria-hidden="true" />
                <span className="section-label">The AURA Edit</span>
              </div>

              {/* Heading */}
              <h2 className="font-heading text-display-sm sm:text-display-md font-medium tracking-tight text-ink mb-5 leading-[1.1]">
                Woven with<br /> intention
              </h2>

              {/* Body */}
              <p className="text-body text-faint leading-relaxed max-w-[38ch] mb-8">
                From the looms of Kanchipuram to your wardrobe — each AURA saree is handcrafted by master weavers using techniques passed down through generations. Pure mulberry silk, real gold zari, timeless drapes.
              </p>

              {/* Arrow link — NAP editorial style */}
              <Link
                href="/collections/silk-sarees"
                className="group inline-flex items-center gap-3 text-ink font-sans text-[11px] font-semibold uppercase tracking-[0.16em] hover:text-accent transition-colors"
              >
                <span>Explore Silk Sarees</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Collection Grid ── */}
      <section className="py-16 sm:py-24 lg:py-32 bg-surface" aria-labelledby="featured-heading">
        <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div>
              <span className="section-label mb-2 block text-accent">New Arrivals</span>
              <h2
                id="featured-heading"
                className="font-sans text-heading-lg sm:text-display-xs font-semibold tracking-tight text-ink"
              >
                Featured Collection
              </h2>
            </div>
            <Link
              href="/collections"
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60 hover:text-ink transition-colors"
            >
              View All &nbsp;&rarr;
            </Link>
          </div>

          <ProductGrid products={featuredProducts} columns={4} />

          {/* Mobile view all */}
          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/70 hover:text-ink transition-colors"
            >
              View All Products &nbsp;&rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Service Promise Strip — quiet trust cues (NAP pattern) ── */}
      <section className="border-y border-ink/10 bg-cream-50" aria-label="Service promises">
        <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-ink/8">
            {[
              { title: 'Complimentary Shipping', body: 'On orders above ₹15,000' },
              { title: 'Authentic Handwoven', body: 'GI-certified artisan weaves' },
              { title: '14-Day Returns', body: 'No-questions-asked policy' },
              { title: 'WhatsApp Concierge', body: 'Styling advice on demand' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center px-6 sm:px-8 py-8 sm:py-10"
              >
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-ink mb-1.5">
                  {item.title}
                </p>
                <p className="text-body-xs text-faint leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Testimonials />

    </div>
  );
}