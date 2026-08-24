'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import { getLocalFeatureFlags } from '@/lib/feature-flags';

const LIVE_NOTIFICATIONS = [
  { name: 'Ananya R.', city: 'Bengaluru', product: 'Kanjeevaram Pure Silk Saree', time: '3 mins ago' },
  { name: 'Priya M.', city: 'Mumbai', product: 'Banarasi Zari Brocade Saree', time: '7 mins ago' },
  { name: 'Kavita S.', city: 'Delhi NCR', product: 'Chanderi Tissue Organza Saree', time: '12 mins ago' },
  { name: 'Ritu K.', city: 'Hyderabad', product: 'Bridal Velvet Lehenga Set', time: '18 mins ago' },
  { name: 'Deepa N.', city: 'Chennai', product: 'Handloom Pure Linen Saree', time: '24 mins ago' },
];

export function LiveSalesToast() {
  const [enabled, setEnabled] = useState(true);
  const [toastIndex, setToastIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const flags = getLocalFeatureFlags();
    setEnabled(flags.liveSalesToasts);

    const handleFlagUpdate = () => {
      const updated = getLocalFeatureFlags();
      setEnabled(updated.liveSalesToasts);
      if (!updated.liveSalesToasts) setVisible(false);
    };
    window.addEventListener('aura_feature_flags_updated', handleFlagUpdate);

    // Initial show after 6 seconds
    const initialTimer = setTimeout(() => {
      if (flags.liveSalesToasts) setVisible(true);
    }, 6000);

    // Rotation interval every 22 seconds
    const interval = setInterval(() => {
      const currentFlags = getLocalFeatureFlags();
      if (!currentFlags.liveSalesToasts) return;

      setVisible(false);
      setTimeout(() => {
        setToastIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length);
        setVisible(true);
      }, 1000);
    }, 22000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      window.removeEventListener('aura_feature_flags_updated', handleFlagUpdate);
    };
  }, []);

  if (!enabled || !visible) return null;

  const current = LIVE_NOTIFICATIONS[toastIndex];

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-neutral-200 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-900 transition-colors p-1"
        aria-label="Dismiss toast"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-center gap-3 pr-4">
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <ShoppingBag className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-950">{current.name}</span> from {current.city}
            <span className="text-neutral-300">•</span>
            <span>{current.time}</span>
          </div>
          <p className="text-body-xs font-bold text-neutral-950 truncate mt-0.5">
            Purchased {current.product}
          </p>
        </div>
      </div>
    </div>
  );
}
