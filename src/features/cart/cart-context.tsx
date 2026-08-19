'use client';

import { createContext, useContext } from 'react';
import type { ProductDto } from '@/server/services/product.service';

/**
 * Minimal shape persisted to localStorage.
 * Per architecture: cart stores only { productId, quantity } + schema version.
 * emptyBottleQuantity is included here for Phase 3 cart display; it will be
 * migrated to checkout form state in Phase 4 when the checkout is built.
 */
export type StorageCartItem = {
  productId: string;
  quantity: number;
  /** Only applicable to DAMACANA_WATER products. */
  emptyBottleQuantity: number;
};

export type CartContextType = {
  /** Raw storage items — productId + quantity only (no price). */
  items: StorageCartItem[];
  /**
   * Server-fetched product catalog, refreshed on every page load.
   * Used for display (name, price) without persisting prices to localStorage.
   */
  products: ProductDto[];
  addToCart: (productId: string, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  updateEmptyBottles: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
