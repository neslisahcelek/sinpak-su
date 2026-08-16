# Architecture Decision Records

## ADR-001: Modular monolith

Status: Accepted.

One Next.js deployment and one PostgreSQL database are sufficient for the MVP.

## ADR-002: Server-authoritative calculated pricing

Status: Accepted.

The server reloads active products and calculates base prices, damacana deposits, subtotal, zero delivery fee, and total. Client-submitted pricing values are never authoritative.

## ADR-003: PostgreSQL and Prisma

Status: Accepted.

Prisma is the application data-access layer over PostgreSQL. Domain schema changes require Prisma migrations, which are not created in this planning phase.

## ADR-004: Immutable order-item pricing and deposit snapshots

Status: Accepted.

Each item preserves product name/type, base unit price, empty-bottle quantity, applied deposit unit amount, deposit total, and line total. Later product-price or deposit changes cannot alter historical orders.

## ADR-005: Guest checkout with idempotency

Status: Accepted.

Customers do not need accounts. A unique checkout idempotency key prevents duplicate order creation from retries and repeat submissions.

## ADR-006: No inventory or stock tracking

Status: Accepted.

The MVP has no product stock field, stock validation, reservation, decrement/restoration flow, stock-management UI, or inventory/bottle-return ledger.

## ADR-007: Product types and damacana deposit calculation

Status: Accepted.

MVP products are `DAMACANA_WATER`, `BOTTLED_WATER`, or `BEVERAGE`. Only damacana products carry a deposit. Each missing empty damacana adds the current per-unit deposit to the base product price. The current damacana base price and deposit are both 50 TL, maintained as product data.

## ADR-008: Delivery policy

Status: Accepted.

Service is limited to İzmit district. There are no delivery zones, delivery fee, minimum order, or selectable delivery slot. Delivery is ASAP. Checkout requires a free-form address and phone; notes are optional and length-limited.

## ADR-009: Payment methods without online integration

Status: Accepted.

Orders may use `CASH_ON_DELIVERY`, `POS`, or `BANK_TRANSFER`. No online payment provider, webhook, or payment-transaction model is part of MVP.

## ADR-010: Staff-only pre-dispatch cancellation

Status: Accepted.

Customers cannot self-cancel. Staff may cancel `PENDING`, `CONFIRMED`, or `PREPARING` orders. There is no post-dispatch customer cancellation and no inventory restoration behavior.

## ADR-011: Admin and notifications

Status: Accepted.

One `ADMIN` role is sufficient. Admins manage products and orders, not stock. The dashboard is the MVP notification surface; SMS, email, and WhatsApp automation are deferred.

## ADR-012: Local-business data and WhatsApp are deferred

Status: Accepted.

Do not invent structured-data identity/location values or create multi-location models. WhatsApp ordering/integration and related database structures are deferred pending a later business and provider-cost decision.
