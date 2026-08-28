import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ArrowRight, LayoutGrid } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/Image';
import { cn } from '@/lib/utils';

export interface MegaSubSection {
  title: string;
  href: string;
  image: string;
  items: { label: string; href: string; isHot?: boolean }[];
}

export interface MegaCategory {
  id: string;
  name: string;
  href: string;
  badge?: string;
  subsections: MegaSubSection[];
  featuredCard?: {
    title: string;
    subtitle: string;
    image: string;
    link: string;
  };
}

export const MEGA_CATEGORIES: MegaCategory[] = [
  {
    id: 'sarees',
    name: 'Sarees',
    href: '/collections/sarees',
    badge: 'Heritage',
    subsections: [
      {
        title: 'By Weave & Fabric',
        href: '/collections/silk-sarees',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop',
        items: [
          { label: 'Kanjeevaram Mulberry Silk', href: '/collections/silk-sarees', isHot: true },
          { label: 'Banarasi Zari Brocade', href: '/collections/silk-sarees' },
          { label: 'Chanderi & Organza', href: '/collections/sarees' },
          { label: 'Handloom Pure Linen', href: '/collections/sarees' },
        ],
      },
      {
        title: 'Featured Drops',
        href: '/collections/sarees',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop',
        items: [
          { label: 'Kanjeevaram Pure Silk Saree', href: '/products/kanjeevaram-pure-silk-saree' },
          { label: 'Banarasi Zari Brocade Saree', href: '/products/banarasi-zari-brocade-saree' },
          { label: 'Chanderi Tissue Organza', href: '/products/chanderi-floral-organza-saree' },
        ],
      },
      {
        title: 'By Occasion',
        href: '/collections/sarees',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop',
        items: [
          { label: 'Bridal & Wedding Sarees', href: '/collections/sarees' },
          { label: 'Festive & Reception Drapes', href: '/collections/sarees' },
          { label: 'Everyday Work Linen', href: '/collections/sarees' },
        ],
      },
    ],
    featuredCard: {
      title: 'Kanjeevaram Silk Edition',
      subtitle: 'Pure 3-ply mulberry silk handwoven in Kanchipuram.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop',
      link: '/products/kanjeevaram-pure-silk-saree',
    },
  },
  {
    id: 'lehengas',
    name: 'Lehengas & Festive',
    href: '/collections/lehengas',
    badge: 'Festive',
    subsections: [
      {
        title: 'Ethnic Sets',
        href: '/collections/lehengas',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
        items: [
          { label: 'Bridal Velvet Lehengas', href: '/products/bridal-velvet-lehenga-set', isHot: true },
          { label: 'Embroidered Anarkali Sets', href: '/collections/lehengas' },
          { label: 'Designer Kurta Sets', href: '/collections/lehengas' },
        ],
      },
    ],
    featuredCard: {
      title: 'Bridal Velvet Lehenga',
      subtitle: 'Opulent zardozi threadwork for grand celebrations.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop',
      link: '/products/bridal-velvet-lehenga-set',
    },
  },
  {
    id: 'tops',
    name: 'Tops & Tunics',
    href: '/collections/tops',
    subsections: [
      {
        title: 'Everyday Wear',
        href: '/collections/tops',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop',
        items: [
          { label: 'AIRism Cotton Oversized Tee', href: '/products/airism-cotton-t-shirt', isHot: true },
          { label: 'Linen Blend Shirts', href: '/collections/tops' },
          { label: 'Casual Tunics', href: '/collections/tops' },
        ],
      },
    ],
    featuredCard: {
      title: 'AIRism Cotton Tops',
      subtitle: 'Smooth, quick-drying comfort for daily wear.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop',
      link: '/products/airism-cotton-t-shirt',
    },
  },
];

export function useDynamicCategories(): MegaCategory[] {
  const [categories, setCategories] = useState<MegaCategory[]>(MEGA_CATEGORIES);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  return categories;
}

interface BrowseCategoriesMenuProps {
  onClose?: () => void;
}

interface DesktopMenuProps extends BrowseCategoriesMenuProps {
  activeId: string;
}

