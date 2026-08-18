# Open Business Decisions

Resolved decisions are retained here as scope records. Remaining questions are genuinely open and non-blocking until their affected feature or policy is implemented.

## RESOLVED: Delivery and Customer Input

- Service area is **İzmit district**; delivery zones are not required.
- Delivery fee is **0 TL**.
- There is no minimum order amount or quantity.
- Delivery is **ASAP**; there are no customer-selectable delivery slots.
- Order submission hours are **09:00 to 19:00** in the **Europe/Istanbul** business time zone. Orders submitted before 09:00 or at/after 19:00 are rejected. Server-side validation is authoritative.
- Checkout requires customer name, free-form address text, and a phone number.
- Turkish phone numbers are accepted in common user-entered forms and normalized server-side to a consistent format.
- Delivery notes are optional and capped at a maximum length of **500 characters**.
- Inventory is not tracked, so cancellation/failure never causes a stock return.

## RESOLVED: Catalog, pricing, damacana, and deposit

- MVP sells damacana water, bottled water, and beverages.
- Beverage prices are normal fixed product prices.
- Products have one optional primary image; a gallery is not required.
- Inventory/stock, inventory movements, bottle balances, and bottle-return ledgers are out of scope.
- Damacana base price is 50 TL and its per-missing-empty deposit is 50 TL as current product data.
- Checkout collects an empty-bottle quantity per damacana line; it may be lower than the ordered quantity.
- The server calculates all price, deposit, delivery-fee, subtotal, and total values and snapshots them at order creation.

## RESOLVED: Payments, cancellation, notifications, and administration

- MVP payment methods are `CASH_ON_DELIVERY`, `POS`, and `BANK_TRANSFER`; no online provider is integrated.
- Customers cannot self-cancel. Staff can cancel eligible pre-dispatch orders only.
- The confirmation page is sufficient; no automated SMS, email, or WhatsApp notifications are required.
- One `ADMIN` role is sufficient; there is no granular permission or stock-management system.
- WhatsApp ordering/integration is **deferred**. Do not add WhatsApp-specific database structures in MVP.

## RESOLVED: SEO scope

- Local-business structured data must use only identity/location details explicitly approved by the business.
- Advanced multi-location business-profile modeling is out of scope.

## OPEN: Delivery operations

1. How should staff record a failed, refused, or partially completed post-dispatch delivery? This must be decided before adding an operational exception status.

## OPEN: Customer confirmation and privacy

1. What minimal information may a guest revisit on an order-confirmation URL, and does it require a signed/expiring link or phone/reference verification?

## OPEN: Pricing, tax, and catalog detail

1. What tax display, rounding, and invoice requirements apply to TL prices?
2. Which additional product attributes, if any, are required at launch (volume, brand, package count, returnable-container label)?

## OPEN: Compliance and public identity

1. What personal-data retention, deletion/anonymization, consent, and privacy-notice requirements apply?
2. Which exact approved business name, address, phone, hours, logo, and service-area details may be published in local-business SEO and structured data?
