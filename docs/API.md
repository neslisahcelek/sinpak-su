# Server Contract

## Boundary choice

The MVP uses Server Components for reads and Server Actions for first-party mutations. Actions validate untrusted input, invoke server-only services, and return typed user-safe results. Public Route Handlers are deferred; there are no online payment, WhatsApp, or automated-notification endpoints in MVP.

## Read operations

| Consumer       | Operation                                | Behavior                                                             |
| -------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| Public catalog | `listActiveProducts`                     | Returns active bottled-water, damacana-water, and beverage products. |
| Product detail | `getActiveProductBySlug`                 | Returns one active product or `notFound()`.                          |
| Confirmation   | `getOrderConfirmation(publicId)`         | Returns a minimal non-PII view using the opaque public ID only.      |
| Admin          | `listOrders`, `getOrder`, `listProducts` | Require server-side `ADMIN` authorization.                           |

## Customer mutation: create order

`createOrder(input)` accepts only:

```text
idempotencyKey: UUID
customerName: string
phone: string
addressLine1: string
deliveryNotes?: string
items: [{ productId: string, quantity: positive integer, emptyBottleQuantity?: non-negative integer }]
paymentMethod: CASH_ON_DELIVERY | POS | BANK_TRANSFER
```

`addressLine1` is the required free-form delivery address for İzmit district. Delivery notes are optional and length-limited. An `emptyBottleQuantity` is valid only for a damacana product and must not exceed that item's quantity; it is omitted or zero for beverages.

The action does **not** accept prices, product name, subtotal, deposit, delivery fee, total, stock, discount, status, or administrator fields. The server reloads active products and calculates every order item and order total. MVP sets the delivery fee to 0 TL and does not enforce a minimum order.

For each damacana line:

```text
depositTotal = (quantity - emptyBottleQuantity) × current product deposit amount
lineTotal = (quantity × current product price) + depositTotal
```

For beverages, `depositTotal` is 0 and `lineTotal = quantity × current product price`. The service snapshots the product name, base unit price, applied deposit unit price, empty-bottle quantity, deposit total, and final line total before creating the order.

Expected safe failure codes include `VALIDATION_ERROR`, `PRODUCT_UNAVAILABLE`, `INVALID_EMPTY_BOTTLE_QUANTITY`, `IDEMPOTENCY_CONFLICT`, and `ORDER_CREATION_FAILED`. A repeat of the same idempotency key returns the already-created order; a materially different retry is rejected. There is no stock-related error in MVP.

## Admin mutations

Future protected actions are `createProduct`, `updateProduct`, `setProductActive`, and `transitionOrderStatus`. Product management includes current price, product category/type, deposit amount for damacana products, and an optional primary image. Every action requires server-side `ADMIN` authorization. There is no stock-management action.

## Authorization and errors

Guests can create orders but cannot self-cancel or call admin actions. Confirmation pages must not expose address or phone data to a visitor who only has an order URL. The high-entropy `publicId` is the only MVP confirmation access mechanism; do not add OTP, phone verification, signed/expiring tokens, or verification persistence. Database errors, stack traces, Prisma error codes, and secrets never cross the server boundary.
