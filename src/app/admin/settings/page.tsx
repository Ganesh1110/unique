'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useTheme, type Theme } from '@/context/ThemeContext';
import { ArrowLeft, Store, KeyRound, Palette, Bell, Info, Check, Eye, Megaphone, Sliders, ShieldCheck, Save, Sparkles } from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '@/lib/currencies';
import { getLocalFeatureFlags, saveLocalFeatureFlags, type FeatureFlags } from '@/lib/feature-flags';

interface ConfigRow {
  key: string;
  label: string;
  value: string;
  hint: string;
}

const DEFAULT_CONFIG: ConfigRow[] = [
  { key: 'store_name', label: 'Store Name', value: 'AURA', hint: 'Shown in the storefront header and metadata' },
  { key: 'store_email', label: 'Store Email', value: 'hello@aura.com', hint: 'Used for order notifications and contact form' },
  { key: 'whatsapp_number', label: 'WhatsApp Phone Number', value: '+919876543210', hint: 'Phone number for WhatsApp concierge and product inquiry (with country code)' },
  { key: 'currency', label: 'Currency', value: 'INR (₹) - India', hint: 'Currency for pricing and inventory valuation' },
  { key: 'free_shipping_threshold', label: 'Free Shipping Above', value: '₹15,000', hint: 'Complimentary shipping above this cart value' },
  { key: 'return_window', label: 'Return Window', value: '14 days', hint: 'Return period shown on the PDP and checkout' },
  { key: 'announcement_text', label: 'Top Announcement Text', value: 'Complimentary shipping on orders over ₹15,000', hint: 'Offer or announcement banner displayed at top of storefront' },
  { key: 'announcement_marquee', label: 'Enable Marquee Animation (true/false)', value: 'true', hint: 'Set to "true" for continuous scrolling marquee, or "false" for static text' },
  { key: 'announcement_enabled', label: 'Enable Announcement Bar (true/false)', value: 'true', hint: 'Set to "true" to show top bar, or "false" to hide' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', value: 'Handcrafted in Mumbai', hint: 'Small text above the main headline' },
  { key: 'hero_title', label: 'Hero Title', value: 'Handwoven Sarees &amp; Ethnic Wear', hint: 'Main headline on the homepage. Use HTML tags like <i> or <em> for italics.' },
  { key: 'hero_description', label: 'Hero Description', value: 'Discover handwoven Kanjeevaram silk sarees, Banarasi brocade, designer lehengas &amp; modern everyday wear. Shipped worldwide from India.', hint: 'Supporting text below the main headline' },
];

const DEFAULT_ALERTS = { lowStock: true, newOrder: true };

interface SavedSettings {
  config: ConfigRow[];
  alerts: { lowStock: boolean; newOrder: boolean };
}

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();
  const [config, setConfig] = useState<ConfigRow[]>(DEFAULT_CONFIG);
  const [alerts, setAlerts] = useState(DEFAULT_ALERTS);
  const [flags, setFlags] = useState<FeatureFlags>(getLocalFeatureFlags());
  const [activeTab, setActiveTab] = useState<'general' | 'features' | 'content' | 'preferences'>('general');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SavedSettings | null) => {
        if (data) {
          setConfig(data.config);
          setAlerts(data.alerts);
        }
      })
      .catch(() => {});
  }, []);

  const updateValue = (idx: number, value: string) => {
    setConfig((prev) => prev.map((row, i) => (i === idx ? { ...row, value } : row)));
  };

  const toggleFlag = (key: keyof FeatureFlags) => {
    const updated = { ...flags, [key]: !flags[key] };
    setFlags(updated);
    saveLocalFeatureFlags(updated);
    showToast(`Feature flag "${key}" updated!`, 'info');
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, alerts }),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      setSaved(true);
      showToast('Store configuration saved successfully!', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      showToast('Failed to save store settings.', 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F0]">
      {/* Header */}
      <header className="section-sm bg-white border-b border-neutral-200 shadow-sm">
        <div className="container max-w-5xl space-y-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-body-xs text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Admin Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="overline text-gold-600 block mb-1">Store Owner Configuration</span>
              <h1 className="font-heading text-display-md text-neutral-950">Store Settings Hub</h1>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="btn-primary text-body-xs font-bold uppercase tracking-wider py-2.5 px-6 bg-[#E60012] hover:bg-red-700 text-white min-h-[44px] inline-flex items-center gap-2 shadow-md self-start sm:self-auto"
            >
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>{saved ? 'Settings Saved' : 'Save Changes'}</span>
            </button>
          </div>

          {/* Settings Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-100 scrollbar-hide">
            {[
              { id: 'general', label: 'General & Regional', icon: Store },
              { id: 'features', label: 'Feature Visibility Controls', icon: Eye },
              { id: 'content', label: 'Hero & Announcements', icon: Megaphone },
              { id: 'preferences', label: 'Notifications & Theme', icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-body-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-800'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
                }`}
              >
                <tab.icon className="h-4 w-4 text-gold-500" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="section py-8" aria-label="Settings configuration form">
        <div className="container max-w-5xl space-y-6">
          {/* TAB 1: GENERAL & REGIONAL */}
          {activeTab === 'general' && (
            <div className="card p-6 sm:p-8 bg-white border border-neutral-200 space-y-6 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                <Store className="h-5 w-5 text-gold-600" />
                <div>
                  <h2 className="font-heading text-heading-md text-neutral-950">General Store Details</h2>
                  <p className="text-caption text-neutral-500">Store identity, customer contact details, and currency settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {config
                  .filter((c) => !c.key.startsWith('hero_') && !c.key.startsWith('announcement_'))
                  .map((row) => {
                    const configIdx = config.findIndex((c) => c.key === row.key);
                    return (
                      <div key={row.key} className="space-y-1.5 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                        <label className="label text-body-xs font-bold text-neutral-950" htmlFor={`config-${row.key}`}>
                          {row.label}
                        </label>
                        {row.key === 'currency' ? (
                          <select
                            id={`config-${row.key}`}
                            value={row.value}
                            onChange={(e) => updateValue(configIdx, e.target.value)}
                            className="input text-body-sm font-semibold bg-white cursor-pointer py-2.5"
                          >
                            {SUPPORTED_CURRENCIES.map((curr) => (
                              <option key={curr.code} value={curr.label}>
                                {curr.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={`config-${row.key}`}
                            type="text"
                            value={row.value}
                            onChange={(e) => updateValue(configIdx, e.target.value)}
                            className="input text-body-sm font-semibold bg-white py-2.5"
                          />
                        )}
                        <p className="text-caption text-neutral-500 mt-1">{row.hint}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 2: FEATURE VISIBILITY CONTROLS */}
          {activeTab === 'features' && (
            <div className="card p-6 sm:p-8 bg-white border border-neutral-200 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <Eye className="h-5 w-5 text-gold-600" />
                  <div>
                    <h2 className="font-heading text-heading-md text-neutral-950">Storefront Feature Visibility Control Center</h2>
                    <p className="text-caption text-neutral-500">Easily enable or hide individual storefront modules with 1-click switches</p>
                  </div>
                </div>
                <span className="badge-gold text-[10px] uppercase font-bold">Live Control</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'guestWelcomeOffer' as keyof FeatureFlags, title: 'Guest Welcome Offer Popup', desc: 'Shows first-time visitors a discount modal (WELCOME10 for 10% off)' },
                  { key: 'blouseCustomizer' as keyof FeatureFlags, title: 'Blouse Tailoring Customizer', desc: 'Allows buyers to select unstitched vs custom stitched blouse options on PDPs' },
                  { key: 'matchingPetticoatAddon' as keyof FeatureFlags, title: 'Matching Petticoat Add-on', desc: 'Enables 1-click matching cotton/satin petticoat checkbox on PDPs' },
                  { key: 'liveSalesToasts' as keyof FeatureFlags, title: 'Live Purchase Toasts', desc: 'Shows subtle recent purchase notifications in bottom-left corner' },
                  { key: 'compareDrawer' as keyof FeatureFlags, title: 'Compare Sarees Drawer', desc: 'Enables side-by-side comparison modal for comparing up to 3 sarees' },
                  { key: 'luxuryGiftWrap' as keyof FeatureFlags, title: 'Luxury Gift Packaging Option', desc: 'Enables gold gift packaging & handwritten note selector in cart drawer' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                      flags[item.key] ? 'bg-emerald-50/50 border-emerald-300' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="text-body-xs font-bold text-neutral-950">{item.title}</p>
                      <p className="text-caption text-neutral-500">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={flags[item.key]}
                      onClick={() => toggleFlag(item.key)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                        flags[item.key] ? 'bg-emerald-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          flags[item.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: HERO & ANNOUNCEMENTS */}
          {activeTab === 'content' && (
            <div className="card p-6 sm:p-8 bg-white border border-neutral-200 space-y-6 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                <Megaphone className="h-5 w-5 text-gold-600" />
                <div>
                  <h2 className="font-heading text-heading-md text-neutral-950">Storefront Content &amp; Headlines</h2>
                  <p className="text-caption text-neutral-500">Edit homepage hero text, announcements, and promotional copy</p>
                </div>
              </div>

              <div className="space-y-6">
                {config
                  .filter((c) => c.key.startsWith('hero_') || c.key.startsWith('announcement_'))
                  .map((row) => {
                    const configIdx = config.findIndex((c) => c.key === row.key);
                    return (
                      <div key={row.key} className="space-y-1.5 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                        <label className="label text-body-xs font-bold text-neutral-950" htmlFor={`config-${row.key}`}>
                          {row.label}
                        </label>
                        {row.key === 'hero_description' ? (
                          <textarea
                            id={`config-${row.key}`}
                            value={row.value}
                            onChange={(e) => updateValue(configIdx, e.target.value)}
                            className="input text-body-sm font-semibold bg-white min-h-[90px] py-2.5 resize-y"
                          />
                        ) : (
                          <input
                            id={`config-${row.key}`}
                            type="text"
                            value={row.value}
                            onChange={(e) => updateValue(configIdx, e.target.value)}
                            className="input text-body-sm font-semibold bg-white py-2.5"
                          />
                        )}
                        <p className="text-caption text-neutral-500 mt-1">{row.hint}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS & PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="card p-6 sm:p-8 bg-white border border-neutral-200 space-y-6 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-4">
                  <Bell className="h-5 w-5 text-gold-600" />
                  <div>
                    <h2 className="font-heading text-heading-md text-neutral-950">Store Alerts &amp; Notifications</h2>
                    <p className="text-caption text-neutral-500">Configure email alerts for low inventory and new customer orders</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <p className="text-body-xs font-bold text-neutral-950">Low Stock Warning Emails</p>
                      <p className="text-caption text-neutral-500">Receive alerts when inventory falls to 3 units or fewer</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={alerts.lowStock}
                      onClick={() => setAlerts((a) => ({ ...a, lowStock: !a.lowStock }))}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                        alerts.lowStock ? 'bg-neutral-950' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          alerts.lowStock ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <p className="text-body-xs font-bold text-neutral-950">New Order Notification Emails</p>
                      <p className="text-caption text-neutral-500">Receive instant emails whenever a customer places an order</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={alerts.newOrder}
                      onClick={() => setAlerts((a) => ({ ...a, newOrder: !a.newOrder }))}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0 ${
                        alerts.newOrder ? 'bg-neutral-950' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          alerts.newOrder ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme Preference */}
              <div className="card p-6 sm:p-8 bg-white border border-neutral-200 space-y-4 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-3">
                  <Palette className="h-5 w-5 text-gold-600" />
                  <h2 className="font-heading text-heading-md text-neutral-950">Console Theme Preference</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Light Mode', value: 'light' as Theme },
                    { label: 'Dark Mode', value: 'dark' as Theme },
                    { label: 'System Default', value: 'system' as Theme },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => {
                        setTheme(mode.value);
                        showToast(`Console theme set to ${mode.label}`, 'info');
                      }}
                      className={`inline-flex items-center gap-2 h-11 px-5 rounded-xl text-body-xs font-bold uppercase tracking-wider transition-all min-h-[44px] ${
                        theme === mode.value
                          ? 'bg-neutral-950 text-white ring-2 ring-gold-400/50 shadow-md'
                          : 'border border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}