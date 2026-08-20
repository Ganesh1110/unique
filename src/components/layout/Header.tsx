'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  LayoutGrid,
  ChevronDown,
} from 'lucide-react';
import { BrowseCategoriesDesktopMenu, BrowseCategoriesMobileAccordion } from '@/components/layout/BrowseCategoriesMenu';

const navigation = [
  { name: 'Collections', href: '/collections' },
  { name: 'New Arrivals', href: '/collections/new-arrivals' },
  { name: 'Bestsellers', href: '/collections/bestsellers' },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const displayText = announcementText || `Complimentary shipping on orders over ${freeShippingThreshold}`;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
      setSearchOpen(false);
      setMegaMenuOpen(false);
    }
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-neutral-950/10 transition-shadow duration-normal',
        scrolled && 'shadow-[0_8px_24px_-20px_rgba(0,0,0,0.18)]'
      )}
      onKeyDown={handleKeyDown}
      role="banner"
    >
      {/* Announcement Bar */}
      {announcementEnabled && (
        <div className="bg-neutral-950 text-neutral-400 py-2 px-4 text-center text-[11px] uppercase tracking-[0.2em] font-medium overflow-hidden border-b border-neutral-900">
          <div>{displayText}</div>
        </div>
      )}

      {/* Main UNIQLO-Style Header */}
      <div className="max-w-container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Left: Red Square Logo Badge & Department Tabs */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex-shrink-0 bg-[#E60012] text-white px-3 py-2 font-sans font-black text-xl sm:text-2xl tracking-tighter uppercase leading-none shadow-sm hover:opacity-95 transition-opacity"
              aria-label={`${shopName} Home`}
            >
              AURA
            </Link>

            {/* Department Navigation Tabs (UNIQLO Style) */}
            <nav className="hidden md:flex items-center gap-6 font-sans text-body-sm font-semibold uppercase tracking-wider text-neutral-800" aria-label="Department navigation">
              <Link
                href="/collections/sarees"
                className="relative py-5 text-neutral-950 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-950"
              >
                SAREES
              </Link>
              <Link
                href="/collections/silk-sarees"
                className="py-5 text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                SILK SAREES
              </Link>
              <Link
                href="/collections/lehengas"
                className="py-5 text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                LEHENGAS
              </Link>
              <Link
                href="/collections/tops"
                className="py-5 text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                TOPS
              </Link>
              <Link
                href="/collections/sarees"
                className="py-5 text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                NEW
              </Link>
            </nav>
          </div>

          {/* Center: Integrated Rounded Search Pill Input (UNIQLO Style) */}
          <div className="flex-1 max-w-md hidden sm:block">
            <form action="/search" className="relative flex items-center">
              <input
                type="search"
                name="q"
                placeholder="What are you looking for?"
                className="w-full bg-neutral-100/90 border border-neutral-300 rounded-full py-2 pl-5 pr-11 text-body-sm text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-950 focus:outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-950 transition-colors"
                aria-label="Search submit"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Right: Utility Icons Bar */}
          <div className="flex items-center gap-2 sm:gap-4 text-neutral-800">
            {/* Mobile Search Button */}
            <button
              className="sm:hidden inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account"
              className="inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors"
              aria-label="Wishlist"
              title="Saved items"
            >
              <span className="sr-only">Wishlist</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors"
              aria-label="Account"
              title="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors"
              aria-label={`Shopping bag${totalQuantity > 0 ? `, ${totalQuantity} items` : ''}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span
                  className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center text-[9px] font-bold text-white bg-[#E60012] rounded-full"
                  aria-live="polite"
                  data-cart-count
                >
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </button>

            {/* All Categories Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setMegaMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors"
              aria-expanded={megaMenuOpen}
              aria-label="Toggle all categories menu"
              title="All Categories"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Mega Menu Overlay */}
      {megaMenuOpen && (
        <div className="hidden lg:block relative z-40">
          <BrowseCategoriesDesktopMenu onClose={() => setMegaMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Menu Portal */}
      {mobileMenuOpen && mounted && createPortal(
        <div className="fixed inset-0 z-overlay lg:hidden flex" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-overlay w-full max-w-xs sm:max-w-sm h-full bg-cream-50 p-6 overflow-y-auto animate-slide-in-left flex flex-col justify-between border-r border-neutral-950/10 mr-auto">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-950/10">
                <span className="font-heading text-heading-lg tracking-tight text-neutral-950 font-semibold">
                  AURA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-neutral-500 hover:text-neutral-950 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Browse Categories Accordion */}
              <BrowseCategoriesMobileAccordion onClose={() => setMobileMenuOpen(false)} />

              {/* Mobile Quick Search Input */}
              <form
                action="/search"
                onSubmit={() => setMobileMenuOpen(false)}
                className="relative mb-6"
              >
                <Search className="h-4 w-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search sarees, lehengas, tops..."
                  className="input pl-10 text-body-sm"
                />
              </form>

              <nav aria-label="Mobile navigation">
                <ul className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex min-h-[44px] items-center justify-between gap-3 py-2.5 text-body-lg font-medium text-neutral-950 hover:text-gold-600 transition-colors border-b border-neutral-100"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-6 space-y-1">
                <Link
                  href="/account"
                  className="flex min-h-[44px] items-center gap-3 py-2.5 text-body-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-neutral-400" />
                  My Account
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); openCart(); }}
                  className="w-full flex min-h-[44px] items-center gap-3 py-2.5 text-left text-body-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4 text-neutral-400" />
                  Shopping Bag
                  {totalQuantity > 0 && (
                    <span className="ml-auto text-neutral-950 font-bold">({totalQuantity})</span>
                  )}
                </button>
              </div>
            </div>

            {/* Support Info Footer */}
            <div className="mt-8 pt-6 border-t border-neutral-200 text-caption text-neutral-500 space-y-2">
              <p className="font-semibold text-neutral-900 uppercase tracking-wider text-[10px]">Client Concierge</p>
              <p>Mon–Fri: 10:00 AM – 6:00 PM IST</p>
              <p className="text-gold-600 font-medium">+91 22 XXXX XXXX &bull; {shopEmail}</p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Search Modal Portal */}
      {searchOpen && mounted && createPortal(
        <div className="fixed inset-0 z-overlay flex flex-col justify-start" role="dialog" aria-modal="true" aria-label="Search">
          <div className="fixed inset-0 bg-neutral-950/65 backdrop-blur-md transition-opacity" onClick={() => setSearchOpen(false)} />
          
          <div className="relative z-overlay w-full bg-cream-50 border-b border-neutral-950/10 animate-slide-up">
            <div className="max-w-container-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
              <form
                action="/search"
                onSubmit={() => setSearchOpen(false)}
                className="flex items-center gap-3 sm:gap-4 border-b border-neutral-950/20 pb-3 focus-within:border-neutral-950 transition-colors"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-500 flex-shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search sarees, lehengas, silk, linen..."
                  className="flex-1 min-h-[44px] bg-transparent font-heading text-lg sm:text-display-sm text-neutral-950 placeholder:font-sans placeholder:text-body-sm sm:placeholder:text-body placeholder:text-neutral-400 focus:outline-none border-none p-0"
                  autoFocus
                  aria-label="Search"
                />
                <button
                  type="submit"
                  className="btn-primary hidden sm:inline-flex py-2 px-5 text-caption font-medium uppercase tracking-[0.14em]"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-neutral-400 hover:text-neutral-950 transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-6 w-6" />
                </button>
              </form>

              {/* Quick Trending Searches */}
              <div className="mt-4 pt-1 flex flex-wrap items-center gap-2 text-caption">
                <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px] mr-1">Trending:</span>
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
                    className="inline-flex min-h-[40px] items-center px-3 py-1.5 bg-neutral-950/[0.04] hover:bg-neutral-950 hover:text-cream-50 rounded-sm text-neutral-700 transition-colors font-sans font-medium text-caption"
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