# Architecture

## Scope and principles

Sinpak Su is a modular monolith: one Next.js deployment and one PostgreSQL database. The MVP serves İzmit district, accepts guest orders for bottled/damacana water and beverages, and creates an order without online payment processing.

- The browser is never authoritative for product price, deposit, delivery fee, total, order status, or permissions.
- Domain logic lives in server-only services, not React components, Server Actions, or Route Handlers.
- Products are deactivated rather than hard-deleted after being ordered.
- Inventory/stock tracking, inventory movements, bottle balances, and bottle-return ledgers are out of scope for MVP.

## Customer journey

1. **Home** presents the service in İzmit and links to the catalog.
2. **Catalog and product detail** show active bottled-water, damacana-water, and beverage products with their current product data and optional primary image.
3. **Cart** persists only product IDs and quantities locally; it never stores authoritative pricing.
4. **Checkout** is guest-only and collects a required phone number, required free-form delivery address, optional length-limited delivery notes, and an empty-damacana quantity for each damacana line.
5. **Order creation** validates input, reloads active products, calculates base prices and damacana deposits on the server, creates a `PENDING` order with an idempotency key, and records the selected collection method.
6. **Confirmation** uses a high-entropy opaque `publicId` and shows the committed order's minimal immutable pricing snapshot. It never shows the customer phone or delivery address. The admin dashboard is the MVP notification mechanism.

Delivery is ASAP: there are no delivery zones, fees, minimums, stock reservations, or customer-selectable delivery slots. Failed checkout leaves the local cart and entered values available for correction/retry. Repeated submission with the same idempotency key returns the existing order.

## Damacana pricing rule

For a damacana product, the current product price is the base unit price. Its current per-unit deposit applies only to units for which the customer does not provide an empty damacana.

```text
missingEmptyQuantity = quantity - emptyBottleQuantity
lineTotal = (quantity × baseUnitPrice) + (missingEmptyQuantity × depositUnitPrice)
```

For example, a 50 TL damacana with a 50 TL deposit, quantity 3, and `emptyBottleQuantity` 2 costs `(3 × 50) + (1 × 50) = 200 TL`. Beverage products have their normal fixed product price and cannot receive an empty-bottle quantity or deposit.

## Modules and rendering

```text
src/app/                 Routes, layouts, metadata, sitemap, and thin action adapters
src/features/products/   Catalog queries and product presentation
src/features/cart/       Client cart persistence and UI
src/features/checkout/   Checkout form and client-only form state
src/features/orders/     Server-only order creation and order queries
src/features/admin/      Future protected product/order management UI
src/components/          Shared presentational components
src/lib/                 Framework-neutral utilities
src/server/db/           Prisma client and database-only helpers
src/server/services/     Server-only domain services
```

Use Server Components by default. Client Components are limited to cart controls and checkout interaction. The local cart stores `{ productId, quantity }` and a schema version; checkout form state additionally holds empty-damacana quantities. It stores no price, delivery fee, deposit, or total.

## Server/API boundary

First-party mutations use Server Actions as thin adapters over server-only services. Product/order reads use Server Components. Route Handlers are deferred until an external integration has a real HTTP need; online-payment providers, WhatsApp integration, and automated notifications are not MVP requirements. Confirmation access uses `publicId` alone: OTP, phone verification, and signed/expiring token flows are out of scope.

The create-order service validates input, verifies products are active, enforces that empty-bottle quantity is an integer from zero through the damacana line quantity, computes all snapshots, and persists the order atomically. There is no stock check, decrement, reservation, or restoration.

## Admin boundary

The future admin area requires server-side authentication and one `ADMIN` role. Admins can manage products, current prices, active state, one primary image, orders, and valid order-status transitions. Stock management and granular permissions are out of scope.

## Order lifecycle and payments

```text
PENDING -> CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED
PENDING -> CANCELLED
CONFIRMED -> CANCELLED
PREPARING -> CANCELLED
```

Customers cannot self-cancel. Staff may cancel only eligible pre-dispatch orders. There are no post-dispatch customer cancellations or status reversals.

The permitted MVP payment/collection methods are `CASH_ON_DELIVERY`, `POS`, and `BANK_TRANSFER`. They are recorded on the order only; no provider integration, provider transaction, webhook, or payment notification infrastructure is included.

## SEO and operations

Public pages need accurate metadata, canonical URLs, Open Graph metadata, sitemap entries, and robots rules that exclude cart, checkout, confirmation, and admin pages. Do not publish local-business structured data until the business explicitly approves each identity and location value. Advanced multi-location modeling is out of scope.

No automated SMS, email, or WhatsApp notifications are included. Future notification delivery must be non-critical to a committed order. Invoice/tax/accounting and KVKK/retention requirements are deferred pending explicit business, accounting, and legal decisions; no speculative persistence is introduced.
