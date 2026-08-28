'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Minus, Gift, Truck, CheckCircle2, MapPin, UserCheck, Lock } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { OptimizedImage } from '@/components/ui/Image';
import { formatMoney } from '@/lib/utils';
import { checkoutOrder, type CheckoutOrderSuccess } from '@/lib/cart-api';
import type { CartLine } from '@/types/shopify';

interface CartDrawerProps {
  freeShippingThreshold?: string;
}

export function CartDrawer({ freeShippingThreshold = '₹15,000' }: CartDrawerProps = {}) {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeLine,
    updateNote,
    isLoading,
    appliedCoupon,
    couponLabel,
    discountAmount,
    finalTotal,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<CheckoutOrderSuccess['order'] | null>(null);
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Address details state for guest & logged-in checkout
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [createAccount, setCreateAccount] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  useEffect(() => {
    fetch('/api/auth/customer/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.customer) {
          setCustomer(data.customer);
          if (data.customer.name) setCustomerName(data.customer.name);
          if (data.customer.email) setCustomerEmail(data.customer.email);
        }
      })
      .catch(() => {});
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const lines = cart?.lines.edges.map(({ node }) => node) || [];
  const subtotal = cart?.cost.subtotalAmount.amount || 0;
  const currencyCode = cart?.cost.subtotalAmount.currencyCode || 'USD';
  const total = cart?.cost.totalAmount.amount || 0;
  const note = cart?.note || '';

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(e.target.value);
  };

  const handleCheckout = async () => {
    if (!cart) return;
    setIsCheckingOut(true);
    setCheckoutError(null);
    const result = await checkoutOrder({
      cartId: cart.id,
      customerName,
      customerEmail,
      customerPhone,
      address: {
        addressLine,
        city,
        state,
        pincode,
      },
      createAccount,
    });
    if (result.ok) {
      setConfirmation(result.order);
    } else {
      setCheckoutError(result.error);
    }
    setIsCheckingOut(false);
  };

  const isEmpty = lines.length === 0;

  const handleQuantityChange = (line: CartLine, delta: number) => {
    const newQuantity = line.quantity + delta;
    if (newQuantity > 0) {
      updateQuantity(line.id, line.merchandise.id, newQuantity);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink/50 animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 right-0 bottom-0 z-drawer w-full max-w-md bg-surface border-l border-ink/10 animate-slide-in-right flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-ink/10">
          <div>
            <span className="section-label text-faint block mb-0.5">Your</span>
            <h2 className="font-heading text-heading-lg font-medium tracking-tight text-ink">Shopping Bag</h2>
          </div>
          <button
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center text-ink/50 hover:text-ink transition-colors"
            style={{ borderRadius: 0 }}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>


        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {confirmation ? (
            <div className="flex flex-col h-full min-h-[300px] justify-center text-center" role="status">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-accent" aria-hidden="true" />
              <h3 className="font-heading text-heading-md text-ink mb-2">Order confirmed</h3>
              <p className="text-caption text-faint mb-1">
                {confirmation.orderNumber} · {confirmation.status}
              </p>
              <p className="text-body text-faint mb-6 max-w-xs mx-auto">
                Thank you, {confirmation.name || 'your order is in'}. We&apos;ll reach out on delivery
                confirmation. Pay Cash on Delivery.
              </p>
              <div className="flex justify-between text-body-sm text-ink/80 mb-1">
                <span>Total</span>
                <span className="font-medium text-ink tabular-nums">
                  {formatMoney(confirmation.total, confirmation.currencyCode)}
                </span>
              </div>
              <ul className="text-caption text-faint border-t border-ink/10 mt-4 pt-4 space-y-1" role="list">
                {confirmation.lineItems.map((item) => (
                  <li key={item.title} className="flex justify-between gap-3">
                    <span className="truncate">{item.title} × {item.quantity}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={closeCart} variant="secondary" className="w-full mt-6">
                Keep Shopping
              </Button>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <h3 className="font-heading text-heading-md text-ink mb-2">Your bag is empty</h3>
              <p className="text-body text-faint mb-6 max-w-xs">
                Explore our collections to find a piece worth keeping.
              </p>
              <Button onClick={closeCart} className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Member offer — quiet, left-border accent (NAP style) */}
              {!customer && (
                <div className="mb-6 border-l-2 border-accent pl-4 py-2">
                  <p className="text-body-sm font-medium text-ink mb-0.5">
                    Sign in for member benefits
                  </p>
                  <p className="text-caption text-faint mb-2">
                    10% off, priority concierge & faster checkout.
                  </p>
                  <Link
                    href="/account"
                    onClick={closeCart}
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent hover:text-accent-hover transition-colors"
                  >
                    Sign in &nbsp;&rarr;
                  </Link>
                </div>
              )}


              {/* Cart Items */}
              <ul className="space-y-8" role="list" aria-label="Cart items">
                {lines.map((line) => (
                  <CartItem
                    key={line.id}
                    line={line}
                    currencyCode={currencyCode}
                    onQuantityChange={handleQuantityChange}
                    onRemove={removeLine}
                  />
                ))}
              </ul>

              {/* Shipping Address & Contact Form (Requirement 11 & 12) */}
              <div className="mt-8 pt-6 border-t border-ink/10 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <h3 className="font-heading text-body font-semibold text-ink">Shipping & Client Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm">
                  <div>
                    <label className="label text-[10px]">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="input min-h-[42px] py-2 text-body-sm"
                    />
                  </div>
                  <div>
                    <label className="label text-[10px]">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. priya@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="input min-h-[42px] py-2 text-body-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label text-[10px]">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="input min-h-[42px] py-2 text-body-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label text-[10px]">Delivery Street Address</label>
                    <input
                      type="text"
                      placeholder="Flat, House No., Street, Area"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="input min-h-[42px] py-2 text-body-sm"
                    />
                  </div>
                  <div>
                    <label className="label text-[10px]">City</label>
                    <input
                      type="text"
                      placeholder="Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input min-h-[42px] py-2 text-body-sm"
                    />
                  </div>
                  <div>
                    <label className="label text-[10px]">Pincode / ZIP</label>
                    <input
                      type="text"
                      placeholder="400001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="input min-h-[42px] py-2 text-body-sm"
                    />
                  </div>
                </div>

                {!customer && (
                  <div className="flex items-center gap-2.5 pt-2">
                    <input
                      type="checkbox"
                      id="create-account-checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="h-4 w-4 rounded border-ink/20 text-accent focus:ring-accent/40"
                    />
                    <label htmlFor="create-account-checkbox" className="text-caption font-medium text-ink/80 cursor-pointer">
                      Create an account with these details for faster future orders
                    </label>
                  </div>
                )}
              </div>

              {/* Gift Note */}
              <div className="mt-8 pt-6 border-t border-ink/10">
                <label htmlFor="cart-note" className="flex items-center gap-2 text-body-sm font-medium text-ink/80 mb-3">
                  <Gift className="h-4 w-4 text-ink/40" aria-hidden="true" />
                  Gift note (optional)
                </label>
                <textarea
                  id="cart-note"
                  value={note}
                  onChange={handleNoteChange}
                  rows={3}
                  className="input min-h-[80px] resize-y"
                  placeholder="Add a message for the recipient…"
                  aria-describedby="note-help"
                />
                <p id="note-help" className="mt-1.5 text-caption text-faint">
                  Included on a complimentary card with the order.
                </p>
              </div>

              {/* Free Shipping Progress */}
              <FreeShippingProgress subtotal={subtotal} currencyCode={currencyCode} freeShippingThreshold={freeShippingThreshold} />
            </>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && !confirmation && (
          <div className="border-t border-ink/10 p-4 sm:p-6 space-y-4">
            {/* Promo Code Form */}
            <div className="space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-status-ok-bg border border-status-ok-border p-2.5 text-body-xs">
                  <div className="flex items-center gap-2 text-status-ok-text">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span><strong className="uppercase">{appliedCoupon}</strong> — {couponLabel}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-status-ok-text hover:text-status-danger-text text-caption font-bold transition-colors"
                  >
                    Remove
                  </button>
                </div>

              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (e.g. AURA10)"
                    className="input uppercase text-body-xs min-h-[38px] py-1.5 flex-1"
                  />
                  <button
                    type="submit"
                    className="btn-secondary px-3 text-caption font-bold uppercase tracking-wider min-h-[38px]"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && !appliedCoupon && (
                <p className={`text-caption ${couponMsg.success ? 'text-emerald-600' : 'text-red-600'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            <div className="flex justify-between text-body">
              <span className="text-ink/80">Subtotal</span>
              <span className="font-medium text-ink tabular-nums">
                {formatMoney(subtotal, currencyCode)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-body-sm text-emerald-700 font-semibold">
                <span>Promo Discount ({appliedCoupon})</span>
                <span className="tabular-nums">-{formatMoney(discountAmount, currencyCode)}</span>
              </div>
            )}

            <div className="flex justify-between text-body-sm text-faint">
              <span>Complimentary shipping applied over ₹15,000</span>
            </div>
            <div className="divider" />
            <div className="flex justify-between text-heading-sm font-medium">
              <span className="text-ink">Total</span>
              <span className="text-ink tabular-nums">{formatMoney(finalTotal, currencyCode)}</span>
            </div>

            <Button
              onClick={handleCheckout}
              variant="primary"
              className="w-full"
              size="lg"
              disabled={isLoading || isCheckingOut}
              loading={isLoading || isCheckingOut}
            >
              Proceed to Checkout
            </Button>

            {checkoutError && (
              <Alert variant="error" dismissible onClose={() => setCheckoutError(null)}>
                {checkoutError}
              </Alert>
            )}

            <Button
              onClick={closeCart}
              variant="secondary"
              className="w-full"
            >
              Continue Shopping
            </Button>

            <p className="text-center text-caption text-faint">
              Cash on Delivery at checkout
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

interface CartItemProps {
  line: CartLine;
  currencyCode: string;
  onQuantityChange: (line: CartLine, delta: number) => void;
  onRemove: (lineId: string) => void;
}

function CartItem({ line, currencyCode, onQuantityChange, onRemove }: CartItemProps) {
  const { merchandise, quantity, cost, attributes } = line;
  const { title, selectedOptions, image, price, compareAtPrice } = merchandise;
  const lineTotal = cost.totalAmount.amount;

  const hasGiftWrap = attributes?.some((attr) => attr.key === 'Gift Wrap');

  return (
    <li className="flex gap-4">
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-sunken">
        <OptimizedImage
          src={image?.url}
          alt={image?.altText || title}
          fill
          objectFit="cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-heading text-body font-medium text-ink truncate">
            {title}
          </h3>

          {selectedOptions.length > 0 && (
            <p className="mt-1 text-body-sm text-faint">
              {selectedOptions.map((opt) => opt.value).join(' / ')}
            </p>
          )}

          {hasGiftWrap && (
            <span className="mt-1.5 inline-flex items-center gap-1 text-caption text-faint">
              <Gift className="h-3 w-3" aria-hidden="true" />
              Gift wrapped
            </span>
          )}

          <div className="mt-2 flex items-center gap-3">
            <span className="price tabular-nums">{formatMoney(lineTotal, currencyCode)}</span>
            {compareAtPrice && compareAtPrice.amount > price.amount && (
              <span className="price-compare tabular-nums">
                {formatMoney(compareAtPrice.amount, currencyCode)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-ink/10 mt-3 gap-3">
          <QuantitySelector
            quantity={quantity}
            onChange={onQuantityChange}
            line={line}
          />
          <button
            onClick={() => onRemove(line.id)}
            className="inline-flex min-h-[44px] items-center text-body-sm text-faint hover:text-ink transition-colors"
            aria-label={`Remove ${title}`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

interface QuantitySelectorProps {
  quantity: number;
  onChange: (line: CartLine, delta: number) => void;
  line: CartLine;
}

function QuantitySelector({ quantity, onChange, line }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-ink/20">
      <button
        onClick={() => onChange(line, -1)}
        disabled={quantity <= 1}
        className="inline-flex h-11 w-11 items-center justify-center text-ink/70 hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="px-2 text-body font-medium text-ink tabular-nums w-8 text-center" aria-live="polite">
        {quantity}
      </span>
      <button
        onClick={() => onChange(line, 1)}
        className="inline-flex h-11 w-11 items-center justify-center text-ink/70 hover:text-ink transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function parseThreshold(threshold?: string): number {
  if (!threshold) return 15000;
  const num = parseInt(threshold.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) || num <= 0 ? 15000 : num;
}

interface FreeShippingProgressProps {
  subtotal: number;
  currencyCode: string;
  freeShippingThreshold?: string;
}

/**
 * Minimal free-shipping indicator — ultra-slim bar, no icons, quiet typography.
 * Luxury principle: signal progress without gamified visual weight.
 */
function FreeShippingProgress({ subtotal, currencyCode, freeShippingThreshold = '₹15,000' }: FreeShippingProgressProps) {
  const FREE_SHIPPING_THRESHOLD = parseThreshold(freeShippingThreshold);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <div className="mt-6 pt-5 border-t border-ink/10">
      {/* Slim progress track — h-0.5, not h-1 */}
      <div
        className="h-0.5 bg-ink/10 overflow-hidden mb-3"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Free shipping progress"
      >
        <div
          className="h-full bg-accent transition-all duration-500 ease-expo"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status text — quiet, section-label scale */}
      <p className="section-label text-faint">
        {progress >= 100
          ? 'Complimentary shipping applied'
          : (
            <>
              {formatMoney(remaining, currencyCode)} away from complimentary shipping
            </>
          )}
      </p>
    </div>
  );
}