'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';
import type { Menu, ShopPolicy } from '@/types/shopify';
import { NewsletterForm } from '@/components/home/NewsletterForm';

interface FooterProps {
  menus: Menu[];
  policies: {
    privacyPolicy: ShopPolicy | null;
    refundPolicy: ShopPolicy | null;
    termsOfService: ShopPolicy | null;
    shippingPolicy: ShopPolicy | null;
  };
  shopName?: string;
  shopEmail?: string;
}

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com', ariaLabel: 'Follow us on Instagram' },
];

export function Footer({ menus, policies, shopName = 'AURA', shopEmail = 'hello@aura.com' }: FooterProps) {
  const displayShopName = shopName.toLowerCase().includes('jewel') || shopName.toLowerCase().includes('statement') ? 'AURA' : shopName;
  const displayShopEmail = shopEmail.toLowerCase().includes('statement') ? 'hello@aura.com' : shopEmail;
  const mainMenu = menus.find((m) => m.handle === 'main-menu' || m.handle === 'footer');
  const footerMenus = mainMenu?.items.filter((item) => item.items && item.items.length > 0) || [];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-night text-accent-ink" role="contentinfo">
      {/* Main Footer Links */}
      <div className="py-20 sm:py-28 lg:py-32">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-8 gap-y-14">
            {/* Brand Column */}
            <div className="sm:col-span-2 md:col-span-1 lg:col-span-4 space-y-6">
              <Link
                href="/"
                className="inline-flex items-baseline gap-1.5 font-heading text-display-sm font-semibold tracking-[0.02em] text-accent-ink"
                aria-label={`${displayShopName} home`}
              >
                {displayShopName}
                <span className="h-[5px] w-[5px] rounded-full bg-gold-400" aria-hidden="true" />
              </Link>
              <p className="text-body-sm text-accent-ink/55 max-w-xs leading-relaxed">
                Handwoven sarees, designer lehengas &amp; modern everyday wear. Crafted with care,
                shipped worldwide from India.
              </p>

              <div className="pt-2">
                <p className="text-caption font-medium uppercase tracking-[0.18em] text-accent-ink/60 mb-3">
                  The Collective — Join the list
                </p>
                <NewsletterForm />
              </div>

              <a
                href={socialLinks[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-body-sm text-accent-ink/55 hover:text-accent-ink transition-colors"
                aria-label={socialLinks[0].ariaLabel}
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
                {socialLinks[0].name}
              </a>
            </div>

            {/* Navigation Columns */}
            {footerMenus.map((menuItem) => (
              <nav key={menuItem.title} aria-label={menuItem.title} className="lg:col-span-2">
                <h3 className="text-caption font-medium uppercase tracking-[0.18em] text-accent-ink/55 mb-5">
                  {menuItem.title}
                </h3>
                <ul className="space-y-3" role="list">
                  {menuItem.items?.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.url}
                        className="text-body-sm text-accent-ink/60 hover:text-accent-ink transition-colors block py-0.5"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Contact Column */}
            <div className="sm:col-span-2 md:col-span-1 lg:col-span-2 space-y-4">
              <h3 className="text-caption font-medium uppercase tracking-[0.18em] text-accent-ink/55 mb-5">
                Contact
              </h3>
              <address className="not-italic text-body-sm text-accent-ink/60 space-y-3">
                <a href={`mailto:${displayShopEmail}`} className="block hover:text-accent-ink transition-colors">
                  {displayShopEmail}
                </a>
                <a href="tel:+9122xxxxxxx" className="block hover:text-accent-ink transition-colors">
                  +91 22 XXXX XXXX
                </a>
                <p className="pt-1 text-caption text-accent-ink/40">
                  Mon–Fri, 10am–6pm IST
                </p>
              </address>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-accent-ink/10">
        <div className="container py-7">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-body-sm text-accent-ink/40">
              © {currentYear} {displayShopName}. All rights reserved.
            </p>

            <nav aria-label="Legal policies" className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              <Link href="/terms-of-service" className="text-body-sm text-accent-ink/50 hover:text-accent-ink transition-colors">
                Terms &amp; Conditions
              </Link>
              <Link href="/refund-policy" className="text-body-sm text-accent-ink/50 hover:text-accent-ink transition-colors">
                Return Policy
              </Link>
              <Link href="/privacy-policy" className="text-body-sm text-accent-ink/50 hover:text-accent-ink transition-colors">
                Privacy Policy
              </Link>
              <Link href="/shipping-policy" className="text-body-sm text-accent-ink/50 hover:text-accent-ink transition-colors">
                Shipping Policy
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}