'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import type { ProductDto } from '@/server/services/product.service';
import { CartContext, type StorageCartItem } from './cart-context';

interface CartProviderProps {
  children: ReactNode;
  /** Active product catalog fetched server-side; used for display only. */
  products: ProductDto[];
}

const STORAGE_KEY = 'sinpak-cart-v1';

function loadCartFromStorage(): StorageCartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'version' in parsed &&
      (parsed as { version: unknown }).version === 1 &&
      'items' in parsed &&
      Array.isArray((parsed as { items: unknown }).items)
    ) {
      return (parsed as { version: number; items: StorageCartItem[] }).items;
    }
  } catch {
    // Corrupted — start fresh
  }
  return [];
}

export function CartProvider({ children, products }: CartProviderProps) {
  /**
   * Initialise with an empty array so server render and first client render
   * always produce identical HTML (avoids React hydration mismatch).
   * The useEffect below hydrates from localStorage after mount.
   */
  const [items, setItems] = useState<StorageCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hydrated = useRef(false);

  // Hydrate from localStorage once after mount (client-only).
  useEffect(() => {
    // Reading from an external system (localStorage) is the documented use
    // case for useEffect + setState; this does NOT derive state from other
    // React state, so the cascading-renders concern does not apply here.
    if (!hydrated.current) {
      hydrated.current = true;
      const saved = loadCartFromStorage();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved.length > 0) setItems(saved);
    }
  }, []);

  // Persist after every change, but skip the very first render
  // (when items is still the initial [] before hydration).
  const isFirstPersist = useRef(true);
  useEffect(() => {
    if (isFirstPersist.current) {
      isFirstPersist.current = false;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, items }));
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = (productId: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { productId, quantity: qty, emptyBottleQuantity: 0 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: qty,
              emptyBottleQuantity: Math.min(i.emptyBottleQuantity, qty),
            }
          : i
      )
    );
  };

  const updateEmptyBottles = (productId: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId !== productId) return i;
        return {
          ...i,
          emptyBottleQuantity: Math.max(0, Math.min(qty, i.quantity)),
        };
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        products,
        addToCart,
        updateQuantity,
        updateEmptyBottles,
        removeFromCart,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
