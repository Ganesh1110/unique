'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { Cart, CartCreateInput } from '@/types/shopify';
import { createCart, fetchCart, addToCart as addToCartApi, updateCartLine as updateCartLineApi, removeFromCart as removeFromCartApi, updateCartNote as updateCartNoteApi } from '@/lib/cart-api';

const CART_ID_KEY = 'sss_cart_id';
const COUPON_KEY = 'aura_coupon_code';

export interface CouponResult {
  success: boolean;
  message: string;
  code?: string;
  discountPercent?: number;
  discountFixed?: number;
}

const VALID_COUPONS: Record<string, { type: 'percent' | 'fixed'; value: number; label: string }> = {
  AURA10: { type: 'percent', value: 10, label: '10% OFF Welcome Discount' },
  FESTIVE15: { type: 'percent', value: 15, label: '15% OFF Festive Special' },
  HERITAGE20: { type: 'percent', value: 20, label: '20% OFF Saree Heritage Edit' },
  WELCOME500: { type: 'fixed', value: 500, label: '₹500 Instant Discount' },
};

interface CartContextType {
  cart: Cart | null;
  isCartOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (merchandiseId: string, quantity: number, attributes?: Array<{ key: string; value: string }>) => Promise<void>;
  updateQuantity: (lineId: string, merchandiseId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  updateNote: (note: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  totalQuantity: number;
  subtotal: number;
  currencyCode: string;
  // Coupon additions
  appliedCoupon: string | null;
  couponLabel: string | null;
  discountAmount: number;
  finalTotal: number;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Initialize cart and coupon on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem(COUPON_KEY);
    if (savedCoupon && VALID_COUPONS[savedCoupon.toUpperCase()]) {
      setAppliedCoupon(savedCoupon.toUpperCase());
    }

    const initCart = async () => {
      let cartId = localStorage.getItem(CART_ID_KEY);
      
      if (cartId) {
        try {
          const existingCart = await fetchCart(cartId);
          if (existingCart) {
            setCart(existingCart);
            setInitialized(true);
            return;
          }
        } catch {
          localStorage.removeItem(CART_ID_KEY);
        }
      }

      try {
        const newCart = await createCart();
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCart(newCart);
      } catch (err) {
        console.error('Failed to create cart:', err);
        setError('Failed to initialize shopping bag');
      } finally {
        setInitialized(true);
      }
    };

    initCart();
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (cartId) {
      try {
        const updatedCart = await fetchCart(cartId);
        if (updatedCart) setCart(updatedCart);
      } catch (err) {
        console.error('Failed to refresh cart:', err);
      }
    }
  }, []);

  const addToCart = useCallback(
    async (merchandiseId: string, quantity: number, attributes?: Array<{ key: string; value: string }>) => {
      setIsLoading(true);
      setError(null);
      try {
        let cartId = localStorage.getItem(CART_ID_KEY);
        if (!cartId) {
          const newCart = await createCart();
          cartId = newCart.id;
          localStorage.setItem(CART_ID_KEY, cartId);
        }

        const updatedCart = await addToCartApi(cartId, [{ merchandiseId, quantity, attributes }]);
        setCart(updatedCart);
        setIsCartOpen(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add item to bag';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (lineId: string, merchandiseId: string, quantity: number) => {
      const cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) return;

      setIsLoading(true);
      setError(null);
      try {
        const updatedCart = await updateCartLineApi(cartId, [{ id: lineId, merchandiseId, quantity }]);
        setCart(updatedCart);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update item quantity';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      const cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) return;

      setIsLoading(true);
      setError(null);
      try {
        const updatedCart = await removeFromCartApi(cartId, [lineId]);
        setCart(updatedCart);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove item';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateNote = useCallback(
    async (note: string) => {
      const cartId = localStorage.getItem(CART_ID_KEY);
      if (!cartId) return;

      setIsLoading(true);
      setError(null);
      try {
        const updatedCart = await updateCartNoteApi(cartId, note);
        setCart(updatedCart);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update note';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const applyCoupon = useCallback((code: string): CouponResult => {
    const cleanCode = code.trim().toUpperCase();
    const couponDef = VALID_COUPONS[cleanCode];

    if (!couponDef) {
      return { success: false, message: 'Invalid promo code. Try AURA10, FESTIVE15, or HERITAGE20' };
    }

    setAppliedCoupon(cleanCode);
    localStorage.setItem(COUPON_KEY, cleanCode);
    return {
      success: true,
      message: `Applied "${cleanCode}" — ${couponDef.label}`,
      code: cleanCode,
      discountPercent: couponDef.type === 'percent' ? couponDef.value : undefined,
      discountFixed: couponDef.type === 'fixed' ? couponDef.value : undefined,
    };
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    localStorage.removeItem(COUPON_KEY);
  }, []);

  const totalQuantity = cart?.totalQuantity || 0;
  const subtotal = cart?.cost.subtotalAmount.amount || 0;
  const currencyCode = cart?.cost.subtotalAmount.currencyCode || 'INR';

  // Calculate discount amount based on applied coupon
  let discountAmount = 0;
  let couponLabel: string | null = null;

  if (appliedCoupon && VALID_COUPONS[appliedCoupon]) {
    const couponDef = VALID_COUPONS[appliedCoupon];
    couponLabel = couponDef.label;
    if (couponDef.type === 'percent') {
      discountAmount = Math.round((subtotal * couponDef.value) / 100);
    } else {
      discountAmount = Math.min(subtotal, couponDef.value);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const value: CartContextType = {
    cart,
    isCartOpen,
    isLoading,
    error,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeLine,
    updateNote,
    refreshCart,
    totalQuantity,
    subtotal,
    currencyCode,
    appliedCoupon,
    couponLabel,
    discountAmount,
    finalTotal,
    applyCoupon,
    removeCoupon,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}