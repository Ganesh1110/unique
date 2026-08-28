'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  Sun,
  Moon,
  Monitor,
  Heart,
} from 'lucide-react';
import {
  BrowseCategoriesDesktopMenu,
  BrowseCategoriesMobileAccordion,
  type MegaCategory,
} from '@/components/layout/BrowseCategoriesMenu';

const navigation = [
  { name: 'Collections', href: '/collections' },
  { name: 'New Arrivals', href: '/collections/new-arrivals' },
  { name: 'Bestsellers', href: '/collections/bestsellers' },
];

/* Departments that open the image-tile mega menu on hover */
const departments: Array<{ id: string; name: string; href: string; menuId?: string }> = [
  { id: 'sarees', name: 'Sarees', href: '/collections/sarees', menuId: 'sarees' },
  { id: 'silk', name: 'Silk Sarees', href: '/collections/silk-sarees', menuId: 'sarees' },
  { id: 'lehengas', name: 'Lehengas', href: '/collections/lehengas', menuId: 'lehengas' },
  { id: 'tops', name: 'Tops & Tunics', href: '/collections/tops', menuId: 'tops' },
  { id: 'new', name: 'New', href: '/collections/new-arrivals' },
];

interface HeaderProps {
  shopName?: string;
  freeShippingThreshold?: string;
  shopEmail?: string;
  announcementText?: string;
  announcementMarquee?: boolean;
  announcementEnabled?: boolean;
}

