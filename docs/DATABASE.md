# Database Design

## Current state

Prisma is configured for PostgreSQL but has no domain models or migration. This document defines the approved MVP data model; it is not a Prisma schema or migration.

Store all money as PostgreSQL `Decimal(12,2)` through Prisma `Decimal`, never floating-point values. Prices and deposit amounts are current product data; every calculated historical value is copied to the order snapshot.

## Enums

```text
ProductType: DAMACANA_WATER | BOTTLED_WATER | BEVERAGE
OrderStatus: PENDING | CONFIRMED | PREPARING | OUT_FOR_DELIVERY | DELIVERED | CANCELLED
PaymentMethod: CASH_ON_DELIVERY | POS | BANK_TRANSFER
```

`POS` and `BANK_TRANSFER` record the selected collection method only. No payment provider or payment transaction model exists in MVP.

## Product

| Field                    | Notes                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `id`                     | CUID/UUID primary key.                                                                                                        |
| `slug`                   | Required, unique immutable public identifier.                                                                                 |
| `type`                   | Required `ProductType`; determines whether damacana deposit rules apply.                                                      |
| `name`, `description`    | Customer-facing catalog content.                                                                                              |
| `price`                  | Required current non-negative base unit price. The initial damacana product is configured as 50 TL, not hard-coded in schema. |
| `depositAmount`          | Required non-negative current per-unit deposit; zero for bottled water/beverages and 50 TL for the current damacana offering. |
| `isActive`               | Required boolean; inactive products are not publicly listed or orderable.                                                     |
| `imageUrl`               | Optional single primary image URL.                                                                                            |
| `createdAt`, `updatedAt` | Timestamps.                                                                                                                   |

Indexes: unique `slug`; composite `(isActive, name)` for the public catalog. There is no `stock` field, inventory table, or stock-management index in MVP.

Products referenced by orders must be deactivated rather than hard-deleted. Application validation enforces `depositAmount = 0` and `emptyBottleQuantity = 0` for non-damacana products.

## Order

| Field                                                  | Notes                                                                                          |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `id`                                                   | Internal primary key.                                                                          |
| `publicId`                                             | Unique high-entropy identifier for a confirmation URL; it grants only a minimal, non-PII view. |
| `idempotencyKey`                                       | Unique checkout-attempt UUID.                                                                  |
| `status`                                               | Required `OrderStatus`; initially `PENDING`.                                                   |
| `paymentMethod`                                        | Required `PaymentMethod`.                                                                      |
| `customerName`, `phone`                                | Required contact snapshots; exact phone normalization policy remains open.                     |
| `addressLine1`                                         | Required free-form delivery address in İzmit district.                                         |
| `deliveryNotes`                                        | Optional length-limited text.                                                                  |
| `subtotal`                                             | Sum of historical `OrderItem.lineTotal` values.                                                |
| `deliveryFee`                                          | Historical snapshot, always 0 TL in MVP.                                                       |
| `total`                                                | `subtotal + deliveryFee`.                                                                      |
| `createdAt`, `updatedAt`, `cancelledAt`, `deliveredAt` | Timestamps; terminal-action timestamps may be null.                                            |

Relationships: one `Order` has many `OrderItem` records. Indexes: unique `publicId`, unique `idempotencyKey`, and `(status, createdAt)` for the admin queue. A `(phone, createdAt)` index is deferred until operational search needs justify it.

No OTP, phone-verification, signed/expiring confirmation-token, or verification-attempt field/model is justified for MVP. Invoice/tax/accounting and privacy/retention requirements remain unresolved; do not add invoice, consent, deletion, or anonymization fields until their business/legal requirements are confirmed.

## OrderItem

| Field                        | Notes                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `id`, `orderId`, `productId` | Primary and restrictive foreign keys.                                              |
| `productName`                | Immutable product-name snapshot.                                                   |
| `productType`                | Immutable type snapshot for correct historical interpretation.                     |
| `quantity`                   | Required positive integer.                                                         |
| `baseUnitPrice`              | Immutable current product price at creation.                                       |
| `emptyBottleQuantity`        | Integer from 0 through `quantity`; zero for non-damacana items.                    |
| `depositUnitAmount`          | Immutable applied per-missing-empty-damacana deposit; zero for non-damacana items. |
| `depositTotal`               | Immutable `(quantity - emptyBottleQuantity) × depositUnitAmount`.                  |
| `lineTotal`                  | Immutable `(quantity × baseUnitPrice) + depositTotal`.                             |

Unique `(orderId, productId)` follows aggregation of duplicate checkout items. The implementation migration should include database `CHECK` constraints for non-negative monetary values, positive quantity, and `0 <= emptyBottleQuantity <= quantity` where feasible.

## Invariants

- Only active products can be ordered; stock is not checked or tracked.
- The server reads current product data and computes all base-price, deposit, subtotal, delivery-fee, and total snapshots.
- Non-damacana products receive no empty-bottle/deposit values.
- Empty-bottle quantities may be lower than damacana quantities.
- `subtotal = Σ lineTotal`; `deliveryFee = 0`; `total = subtotal` for MVP.
- A unique idempotency key creates at most one order; mismatched retries are rejected.
- Order and item snapshots are never mutated after creation.
- Staff cancellation changes status only; it has no inventory side effect.

## Deferred models

Do not add `InventoryMovement`, stock fields, bottle/customer-balance models, return ledgers, `ProductImage`, `DeliveryZone`, customer accounts, online-payment models, WhatsApp structures, notification outbox, multi-location business profiles, granular-role models, or speculative invoice/consent/deletion models in MVP.
