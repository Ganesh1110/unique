'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';
import type { Menu, ShopPolicy } from '@/types/shopify';
import { NewsletterForm } from '@/components/home/NewsletterForm';

interface FooterProps {
  menus?: Menu[];
  policies?: {
    privacyPolicy: ShopPolicy | null;
    refundPolicy: ShopPolicy | null;
    termsOfService: ShopPolicy | null;
    shippingPolicy: ShopPolicy | null;
  };
  shopName?: string;
  shopEmail?: string;
}

/* ─────────────────────────────────────────────────────────
   Static fallback nav columns — renders when Shopify menus
   are unconfigured. Matches NAP footer column discipline.
   ───────────────────────────────────────────────────────── */
const STATIC_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Silk Sarees', href: '/collections/silk-sarees' },
      { label: 'Banarasi Sarees', href: '/collections/sarees' },
      { label: 'Lehengas & Festive', href: '/collections/lehengas' },
      { label: 'Tops & Tunics', href: '/collections/tops' },
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Bestsellers', href: '/collections/bestsellers' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'The Artisans', href: '/about#artisans' },
      { label: 'Sustainability', href: '/about#sustainability' },
      { label: 'Journal', href: '/blog' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'WhatsApp Concierge', href: 'https://wa.me/' },
      { label: 'Shipping Information', href: '/shipping-policy' },
      { label: 'Returns & Exchanges', href: '/refund-policy' },
      { label: 'Size & Drape Guide', href: '/collections#size-guide' },
      { label: 'Track Your Order', href: '/account' },
    ],
  },
];

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com', ariaLabel: 'Follow us on Instagram' },
];

export function Footer({ menus = [], policies, shopName = 'AURA', shopEmail = 'hello@aura.com' }: FooterProps) {
  const displayShopName = shopName.toLowerCase().includes('jewel') || shopName.toLowerCase().includes('statement') ? 'AURA' : shopName;
  const displayShopEmail = shopEmail.toLowerCase().includes('statement') ? 'hello@aura.com' : shopEmail;

  /* Build nav columns from Shopify menus OR fall back to static */
  const mainMenu = menus.find((m) => m.handle === 'main-menu' || m.handle === 'footer');
  const shopifyColumns = mainMenu?.items.filter((item) => item.items && item.items.length > 0) || [];
  const useStaticFallback = shopifyColumns.length === 0;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-night text-accent-ink" role="contentinfo">

      {/* ── Main footer grid ── */}
      <div className="py-20 sm:py-28 lg:py-32">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">

            {/* Brand column — newsletter lives here (NAP pattern) */}
            <div className="sm:col-span-2 lg:col-span-4 space-y-7">
              {/* Wordmark */}
              <Link
                href="/"
                className="inline-flex items-baseline gap-1.5 font-heading text-display-xs font-medium tracking-[0.04em] text-accent-ink"
                aria-label={`${displayShopName} home`}
              >
                {displayShopName}
                <span className="h-[5px] w-[5px] rounded-full bg-gold-400" aria-hidden="true" />
              </Link>

              {/* Tagline */}
              <p className="text-body-sm text-accent-ink/50 max-w-[28ch] leading-relaxed">
                Handwoven sarees & designer lehengas crafted with care, shipped worldwide from India.
              </p>

              {/* Newsletter — The Collective */}
              <div>
                <p className="section-label text-accent-ink/50 mb-3">
                  The Collective — Join the list
                </p>
                <NewsletterForm />
              </div>

              {/* Social */}
              <a
                href={socialLinks[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-body-sm text-accent-ink/45 hover:text-accent-ink transition-colors"
                aria-label={socialLinks[0].ariaLabel}
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                {socialLinks[0].name}
              </a>
            </div>

            {/* Navigation columns */}
            {useStaticFallback
              ? STATIC_COLUMNS.map((col) => (
                  <nav key={col.title} aria-label={col.title} className="lg:col-span-2">
                    {/* Column heading — thin rule above */}
                    <div className="w-5 h-px bg-accent-ink/25 mb-4" aria-hidden="true" />
                    <h3 className="section-label text-accent-ink/50 mb-5">
                      {col.title}
                    </h3>
                    <ul className="space-y-3" role="list">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="text-body-sm text-accent-ink/55 hover:text-accent-ink transition-colors block py-0.5"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))
              : shopifyColumns.map((menuItem) => (
                  <nav key={menuItem.title} aria-label={menuItem.title} className="lg:col-span-2">
                    <div className="w-5 h-px bg-accent-ink/25 mb-4" aria-hidden="true" />
                    <h3 className="section-label text-accent-ink/50 mb-5">
                      {menuItem.title}
                    </h3>
                    <ul className="space-y-3" role="list">
                      {menuItem.items?.map((item) => (
                        <li key={item.title}>
                          <Link
                            href={item.url}
                            className="text-body-sm text-accent-ink/55 hover:text-accent-ink transition-colors block py-0.5"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))}

            {/* Contact column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="w-5 h-px bg-accent-ink/25 mb-4" aria-hidden="true" />
              <h3 className="section-label text-accent-ink/50 mb-5">Contact</h3>
              <address className="not-italic text-body-sm text-accent-ink/55 space-y-3">
                <a href={`mailto:${displayShopEmail}`} className="block hover:text-accent-ink transition-colors">
                  {displayShopEmail}
                </a>
                <a href="tel:+9122xxxxxxx" className="block hover:text-accent-ink transition-colors">
                  +91 22 XXXX XXXX
                </a>
                <p className="pt-1 text-[11px] text-accent-ink/35 leading-relaxed">
                  Mon–Fri<br />10am–6pm IST
                </p>
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quiet trust strip — NAP pattern (before the bottom bar) ── */}
      <div className="border-t border-accent-ink/10">
        <div className="container py-5">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-accent-ink/30 font-medium">
            Secure Checkout&nbsp;&nbsp;·&nbsp;&nbsp;Hand-woven in India&nbsp;&nbsp;·&nbsp;&nbsp;Ships Worldwide&nbsp;&nbsp;·&nbsp;&nbsp;GI-Certified Artisans
          </p>
        </div>
      </div>

      {/* ── Bottom bar — copyright + policy links ── */}
      <div className="border-t border-accent-ink/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-accent-ink/35 font-medium">
              © {currentYear} {displayShopName}. All rights reserved.
            </p>

            <nav aria-label="Legal policies" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link href="/terms-of-service" className="text-[11px] text-accent-ink/40 hover:text-accent-ink/70 transition-colors">
                Terms
              </Link>
              <Link href="/refund-policy" className="text-[11px] text-accent-ink/40 hover:text-accent-ink/70 transition-colors">
                Returns
              </Link>
              <Link href="/privacy-policy" className="text-[11px] text-accent-ink/40 hover:text-accent-ink/70 transition-colors">
                Privacy
              </Link>
              <Link href="/shipping-policy" className="text-[11px] text-accent-ink/40 hover:text-accent-ink/70 transition-colors">
                Shipping
              </Link>
              {policies?.privacyPolicy && (
                <Link href="/privacy-policy" className="text-[11px] text-accent-ink/40 hover:text-accent-ink/70 transition-colors sr-only">
                  Privacy Policy
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}