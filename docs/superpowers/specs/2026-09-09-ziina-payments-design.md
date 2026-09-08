# Ziina payment integration

## Context

The storefront currently only supports Cash on Delivery. Checkout writes
orders directly to Supabase from the browser using the anon key
(`frontend/src/lib/api.ts`) — there is no live backend in the deploy path
today, even though `backend/` (an Express API backed by the same Supabase
project) already exists and implements most of the same routes.

Ziina requires a secret API key to create payment intents. That key must
never reach the browser bundle, so it needs a real server. Decision: bring
`backend/` into the deploy path (hosted on the user's own VPS) and make it
the system of record for orders and payments. PayPal was considered and
dropped — PayPal does not support settling in AED, and the store is AED-only
end to end, so adding it now means inventing a currency conversion the user
didn't ask for.

## Goals

- Checkout offers Cash on Delivery (unchanged) and Ziina.
- Paying with Ziina redirects to Ziina's hosted checkout and returns the
  customer to a confirmation page that reflects the real payment status.
- Adding this requires no code changes from the user beyond pasting API
  keys into `backend/.env` and pointing `VITE_API_URL` at the deployed
  backend.

## Non-goals

- PayPal (dropped, see Context).
- Webhook-based confirmation. Ziina's webhook signature scheme isn't
  something to guess at without their docs in hand — shipping unverified
  signature-checking code would be worse than not having it. Confirmation
  instead happens by the backend asking Ziina directly for the payment
  intent's status when the customer returns from checkout. This is correct,
  just slightly slower than a webhook. A webhook can be added later as a
  `ponytail:`-flagged follow-up once the exact signing scheme is confirmed
  against Ziina's current docs.
- Migrating product/admin reads off direct-Supabase — unrelated to payments,
  left as-is.

## Architecture

```
Browser --submit order--> Backend (Express, VPS)
                              |
                              |--createOrder--> Supabase (orders table)
                              |
Browser --pay w/ Ziina------> Backend: POST /api/payments/ziina/create
                              |--create payment intent--> Ziina API
                              |<--redirect_url-------------|
Browser <--redirect_url------|
Browser --(redirected)------> Ziina hosted checkout
Ziina --redirect back-------> Browser: /checkout/success?order=<id>
Browser --verify------------> Backend: GET /api/payments/ziina/status/:orderId
                              |--get payment intent--> Ziina API (source of truth)
                              |--update order------> Supabase
                              |<--updated order-----|
Browser <--paid/failed-------|
```

## Data model

New columns on `public.orders` (migration
`supabase/migrations/20260909000000_order_payments.sql`):

- `payment_provider text not null default 'cod' check (payment_provider in ('cod', 'ziina'))`
- `payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'failed'))`
- `payment_reference text` — Ziina's payment intent id, null for COD.

Existing `payment_method` text column is kept as-is (human-readable label,
e.g. "Cash on Delivery" / "Ziina") for display; the new `payment_provider`
is the machine-readable key the payment endpoints key off of.

## Backend changes (`backend/`)

- `src/payments/ziina.ts` — thin client: `createPaymentIntent(order)` and
  `getPaymentIntent(intentId)`, using `ZIINA_API_KEY` (Bearer auth) and
  `ZIINA_TEST_MODE` (sets `test: true` on the create-intent request body).
  Throws a clear error if `ZIINA_API_KEY` is unset, same pattern as
  `supabase.ts`'s missing-env-var check.
- `repository.ts` — `createOrder` accepts `paymentProvider`, defaults
  `payment_status` to `'unpaid'`; add `updateOrderPayment(orderId, {status, paymentStatus, paymentReference})`.
- `routes.ts` — add to `publicRouter`:
  - `POST /api/payments/ziina/create` — body `{ orderId }`. Loads the order,
    calls `createPaymentIntent`, stores `payment_reference` = intent id,
    returns `{ redirectUrl }`. 400 if the order's `payment_provider` isn't
    `ziina`, or it's already `paid`.
  - `GET /api/payments/ziina/status/:orderId` — loads the order, calls
    `getPaymentIntent(order.payment_reference)`, maps Ziina's status to
    `paid`/`failed`/`unpaid`, persists it, sets order `status` to
    `processing` when paid, returns the updated order. Idempotent — safe to
    call repeatedly (success page will poll briefly if still pending).
- `.env.example` — add `ZIINA_API_KEY`, `ZIINA_TEST_MODE`.

## Frontend changes (`frontend/`)

- `src/lib/api.ts` — `createOrder` now posts to
  `${VITE_API_URL}/api/orders` instead of inserting into Supabase directly.
  Add `createZiinaPayment(orderId)` and `getZiinaPaymentStatus(orderId)`
  calling the new backend routes.
- `.env.example` — add `VITE_API_URL`.
- `CheckoutPage.tsx` — add a Ziina radio option next to Cash on Delivery.
  On submit: create the order as today; if Ziina is selected, call
  `createZiinaPayment` and `window.location.href = redirectUrl` instead of
  showing the existing "Order Placed" panel. Payment failures (network,
  Ziina API error) show the existing inline error banner and leave the
  order in place so the customer can retry rather than double-submitting.
- New route `/checkout/success` (`CheckoutSuccessPage.tsx`) — reads
  `?order=` from the query string, calls `getZiinaPaymentStatus`, polls up
  to a few times at short intervals if the status is still `unpaid` (Ziina's
  redirect can arrive slightly before the intent finalizes), then renders a
  paid/failed confirmation reusing the existing "Order Placed" style panel.

## Error handling

- Missing/invalid `ZIINA_API_KEY` on the backend: the create-intent route
  returns a 500 with a clear message; never silently falls back to COD.
- Ziina API errors while creating the intent: surfaced to the customer as
  the existing checkout error banner; the order stays `pending`/`unpaid` and
  the customer can retry Ziina or the request can be resubmitted.
- Status check finds `failed`: success page shows a "payment failed, your
  order wasn't charged" message with a link back to checkout/cart; order
  stays `unpaid`.

## Testing

- Backend: a `src/payments/ziina.test-manual.md` note (or a small script)
  is out of scope for automated tests given no test harness exists in
  `backend/` today; instead, the status-mapping function (Ziina status ->
  our `payment_status`) is a pure function and gets one focused unit-style
  check via a `demo()`/assert block per the project's lightweight-check
  convention, since it's the one piece of real branching logic.
- Manual smoke test (documented in `backend/README.md`): place a COD order
  (unchanged path), then a Ziina order in test mode end-to-end against
  Ziina's sandbox.

## Rollout

`backend/README.md` gets a "Payments" section: create a Ziina account, copy
the API key into `backend/.env`, set `ZIINA_TEST_MODE=true` while testing,
deploy to the VPS (pm2/systemd + reverse proxy, not scaffolded by this
change — separate ask if wanted), set `VITE_API_URL` in the frontend's
deploy env to point at it.
