# Product Requirements Document

## Product and goal

Sinpak Su is a mobile-first guest-ordering website for damacana water, bottled water, and beverages in İzmit district. The MVP lets customers create an ASAP delivery order and choose `CASH_ON_DELIVERY`, `POS`, or `BANK_TRANSFER` as the collection method. No online payment provider is integrated.

Administrators manage products and orders after authentication is introduced. The dashboard is sufficient for staff awareness of new orders; automated SMS, email, and WhatsApp notifications are not MVP requirements.

## MVP customer journey

### Home, catalog, and product detail

The home page links to the catalog. Only active products are shown. Product detail presents name, description, current price, product type, and an optional primary image. A gallery is not required.

### Cart

Guest cart contents persist on the device across refreshes. The cart stores product quantities only; it does not store or determine authoritative prices, deposit, delivery fee, or total. Stock availability is not tracked in MVP.

### Checkout and delivery

Checkout requires customer name, a phone number, and a free-form/open delivery address in İzmit district. Turkish phone numbers are accepted in common user-entered forms and normalized server-side. Delivery notes are optional and capped at a maximum length of 500 characters. There is no delivery fee, minimum order, zone selection, or customer-selectable time slot; delivery is ASAP.

Orders may be submitted only between 09:00 and 19:00 in the business time zone (`Europe/Istanbul`). Orders submitted before 09:00 or at/after 19:00 are rejected. Server-side validation of operating hours is authoritative; client UI checks are for user guidance only.

For each damacana item, checkout accepts an empty-damacana quantity from zero through the ordered quantity. The server uses the current product data to calculate the line:

```text
lineTotal = (quantity × base price) + ((quantity - empty damacana quantity) × deposit amount)
```

The current damacana product has a 50 TL base price and 50 TL per-missing-empty deposit. Thus three damacanas with two empty damacanas cost `2 × 50 TL + 1 × 100 TL = 200 TL`. Beverage products use their normal fixed product price and have no deposit.

Browser validation is for UX only. The server validates all values, reloads product data, calculates the authoritative totals, and snapshots the result. Repeated submission is prevented with a server-enforced idempotency key. Failed checkout retains the cart and entered form data for correction/retry.

### Confirmation and cancellation

The confirmation page uses a high-entropy opaque public reference and shows only the minimal immutable order summary. It never exposes the customer phone number, delivery address, or other unnecessary personal data. It uses no OTP, phone verification, signed/expiring token, or token persistence in MVP.

Customers cannot self-cancel. Staff may cancel `PENDING`, `CONFIRMED`, or `PREPARING` orders; no post-dispatch customer cancellation exists in MVP. Failed, refused, and partial delivery workflows are not MVP functionality.

## Order lifecycle

```text
PENDING -> CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED
PENDING -> CANCELLED
CONFIRMED -> CANCELLED
PREPARING -> CANCELLED
```

There are no skipped transitions or reversals. Handling of post-dispatch failed/refused/partial delivery remains an operational decision.

## Admin requirements

One authenticated `ADMIN` role is sufficient. Admins can create, edit, price, activate/deactivate, and manage the primary image of products; they can view orders and perform valid status transitions. Stock management, granular permissions, and inventory/bottle-return ledgers are out of scope.

## Non-goals

- Online payment providers, webhooks, and payment transaction tracking
- Customer accounts, saved addresses, and self-service cancellation
- Product gallery
- Stock/inventory tracking, stock adjustments, inventory movements, bottle balances, and return ledgers
- Delivery zones, delivery fees, minimum orders, and delivery-slot selection
- WhatsApp ordering/integration and automated customer/admin notifications
- Multi-location business profiles and unapproved local-business structured data
- Invoice, tax, accounting, and KVKK/retention workflows until their business/legal requirements are confirmed
- Coupons, loyalty, marketplace features, advanced analytics, and native mobile apps

## SEO requirements

Home and active product pages need accurate metadata. Cart, checkout, confirmation, and admin pages must not be indexed. Local-business structured data is added only from business-approved identity and location values.

## Invoice and accounting

Sinpak Su issues invoices, but the invoice type/workflow, tax treatment, rounding, customer tax/identity data, invoice numbering, generation timing, file requirements, and accounting integration are not yet defined. Customer-facing 50 TL and 100 TL damacana prices must not be reinterpreted as tax-exclusive without an explicit business/accounting decision.
