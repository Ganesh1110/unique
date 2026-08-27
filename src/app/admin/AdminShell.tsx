'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Plus, Package, LogOut, Eye, ShieldCheck, ShoppingBag, Settings, Users, Tag, Truck } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Add Product', href: '/admin/products/new', icon: Plus },
  { name: 'Inventory', href: '/admin/inventory', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Discounts', href: '/admin/discounts', icon: Tag },
  { name: 'Weavers', href: '/admin/suppliers', icon: Truck },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminShell({ sessionEmail, children }: { sessionEmail: string | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!sessionEmail && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [sessionEmail, isLoginPage, router]);

  if (!sessionEmail && !isLoginPage) {
    return <div className="min-h-screen bg-cream-50" />;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0] font-sans text-neutral-900">
      <header className="bg-neutral-950/95 backdrop-blur-md text-cream-50 sticky top-0 z-50 border-b border-neutral-800/80 shadow-md">
        <div className="container h-15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin" className="flex items-center gap-2.5 font-heading text-heading-sm text-cream-50 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-neutral-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-body-sm tracking-wide text-white leading-tight">AURA Admin</span>
                <span className="text-[10px] text-gold-400 uppercase font-semibold tracking-widest leading-none">Console Suite</span>
              </div>
            </Link>
          </div>

          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-hide" aria-label="Admin navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-label={isActive ? `${item.name} (current)` : item.name}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-body-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-neutral-950 shadow-md shadow-gold-500/20 ring-1 ring-gold-400/50'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}

            <div className="h-5 w-[1px] bg-neutral-800 mx-1 hidden sm:block" />

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-body-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-neutral-800/80 transition-all border border-emerald-900/60 bg-emerald-950/40"
              title="View live storefront in a new tab"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-body-xs font-bold text-neutral-400 hover:text-red-400 hover:bg-neutral-800/80 transition-colors"
              title="Log out of admin portal"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-neutral-950 text-neutral-400 py-6 border-t border-neutral-800 text-center text-caption">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} AURA Store Owner Management Suite. Confidential &amp; Encrypted System.</p>
          <div className="flex items-center gap-3 text-[11px] text-neutral-500">
            <span>Status: <strong className="text-emerald-400">System Normal</strong></span>
            <span>•</span>
            <span>Version: <strong>2.5.0-PRO</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}