export function BrowseCategoriesDesktopMenu({ activeId, onClose }: DesktopMenuProps) {
  const categories = useDynamicCategories();
  const activeCategory = categories.find((c) => c.id === activeId) || categories[0] || MEGA_CATEGORIES[0];

  return (
    <div className="w-full bg-surface border-b border-ink/10 shadow-[0_32px_64px_-32px_rgba(0,0,0,0.2)] animate-fade-in text-ink">
      <div className="max-w-container-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category tab pills */}
        <div className="flex items-center gap-2 mb-7">
          <span className="text-caption font-semibold uppercase tracking-[0.16em] text-faint mr-1">
            Departments
          </span>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              onClick={onClose}
              className={cn(
                'inline-flex min-h-[36px] items-center rounded-full px-4 text-caption font-medium transition-colors duration-fast',
                cat.id === activeCategory.id
                  ? 'bg-accent text-accent-ink'
                  : 'bg-sunken text-neutral-700 hover:bg-ink/[0.08] hover:text-ink'
              )}
            >
              {cat.name}
              {cat.badge && (
                <span className="ml-2 text-[9px] font-semibold uppercase tracking-wider opacity-70">
                  {cat.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Image tiles per subsection */}
          <div className="col-span-9 grid grid-cols-3 gap-4">
            {activeCategory.subsections.map((sub) => (
              <Link
                key={sub.title}
                href={sub.href || activeCategory.href || '/collections'}
                onClick={onClose}
                className="group relative block overflow-hidden bg-sunken"
              >
                <div className="relative aspect-4-5 overflow-hidden">
                  <OptimizedImage
                    src={sub.image || activeCategory.featuredCard?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop'}
                    alt={sub.title}
                    fill
                    objectFit="cover"
                    className="transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent transition-opacity duration-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h4 className="font-heading text-heading-sm font-medium text-accent-ink mb-1.5">
                    {sub.title}
                  </h4>
                  <ul className="space-y-1" role="list">
                    {sub.items.slice(0, 3).map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center gap-1.5 text-body-xs text-accent-ink/75"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={item.href || activeCategory.href || '/collections'}
                          onClick={onClose}
                          className="truncate hover:text-accent-ink transition-colors"
                        >
                          {item.label}
                        </Link>
                        {item.isHot && (
                          <span className="shrink-0 rounded-sm bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-ink">
                            New
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-body-xs font-medium text-accent-ink/90">
                    View all <ArrowRight className="h-3 w-3 transition-transform duration-fast group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Featured card */}
          <div className="col-span-3">
            {activeCategory.featuredCard ? (
              <div className="group relative block h-full overflow-hidden bg-sunken">
                <div className="absolute inset-0">
                  <OptimizedImage
                    src={activeCategory.featuredCard.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop'}
                    alt={activeCategory.featuredCard.title}
                    fill
                    objectFit="cover"
                    className="transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" aria-hidden="true" />
                </div>
                <div className="relative flex h-full min-h-[340px] flex-col justify-end p-5">
                  {/* Featured card */}
                  <span className="section-label text-gold-300 mb-2 inline-block">
                    Featured
                  </span>
                  <h4 className="font-heading text-heading-lg font-medium text-accent-ink mb-1.5 italic">
                    {activeCategory.featuredCard.title}
                  </h4>
                  <p className="text-body-xs text-accent-ink/70 mb-5 line-clamp-2">
                    {activeCategory.featuredCard.subtitle}
                  </p>
                  <Link
                    href={activeCategory.featuredCard.link || activeCategory.href || '/collections'}
                    onClick={onClose}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-accent-ink/95 text-ink text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-fast hover:bg-accent-ink px-6"
                    style={{ borderRadius: 0 }}
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[340px] flex-col justify-center rounded-md bg-sunken p-5">
                <p className="font-heading text-heading-lg font-medium text-ink">
                  {activeCategory.name}
                </p>
                <Link
                  href={activeCategory.href || '/collections'}
                  onClick={onClose}
                  className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-accent"
                >
                  Browse collection <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BrowseCategoriesMobileAccordion({ onClose }: BrowseCategoriesMenuProps) {
  const categories = useDynamicCategories();
  const [openCatId, setOpenCatId] = useState<string | null>(categories[0]?.id || null);

  const toggleCategory = (id: string) => {
    setOpenCatId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1 text-caption uppercase tracking-[0.18em] font-semibold text-faint">
        <LayoutGrid className="h-4 w-4" />
        <span>Browse Categories</span>
      </div>

      <div className="space-y-1.5">
        {categories.map((cat) => {
          const isOpen = openCatId === cat.id;
          return (
            <div key={cat.id} className="overflow-hidden border border-ink/10 rounded-md">
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-body-sm font-medium text-ink bg-sunken/50 hover:bg-sunken transition-colors"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-2 font-medium">
                  {cat.name}
                  {cat.badge && (
                    <span className="rounded-sm bg-accent px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent-ink">
                      {cat.badge}
                    </span>
                  )}
                </span>
                <ChevronDown
                  className={cn('h-4 w-4 text-faint transition-transform duration-200', isOpen && 'rotate-180')}
                />
              </button>

              {isOpen && (
                <div className="divide-y divide-ink/5 border-t border-ink/10">
                  {cat.subsections.map((sub) => (
                    <div key={sub.title} className="px-4 py-3">
                      <Link
                        href={sub.href || cat.href || '/collections'}
                        onClick={onClose}
                        className="text-caption font-semibold uppercase tracking-[0.14em] text-accent mb-2 flex items-center justify-between"
                      >
                        {sub.title}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                      <ul className="space-y-1" role="list">
                        {sub.items.map((item) => (
                          <li key={item.label}>
                            <Link
                              href={item.href || cat.href || '/collections'}
                              onClick={onClose}
                              className="flex min-h-[36px] items-center justify-between gap-2 py-1 text-body-sm text-neutral-700 hover:text-ink transition-colors"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="truncate">{item.label}</span>
                                {item.isHot && (
                                  <span className="shrink-0 rounded-sm bg-accent px-1 py-0.5 text-[9px] font-bold uppercase text-accent-ink">
                                    New
                                  </span>
                                )}
                              </span>
                              <ArrowRight className="h-3 w-3 shrink-0 text-faint" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}