export function Header({
  shopName = 'AURA',
  freeShippingThreshold = '₹15,000',
  shopEmail = 'hello@aura.com',
  announcementText,
  announcementMarquee = true,
  announcementEnabled = true,
}: HeaderProps = {}) {
  const { totalQuantity, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDept, setActiveDept] = useState<MegaCategory | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayText =
    announcementText || `Complimentary shipping on orders over ${freeShippingThreshold}`;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
      setSearchOpen(false);
      setActiveDept(null);
    }
  }, []);

  const openDepartment = (menuId?: string) => {
    if (!menuId) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDept({ id: menuId } as MegaCategory);
  };

  const scheduleCloseDepartment = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveDept(null), 140);
  };

  const cycleTheme = () => {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(theme) + 1) % order.length] as 'light' | 'dark' | 'system';
    setTheme(next);
  };

  const themeLabel = theme === 'system' ? 'System theme' : theme === 'dark' ? 'Dark mode' : 'Light mode';
  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <header
      className={cn(
        'sticky top-0 left-0 right-0 z-header bg-canvas/95 backdrop-blur-md border-b border-ink/10 transition-shadow duration-normal',
        scrolled && 'shadow-[0_8px_24px_-16px_rgba(0,0,0,0.18)]'
      )}
      onKeyDown={handleKeyDown}
      role="banner"
    >
      {/* Announcement Bar — quiet, minimal */}
      {announcementEnabled && (
        <div className="bg-night text-accent-ink/60 py-2 px-4 text-center text-[10px] uppercase tracking-[0.22em] font-medium overflow-hidden">
          {announcementMarquee ? (
            <div className="marquee-track">
              <span>{displayText}</span>
              <span aria-hidden="true">&nbsp;&nbsp;·&nbsp;&nbsp;{displayText}</span>
            </div>
          ) : (
            <div>{displayText}</div>
          )}
        </div>
      )}

      {/* Main Row */}
      <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px] gap-3 sm:gap-6">
          {/* Left: Wordmark + Dept nav */}
          <div className="flex items-center gap-6 lg:gap-8 flex-shrink-0">
            {/* Wordmark — more confident, luxury presence */}
            <Link href="/" className="group flex items-baseline gap-1.5" aria-label={`${shopName} home`}>
              <span className="font-heading text-[1.6rem] sm:text-[1.8rem] font-medium tracking-[0.04em] text-ink leading-none">
                {shopName}
              </span>
              <span
                className="hidden sm:inline-block h-[5px] w-[5px] bg-accent rounded-full transition-transform duration-300 ease-expo group-hover:scale-125"
                aria-hidden="true"
              />
            </Link>

            {/* Department navigation — Uniqlo-style: small, uppercase, tracked */}
            <nav
              className="hidden lg:flex items-center gap-6 xl:gap-8"
              aria-label="Department navigation"
              onMouseLeave={scheduleCloseDepartment}
            >
              {departments.map((dept) => (
                <Link
                  key={dept.id}
                  href={dept.href}
                  onMouseEnter={() => openDepartment(dept.menuId)}
                  onFocus={() => openDepartment(dept.menuId)}
                  className={cn(
                    'relative py-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-600 hover:text-ink transition-colors duration-fast',
                    'after:absolute after:left-0 after:right-0 after:bottom-3 after:h-[2px] after:bg-accent after:scale-x-0 after:origin-left after:transition-transform after:duration-250 after:ease-expo hover:after:scale-x-100'
                  )}
                >
                  {dept.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Search — sharp-cornered, refined */}
          <div className="flex-1 max-w-sm hidden md:block">
            <form action="/search" className="relative flex items-center group">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-faint pointer-events-none transition-colors duration-fast group-focus-within:text-accent"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                placeholder="Search sarees, silk, linen…"
                className="w-full bg-sunken border border-ink/10 py-2 pl-10 pr-4 text-body-sm text-ink placeholder:text-neutral-500 focus:bg-surface focus:border-accent/40 focus:outline-none transition-all duration-fast"
                style={{ borderRadius: 0 }}
              />
            </form>
          </div>

          {/* Right: Utility icons — tighter cluster */}
          <div className="flex items-center gap-0 text-ink">
            {/* Mobile search */}
            <button
              className="md:hidden inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-ink transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              className="inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-ink transition-colors"
              aria-label={`Toggle theme, currently ${themeLabel}`}
              title={themeLabel}
            >
              <ThemeIcon className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              className="relative inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-ink transition-colors"
              aria-label={`Saved items${wishlistCount > 0 ? `, ${wishlistCount} saved` : ''}`}
              title="Saved items"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-ink text-[9px] font-bold">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-ink transition-colors"
              aria-label="Account"
              title="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-ink transition-colors"
              aria-label={`Shopping bag${totalQuantity > 0 ? `, ${totalQuantity} items` : ''}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-ink text-[9px] font-bold"
                  aria-live="polite"
                  data-cart-count
                >
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-ink transition-colors"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu Panel */}
      {activeDept && (
        <div
          className="hidden lg:block relative z-40"
          onMouseEnter={() => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
          }}
          onMouseLeave={scheduleCloseDepartment}
        >
          <BrowseCategoriesDesktopMenu activeId={activeDept.id} onClose={() => setActiveDept(null)} />
        </div>
      )}

      {/* Mobile Menu Portal */}
      {mobileMenuOpen && mounted && createPortal(
        <div className="fixed inset-0 z-overlay lg:hidden flex" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-overlay w-full max-w-sm h-full bg-canvas overflow-y-auto flex flex-col border-r border-ink/10 mr-auto animate-slide-in-left">
            <div className="px-6 pt-5 pb-4 border-b border-ink/10 flex items-center justify-between">
              <span className="font-heading text-heading-md font-semibold tracking-tight text-ink">
                {shopName}
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 hover:text-ink transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Search */}
              <form action="/search" onSubmit={() => setMobileMenuOpen(false)} className="relative">
                <Search className="h-4 w-4 text-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search sarees, lehengas, tops…"
                  className="input pl-10 text-body-sm"
                />
              </form>

              {/* Department links */}
              <nav aria-label="Mobile navigation" className="space-y-1">
                {departments.map((dept, i) => (
                  <Link
                    key={dept.id}
                    href={dept.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ transitionDelay: `${60 + i * 40}ms` }}
                    className="flex min-h-[48px] items-center justify-between border-b border-ink/5 text-body-lg font-medium text-ink hover:text-accent transition-colors"
                  >
                    {dept.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-1">
                <p className="text-overline font-semibold uppercase tracking-[0.18em] text-faint mb-2">
                  Browse all
                </p>
                <BrowseCategoriesMobileAccordion onClose={() => setMobileMenuOpen(false)} />
              </div>

              <nav aria-label="Footer navigation" className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[44px] items-center gap-3 py-2 text-body-sm font-medium text-neutral-700 hover:text-ink transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-auto px-6 py-6 border-t border-ink/10 space-y-1">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center gap-3 py-2 text-body-sm font-medium text-neutral-700 hover:text-ink transition-colors"
              >
                <User className="h-4 w-4 text-faint" />
                My Account
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full flex min-h-[44px] items-center gap-3 py-2 text-left text-body-sm font-medium text-neutral-700 hover:text-ink transition-colors"
              >
                <ShoppingBag className="h-4 w-4 text-faint" />
                Shopping Bag
                {totalQuantity > 0 && <span className="ml-auto font-bold text-ink">({totalQuantity})</span>}
              </button>
              <p className="pt-3 text-caption text-faint">
                {shopEmail} · Mon–Fri, 10am–6pm IST
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Search Modal Portal */}
      {searchOpen && mounted && createPortal(
        <div className="fixed inset-0 z-overlay flex flex-col justify-start" role="dialog" aria-modal="true" aria-label="Search">
          <div className="fixed inset-0 bg-ink/65 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
          <div className="relative z-overlay w-full bg-canvas border-b border-ink/10 animate-slide-up">
            <div className="max-w-container-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <form
                action="/search"
                onSubmit={() => setSearchOpen(false)}
                className="flex items-center gap-3 sm:gap-4 border-b border-ink/20 pb-3 focus-within:border-accent transition-colors"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-faint flex-shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search sarees, lehengas, silk, linen…"
                  className="flex-1 min-h-[44px] bg-transparent font-heading text-lg sm:text-display-sm text-ink placeholder:font-sans placeholder:text-body-sm sm:placeholder:text-body placeholder:text-faint focus:outline-none border-none p-0"
                  autoFocus
                  aria-label="Search"
                />
                <button type="submit" className="btn-primary hidden sm:inline-flex py-2 px-5 text-caption font-medium uppercase tracking-[0.14em]">
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-400 hover:text-ink transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-6 w-6" />
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-caption">
                <span className="text-faint font-semibold uppercase tracking-wider text-[10px] mr-1">Trending:</span>
                {[
                  { label: 'Kanjeevaram Silk', query: 'kanjeevaram' },
                  { label: 'Banarasi Sarees', query: 'banarasi' },
                  { label: 'Bridal Lehengas', query: 'lehenga' },
                  { label: 'Linen Sarees', query: 'linen' },
                  { label: 'New Arrivals', query: 'new' },
                ].map((tag) => (
                  <Link
                    key={tag.label}
                    href={`/search?q=${encodeURIComponent(tag.query)}`}
                    onClick={() => setSearchOpen(false)}
                    className="inline-flex min-h-[40px] items-center px-3 py-1.5 bg-sunken hover:bg-accent hover:text-accent-ink rounded-sm text-neutral-700 transition-colors duration-fast font-sans font-medium text-caption"
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}