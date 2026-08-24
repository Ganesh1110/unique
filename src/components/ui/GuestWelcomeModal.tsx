'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X, Gift, ArrowRight, Check } from 'lucide-react';
import { getLocalFeatureFlags } from '@/lib/feature-flags';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const WELCOME_MODAL_DISMISSED_KEY = 'aura_guest_welcome_dismissed';

export function GuestWelcomeModal() {
  const { applyCoupon } = useCart();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check feature flag
    const flags = getLocalFeatureFlags();
    if (!flags.guestWelcomeOffer) return;

    // Check if user already dismissed or logged in
    const dismissed = localStorage.getItem(WELCOME_MODAL_DISMISSED_KEY);
    if (dismissed) return;

    // Trigger modal after 3 seconds for first time guests
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    const handleFlagUpdate = () => {
      const updatedFlags = getLocalFeatureFlags();
      if (!updatedFlags.guestWelcomeOffer) {
        setIsOpen(false);
      }
    };
    window.addEventListener('aura_feature_flags_updated', handleFlagUpdate);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('aura_feature_flags_updated', handleFlagUpdate);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(WELCOME_MODAL_DISMISSED_KEY, 'true');
  };

  const handleClaimOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    applyCoupon('WELCOME10');
    setCopied(true);
    showToast('Promo code WELCOME10 applied! 10% discount added to your bag.', 'success');

    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200 z-10 space-y-6">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#E60012] text-caption font-extrabold uppercase tracking-widest">
            <Gift className="h-4 w-4" /> First Order Special
          </div>

          <h2 className="font-heading text-display-sm sm:text-display-md font-medium tracking-tight text-neutral-950">
            Welcome to AURA
          </h2>

          <p className="text-body text-neutral-600 max-w-sm mx-auto">
            Enjoy <strong className="text-neutral-950">10% OFF</strong> your first handwoven saree or ethnic apparel piece.
          </p>
        </div>

        {copied ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white mx-auto">
              <Check className="h-5 w-5" />
            </div>
            <p className="text-body-sm font-bold text-emerald-950">Coupon Applied Successfully!</p>
            <p className="text-caption text-emerald-700">Code <strong className="uppercase">WELCOME10</strong> is active in your shopping bag.</p>
          </div>
        ) : (
          <form onSubmit={handleClaimOffer} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="guest-email" className="sr-only">Email Address</label>
              <input
                id="guest-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone number..."
                className="input text-body-sm py-3 min-h-[48px] rounded-xl text-center"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-body-sm font-bold uppercase tracking-wider py-3.5 min-h-[48px] rounded-xl bg-[#E60012] hover:bg-red-700 text-white flex items-center justify-center gap-2"
            >
              <span>Unlock 10% Discount</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full text-caption text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              No thanks, I will pay full price
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
