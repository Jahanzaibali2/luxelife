# Ziina Payment Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let checkout accept Ziina alongside Cash on Delivery, with the backend (`backend/`) as the only place that holds the Ziina secret key, so the user only has to paste keys into `backend/.env` and set `VITE_API_URL` in the frontend for it to work.

**Architecture:** The Express backend becomes the order/payment system of record. Checkout creates the order via the backend (not Supabase directly, as it does today). For Ziina, the backend creates a Ziina payment intent server-side and returns a redirect URL; a new `/checkout/success` page asks the backend to verify the real payment status (which asks Ziina directly) rather than trusting the redirect.

**Tech Stack:** Express + Supabase (`backend/`), React + React Router + react-hook-form/zod (`frontend/`), Ziina REST API v2 (`https://api-v2.ziina.com`).

## Global Constraints

- Never put `ZIINA_API_KEY` in any frontend file, `.env` prefixed `VITE_`, or client bundle — Ziina calls happen only in `backend/`.
- Currency stays AED throughout (per spec, PayPal/USD is explicitly out of scope).
- No new test framework — `backend/` and `frontend/` have none today. Pure-logic functions get a `demo()`-style self-check runnable directly with `tsx`/`node`, not a full test suite.
- Follow existing code patterns: `backend/src/*.ts` uses `NodeNext` ESM (`.js` extensions in relative imports), Supabase row mapping lives in `mappers.ts`, env var access mirrors `supabase.ts`'s missing-var check.
- Ziina's exact field/status names are implemented per their documented v2 API shape but are isolated entirely inside `backend/src/payments/ziina.ts` — if the user's live account returns slightly different field names, only that one file needs a fix.

---

### Task 1: Supabase migration for payment columns

**Files:**
- Create: `supabase/migrations/20260909000000_order_payments.sql`

**Interfaces:**
- Produces: `orders.payment_provider` (`text`, default `'cod'`), `orders.payment_status` (`text`, default `'unpaid'`), `orders.payment_reference` (`text`, nullable) — every later backend task reads/writes these exact column names.

- [ ] **Step 1: Write the migration**

```sql
-- Adds payment tracking columns for online payment providers (Ziina).
alter table public.orders
  add column if not exists payment_provider text not null default 'cod'
    check (payment_provider in ('cod', 'ziina')),
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'failed')),
  add column if not exists payment_reference text;

create index if not exists orders_payment_reference_idx
  on public.orders (payment_reference);
```

- [ ] **Step 2: Apply it**

Run this in the Supabase SQL Editor for the project (same place `backend/README.md` already points to for the initial schema), or via `supabase db push` if the CLI is linked.

Verify: `select payment_provider, payment_status, payment_reference from public.orders limit 1;` returns without error (empty result is fine on a fresh table).

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260909000000_order_payments.sql
git commit -m "feat(db): add payment_provider/payment_status/payment_reference to orders

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Backend types and mapper updates

**Files:**
- Modify: `backend/src/types.ts`
- Modify: `backend/src/mappers.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `Order` now has `paymentProvider: 'cod' | 'ziina'`, `paymentStatus: 'unpaid' | 'paid' | 'failed'`, `paymentReference: string | null`. `mapOrder(row)` reads the new columns. Task 3 (`repository.ts`) and Task 4 (`routes.ts`) rely on these exact field names.

- [ ] **Step 1: Add the new fields to the `Order` type**

In `backend/src/types.ts`, replace the `Order` interface:

```typescript
export type PaymentProvider = 'cod' | 'ziina'
export type PaymentStatus = 'unpaid' | 'paid' | 'failed'

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  customer: {
    email: string
    firstName: string
    lastName: string
    phone: string
    emirate: string
    area: string
    street: string
    apartment?: string
    instructions?: string
  }
  items: OrderItem[]
  subtotal: number
  currency: Currency
  paymentMethod: string
  paymentProvider: PaymentProvider
  paymentStatus: PaymentStatus
  paymentReference: string | null
}
```

- [ ] **Step 2: Update `OrderRow` and `mapOrder` in `mappers.ts`**

In `backend/src/mappers.ts`, update the `OrderRow` type and `mapOrder`:

```typescript
import type { Currency, Order, OrderItem, OrderStatus, PaymentProvider, PaymentStatus, Product } from './types.js'

type OrderRow = {
  id: string
  order_number: string
  status: OrderStatus
  customer: Order['customer']
  items: OrderItem[]
  subtotal: number
  currency: Currency
  payment_method: string
  payment_provider: PaymentProvider
  payment_status: PaymentStatus
  payment_reference: string | null
  created_at: string
  updated_at: string
}
```

```typescript
export function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    customer: row.customer,
    items: row.items,
    subtotal: Number(row.subtotal),
    currency: row.currency,
    paymentMethod: row.payment_method,
    paymentProvider: row.payment_provider,
    paymentStatus: row.payment_status,
    paymentReference: row.payment_reference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
```

- [ ] **Step 3: Type-check**

Run: `cd backend && npx tsc --noEmit`
Expected: fails right now with errors in `repository.ts` (missing `payment_provider` on insert) — that's expected, fixed in Task 3. Confirm the *only* errors are in `repository.ts`.

- [ ] **Step 4: Commit**

```bash
git add backend/src/types.ts backend/src/mappers.ts
git commit -m "feat(backend): add payment fields to Order type and mapper

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Repository support for payment fields

**Files:**
- Modify: `backend/src/repository.ts`

**Interfaces:**
- Consumes: `mapOrder` from Task 2, `PaymentProvider`/`PaymentStatus` types from Task 2.
- Produces: `createOrder(input)` now requires `paymentProvider` in `input` and inserts `payment_provider`/`payment_status: 'unpaid'`/`payment_reference: null`. New `updateOrderPayment(orderId, { paymentStatus, paymentReference, status })` — Task 5's Ziina routes call this exact function.

- [ ] **Step 1: Update `createOrder`**

In `backend/src/repository.ts`, replace `createOrder`:

```typescript
export async function createOrder(input: {
  customer: Order['customer']
  items: Order['items']
  subtotal: number
  currency: Currency
  paymentMethod: string
  paymentProvider: Order['paymentProvider']
}): Promise<Order> {
  const now = new Date().toISOString()
  const orderNumber = `LL-${Date.now().toString().slice(-8)}`

  const { data, error } = await getSupabase()
    .from('orders')
    .insert({
      id: uuidv4(),
      order_number: orderNumber,
      status: 'pending',
      customer: input.customer,
      items: input.items,
      subtotal: input.subtotal,
      currency: input.currency,
      payment_method: input.paymentMethod,
      payment_provider: input.paymentProvider,
      payment_status: 'unpaid',
      payment_reference: null,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapOrder(data)
}
```

- [ ] **Step 2: Add `updateOrderPayment`**

Add this function right after `updateOrderStatus` in `backend/src/repository.ts`:

```typescript
export async function updateOrderPayment(
  id: string,
  updates: { paymentStatus: Order['paymentStatus']; paymentReference?: string; status?: OrderStatus },
): Promise<Order | null> {
  const now = new Date().toISOString()
  const patch: Record<string, unknown> = {
    payment_status: updates.paymentStatus,
    updated_at: now,
  }
  if (updates.paymentReference !== undefined) patch.payment_reference = updates.paymentReference
  if (updates.status !== undefined) patch.status = updates.status

  const { data, error } = await getSupabase()
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return mapOrder(data)
}
```

- [ ] **Step 3: Type-check**

Run: `cd backend && npx tsc --noEmit`
Expected: fails now in `routes.ts` (the `POST /api/orders` handler doesn't pass `paymentProvider` yet) — fixed in Task 4. Confirm no errors remain in `repository.ts` or `mappers.ts`.

- [ ] **Step 4: Commit**

```bash
git add backend/src/repository.ts
git commit -m "feat(backend): support payment fields in order repository

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Ziina API client with a self-checking status mapper

**Files:**
- Create: `backend/src/payments/ziina.ts`
- Modify: `backend/package.json` (add a `test:ziina` script)
- Modify: `backend/.env.example`

**Interfaces:**
- Consumes: `ZIINA_API_KEY`, `ZIINA_TEST_MODE` env vars.
- Produces: `createPaymentIntent(input: { amountAed: number; orderNumber: string; successUrl: string; cancelUrl: string }): Promise<{ id: string; redirectUrl: string }>`, `getPaymentIntent(intentId: string): Promise<{ id: string; status: string }>`, `mapZiinaStatus(status: string): 'unpaid' | 'paid' | 'failed'`. Task 5's routes call all three by these exact names.

- [ ] **Step 1: Write `ziina.ts`**

Create `backend/src/payments/ziina.ts`:

```typescript
const ZIINA_API_BASE = 'https://api-v2.ziina.com/api'

function getApiKey(): string {
  const key = process.env.ZIINA_API_KEY
  if (!key) {
    throw new Error(
      'Missing ZIINA_API_KEY. Copy backend/.env.example to backend/.env and paste your Ziina API key in.',
    )
  }
  return key
}

function isTestMode(): boolean {
  return process.env.ZIINA_TEST_MODE === 'true'
}

/**
 * Maps a Ziina payment_intent status to our internal payment status.
 * Defaults unknown/in-progress statuses to 'unpaid' rather than 'paid' —
 * fail closed, never mark an order paid on an ambiguous status.
 * ponytail: verify this list against Ziina's live API docs/dashboard on
 * first real test — their exact status strings weren't confirmable here.
 */
export function mapZiinaStatus(status: string): 'unpaid' | 'paid' | 'failed' {
  if (status === 'completed') return 'paid'
  if (status === 'failed' || status === 'cancelled' || status === 'canceled') return 'failed'
  return 'unpaid'
}

export async function createPaymentIntent(input: {
  amountAed: number
  orderNumber: string
  successUrl: string
  cancelUrl: string
}): Promise<{ id: string; redirectUrl: string }> {
  const res = await fetch(`${ZIINA_API_BASE}/payment_intent`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(input.amountAed * 100),
      currency_code: 'AED',
      message: `LuxeLife order ${input.orderNumber}`,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      test: isTestMode(),
    }),
  })

  const data = (await res.json()) as { id?: string; redirect_url?: string; message?: string }
  if (!res.ok || !data.id || !data.redirect_url) {
    throw new Error(data.message ?? `Ziina payment intent creation failed (${res.status})`)
  }
  return { id: data.id, redirectUrl: data.redirect_url }
}

export async function getPaymentIntent(intentId: string): Promise<{ id: string; status: string }> {
  const res = await fetch(`${ZIINA_API_BASE}/payment_intent/${intentId}`, {
    headers: { Authorization: `Bearer ${getApiKey()}` },
  })

  const data = (await res.json()) as { id?: string; status?: string; message?: string }
  if (!res.ok || !data.id || !data.status) {
    throw new Error(data.message ?? `Ziina payment intent lookup failed (${res.status})`)
  }
  return { id: data.id, status: data.status }
}

// Self-check for the one piece of real branching logic in this file.
// Run directly: `npm run test:ziina` (no network calls, no API key needed).
function demo() {
  const cases: [string, 'unpaid' | 'paid' | 'failed'][] = [
    ['completed', 'paid'],
    ['failed', 'failed'],
    ['cancelled', 'failed'],
    ['requires_payment_instrument', 'unpaid'],
    ['requires_user_action', 'unpaid'],
    ['pending', 'unpaid'],
  ]
  for (const [status, expected] of cases) {
    const actual = mapZiinaStatus(status)
    if (actual !== expected) {
      throw new Error(`mapZiinaStatus(${status}) = ${actual}, expected ${expected}`)
    }
  }
  console.log(`mapZiinaStatus: ${cases.length} cases passed`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  demo()
}
```

- [ ] **Step 2: Add the npm script**

In `backend/package.json`, add to `"scripts"`:

```json
"test:ziina": "tsx src/payments/ziina.ts"
```

- [ ] **Step 3: Run the self-check**

Run: `cd backend && npm run test:ziina`
Expected output: `mapZiinaStatus: 6 cases passed`

- [ ] **Step 4: Add env vars to `.env.example`**

In `backend/.env.example`, add after the Supabase section:

```
# Ziina (https://ziina.com) — Payments → API keys in your Ziina dashboard
ZIINA_API_KEY=your-ziina-api-key
ZIINA_TEST_MODE=true
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/payments/ziina.ts backend/package.json backend/.env.example
git commit -m "feat(backend): add Ziina payment intent client

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Payment routes

**Files:**
- Modify: `backend/src/routes.ts`

**Interfaces:**
- Consumes: `repo.createOrder` (now requires `paymentProvider`), `repo.updateOrderPayment`, `repo.getOrderById` (all from Task 3), `createPaymentIntent`/`getPaymentIntent`/`mapZiinaStatus` from Task 4.
- Produces: `POST /api/orders` (body now requires `paymentProvider`), `POST /api/payments/ziina/create` (body `{ orderId, successUrl, cancelUrl }`, returns `{ redirectUrl }`), `GET /api/payments/ziina/status/:orderId` (returns the full updated `Order`). Task 8 (frontend `api.ts`) calls these two new routes by these exact paths/shapes.

- [ ] **Step 1: Update the imports and the existing `POST /api/orders` handler**

In `backend/src/routes.ts`, update the import line:

```typescript
import { createPaymentIntent, getPaymentIntent, mapZiinaStatus } from './payments/ziina.js'
```

Replace the body of `publicRouter.post('/orders', ...)`:

```typescript
publicRouter.post('/orders', async (req, res) => {
  try {
    const body = req.body as {
      customer: Order['customer']
      items: Order['items']
      subtotal: number
      currency: Currency
      paymentMethod: string
      paymentProvider: Order['paymentProvider']
    }

    if (!body.customer?.email || !body.items?.length) {
      res.status(400).json({ error: 'Invalid order data' })
      return
    }
    if (body.paymentProvider !== 'cod' && body.paymentProvider !== 'ziina') {
      res.status(400).json({ error: 'Invalid payment provider' })
      return
    }

    const order = await repo.createOrder({
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal,
      currency: body.currency,
      paymentMethod: body.paymentMethod,
      paymentProvider: body.paymentProvider,
    })
    res.status(201).json(order)
  } catch (err) {
    handleError(res, err)
  }
})
```

- [ ] **Step 2: Add the Ziina payment routes**

Add after the `POST /api/orders` handler, still inside the `// --- Public routes ---` section:

```typescript
publicRouter.post('/payments/ziina/create', async (req, res) => {
  try {
    const { orderId, successUrl, cancelUrl } = req.body as {
      orderId?: string
      successUrl?: string
      cancelUrl?: string
    }
    if (!orderId || !successUrl || !cancelUrl) {
      res.status(400).json({ error: 'orderId, successUrl, and cancelUrl are required' })
      return
    }

    const order = await repo.getOrderById(orderId)
    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }
    if (order.paymentProvider !== 'ziina') {
      res.status(400).json({ error: 'This order is not set up for Ziina payment' })
      return
    }
    if (order.paymentStatus === 'paid') {
      res.status(400).json({ error: 'This order is already paid' })
      return
    }

    const intent = await createPaymentIntent({
      amountAed: order.subtotal,
      orderNumber: order.orderNumber,
      successUrl,
      cancelUrl,
    })
    await repo.updateOrderPayment(order.id, { paymentStatus: 'unpaid', paymentReference: intent.id })
    res.json({ redirectUrl: intent.redirectUrl })
  } catch (err) {
    handleError(res, err)
  }
})

publicRouter.get('/payments/ziina/status/:orderId', async (req, res) => {
  try {
    const order = await repo.getOrderById(req.params.orderId)
    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }
    if (!order.paymentReference) {
      res.json(order)
      return
    }

    const intent = await getPaymentIntent(order.paymentReference)
    const paymentStatus = mapZiinaStatus(intent.status)
    if (paymentStatus === order.paymentStatus) {
      res.json(order)
      return
    }

    const updated = await repo.updateOrderPayment(order.id, {
      paymentStatus,
      status: paymentStatus === 'paid' ? 'processing' : order.status,
    })
    res.json(updated ?? order)
  } catch (err) {
    handleError(res, err)
  }
})
```

- [ ] **Step 3: Type-check**

Run: `cd backend && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual smoke test against a running backend**

Run: `cd backend && npm run dev` (needs `backend/.env` with real Supabase creds already set up per existing README steps)

In another terminal:
```bash
curl -s -X POST http://localhost:3001/api/orders -H "Content-Type: application/json" -d '{"customer":{"email":"a@b.com","firstName":"A","lastName":"B","phone":"501234567","emirate":"dubai","area":"x","street":"y"},"items":[{"productId":"p1","name":"Test","variant":"v","price":10,"currency":"AED","quantity":1,"image":"i"}],"subtotal":10,"currency":"AED","paymentMethod":"Cash on Delivery","paymentProvider":"cod"}'
```
Expected: `201` with a JSON order that includes `"paymentProvider":"cod","paymentStatus":"unpaid","paymentReference":null`.

- [ ] **Step 5: Commit**

```bash
git add backend/src/routes.ts
git commit -m "feat(backend): add Ziina payment intent create/status routes

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Backend README — payments section

**Files:**
- Modify: `backend/README.md`

**Interfaces:**
- Consumes: nothing (docs only).
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Add the section**

In `backend/README.md`, add after the "Admin login" section:

```markdown
## Payments (Ziina)

1. Create a Ziina merchant account at [ziina.com](https://ziina.com) and find your API key under **Payments → API keys**.
2. Add to `backend/.env`:
   ```
   ZIINA_API_KEY=your-ziina-api-key
   ZIINA_TEST_MODE=true
   ```
3. Leave `ZIINA_TEST_MODE=true` while testing — Ziina will process the payment intent in test mode. Set it to `false` before accepting real payments.
4. No code changes needed — the checkout flow picks this up automatically once the key is set and the backend is redeployed/restarted.

Payment confirmation works by asking Ziina directly for the payment intent's status when the customer returns from checkout (`GET /api/payments/ziina/status/:orderId`), rather than a webhook. This is simpler and doesn't depend on your server being reachable from the internet for webhooks, at the cost of a small delay confirming payment vs. an instant webhook push.
```

- [ ] **Step 2: Commit**

```bash
git add backend/README.md
git commit -m "docs(backend): document Ziina payment setup

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Frontend types for payment fields

**Files:**
- Modify: `frontend/src/types/api.ts`

**Interfaces:**
- Produces: `Order` type gains `paymentProvider: 'cod' | 'ziina'`, `paymentStatus: 'unpaid' | 'paid' | 'failed'`, `paymentReference: string | null`, matching Task 2's backend type exactly. Task 8 (`api.ts`) and Task 10 (`CheckoutSuccessPage.tsx`) depend on these exact names.

- [ ] **Step 1: Update the `Order` interface**

In `frontend/src/types/api.ts`, replace the `Order` interface:

```typescript
export type PaymentProvider = 'cod' | 'ziina'
export type PaymentStatus = 'unpaid' | 'paid' | 'failed'

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  customer: {
    email: string
    firstName: string
    lastName: string
    phone: string
    emirate: string
    area: string
    street: string
    apartment?: string
    instructions?: string
  }
  items: OrderItem[]
  subtotal: number
  currency: Currency
  paymentMethod: string
  paymentProvider: PaymentProvider
  paymentStatus: PaymentStatus
  paymentReference: string | null
}
```

- [ ] **Step 2: Type-check**

Run: `cd frontend && npx tsc --noEmit`
Expected: fails in `src/lib/api.ts` (existing `mapOrder`/`createOrder` don't produce these fields yet) — expected, fixed in Task 8.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/types/api.ts
git commit -m "feat(frontend): add payment fields to Order type

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Point frontend order creation at the backend, add Ziina API calls

**Files:**
- Modify: `frontend/src/lib/api.ts`
- Modify: `frontend/.env.example`
- Modify: `frontend/.env.local` (local dev convenience, not committed — see step 4)

**Interfaces:**
- Consumes: `VITE_API_URL` env var, `Order` type from Task 7.
- Produces: `api.createOrder(input)` now posts to the backend (input gains a required `paymentProvider` field). New `api.createZiinaPayment(orderId: string): Promise<{ redirectUrl: string }>` and `api.getZiinaPaymentStatus(orderId: string): Promise<Order>`. Task 9 (`CheckoutPage.tsx`) and Task 10 (`CheckoutSuccessPage.tsx`) call these by these exact names.

- [ ] **Step 1: Add an API base URL helper and rewrite `createOrder`**

In `frontend/src/lib/api.ts`, add near the top (after the imports):

```typescript
function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL
  if (!base) {
    throw new Error('Missing VITE_API_URL. Set it in frontend/.env.local to your backend URL (e.g. http://localhost:3001).')
  }
  return `${base}${path}`
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
  return data as T
}
```

Replace the `createOrder` method inside `export const api = { ... }`:

```typescript
  async createOrder(input: {
    customer: Order['customer']
    items: Order['items']
    subtotal: number
    currency: Currency
    paymentMethod: string
    paymentProvider: Order['paymentProvider']
  }): Promise<Order> {
    if (!input.items.length) throw new Error('Your cart is empty')
    return apiFetch<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async createZiinaPayment(
    orderId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ redirectUrl: string }> {
    return apiFetch('/api/payments/ziina/create', {
      method: 'POST',
      body: JSON.stringify({ orderId, successUrl, cancelUrl }),
    })
  },

  async getZiinaPaymentStatus(orderId: string): Promise<Order> {
    return apiFetch(`/api/payments/ziina/status/${orderId}`)
  },
```

Remove the old `getSupabase().from('orders').insert(...)` block and the now-unused `crypto.randomUUID()`/`Date.now()` order-number generation in this file (the backend generates the order number now) — delete the whole previous `createOrder` implementation body being replaced above.

- [ ] **Step 2: Type-check**

Run: `cd frontend && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Add `VITE_API_URL` to `.env.example`**

In `frontend/.env.example`, add:

```
# Backend API (Express app in ../backend)
VITE_API_URL=http://localhost:3001
```

- [ ] **Step 4: Set it locally for testing**

Check `frontend/.env.local` — if it doesn't already have `VITE_API_URL`, add `VITE_API_URL=http://localhost:3001` to it (this file is gitignored, so this step has nothing to commit).

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/api.ts frontend/.env.example
git commit -m "feat(frontend): create orders via backend API, add Ziina payment calls

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Checkout page — payment method selector and Ziina redirect

**Files:**
- Modify: `frontend/src/pages/CheckoutPage.tsx`

**Interfaces:**
- Consumes: `api.createOrder` (now needs `paymentProvider`), `api.createZiinaPayment` from Task 8.
- Produces: nothing new consumed elsewhere — this is a leaf UI change.

- [ ] **Step 1: Add payment method state and replace the hardcoded COD block**

In `frontend/src/pages/CheckoutPage.tsx`, replace the `const COD = 'Cash on Delivery'` line with:

```typescript
type PaymentMethod = 'cod' | 'ziina'

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  ziina: 'Ziina',
}
```

Inside `CheckoutPage`, add state right after the existing `useState` calls:

```typescript
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
```

- [ ] **Step 2: Rewrite `onSubmit` to branch on payment method**

Replace the `onSubmit` function:

```typescript
  const onSubmit = async (data: CheckoutForm) => {
    if (!items.length) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const order = await api.createOrder({
        customer: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          emirate: data.emirate,
          area: data.area,
          street: data.street,
          apartment: data.apartment,
          instructions: data.instructions,
        },
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          variant: item.variant,
          price: item.price,
          currency: item.currency,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        currency: 'AED',
        paymentMethod: PAYMENT_LABELS[paymentMethod],
        paymentProvider: paymentMethod,
      })

      if (paymentMethod === 'ziina') {
        const origin = window.location.origin
        const { redirectUrl } = await api.createZiinaPayment(
          order.id,
          `${origin}/checkout/success?order=${order.id}`,
          `${origin}/checkout`,
        )
        clearCart()
        window.location.href = redirectUrl
        return
      }

      setOrderNumber(order.orderNumber)
      clearCart()
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
```

- [ ] **Step 3: Replace the hardcoded payment method block with a selector**

Replace the `<h4 className="font-label-caps ...">PAYMENT METHOD</h4>` block's following `<div className="flex flex-col gap-3 mb-8">...</div>`:

```tsx
                    <div className="flex flex-col gap-3 mb-8">
                      <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer ${paymentMethod === 'cod' ? 'border-primary-container bg-surface' : 'border-outline/15'}`}>
                        <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-primary" />
                        <span className="material-symbols-outlined text-primary">payments</span>
                        <div>
                          <p className="font-body-md text-body-md text-primary">Cash on Delivery</p>
                          <p className="font-label-sm text-label-sm text-secondary">Pay the courier when your order arrives.</p>
                        </div>
                      </label>
                      <label className={`flex items-center gap-3 p-4 border rounded cursor-pointer ${paymentMethod === 'ziina' ? 'border-primary-container bg-surface' : 'border-outline/15'}`}>
                        <input type="radio" name="paymentMethod" value="ziina" checked={paymentMethod === 'ziina'} onChange={() => setPaymentMethod('ziina')} className="accent-primary" />
                        <span className="material-symbols-outlined text-primary">credit_card</span>
                        <div>
                          <p className="font-body-md text-body-md text-primary">Pay with Ziina</p>
                          <p className="font-label-sm text-label-sm text-secondary">You'll be redirected to Ziina to complete payment.</p>
                        </div>
                      </label>
                    </div>
```

- [ ] **Step 4: Type-check**

Run: `cd frontend && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual test (COD path only — Ziina path needs Task 10's route to return to)**

Run: `cd frontend && npm run dev` and `cd backend && npm run dev` in a second terminal.
In the browser, add an item to cart, go to checkout, leave "Cash on Delivery" selected, submit.
Expected: "Order Placed" confirmation shown, same as before this change.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/CheckoutPage.tsx
git commit -m "feat(frontend): add Ziina payment option to checkout

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: Checkout success page (payment verification)

**Files:**
- Create: `frontend/src/pages/CheckoutSuccessPage.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Consumes: `api.getZiinaPaymentStatus` from Task 8, `Order`/`PaymentStatus` types from Task 7.
- Produces: route `/checkout/success` — the `successUrl` Task 9 constructs points here.

- [ ] **Step 1: Write the page**

Create `frontend/src/pages/CheckoutSuccessPage.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckoutHeader } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { api } from '../lib/api'
import type { Order } from '../types/api'

const POLL_ATTEMPTS = 5
const POLL_DELAY_MS = 2000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) {
      setError('Missing order reference.')
      return
    }

    let cancelled = false

    async function poll() {
      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        try {
          const result = await api.getZiinaPaymentStatus(orderId as string)
          if (cancelled) return
          setOrder(result)
          if (result.paymentStatus !== 'unpaid') return
        } catch (err) {
          if (cancelled) return
          setError(err instanceof Error ? err.message : 'Could not verify payment.')
          return
        }
        await sleep(POLL_DELAY_MS)
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [orderId])

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md antialiased">
      <CheckoutHeader />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 flex items-center justify-center">
        <div className="bg-surface-container-low p-8 rounded-lg border border-outline/15 text-center max-w-lg mx-auto">
          {error && (
            <>
              <span className="material-symbols-outlined text-4xl text-error mb-4">error</span>
              <h2 className="font-headline-md text-headline-md text-primary mb-2">Something went wrong</h2>
              <p className="font-body-md text-secondary mb-6">{error}</p>
            </>
          )}
          {!error && !order && (
            <>
              <span className="material-symbols-outlined text-4xl text-primary mb-4 animate-spin">progress_activity</span>
              <h2 className="font-headline-md text-headline-md text-primary mb-2">Confirming payment…</h2>
              <p className="font-body-md text-secondary mb-6">This only takes a moment.</p>
            </>
          )}
          {!error && order && order.paymentStatus === 'paid' && (
            <>
              <span className="material-symbols-outlined text-4xl text-primary mb-4">check_circle</span>
              <h2 className="font-headline-md text-headline-md text-primary mb-2">Payment Successful</h2>
              <p className="font-body-md text-secondary mb-6">Thank you. Your order {order.orderNumber} is confirmed.</p>
            </>
          )}
          {!error && order && order.paymentStatus === 'failed' && (
            <>
              <span className="material-symbols-outlined text-4xl text-error mb-4">cancel</span>
              <h2 className="font-headline-md text-headline-md text-primary mb-2">Payment Failed</h2>
              <p className="font-body-md text-secondary mb-6">Your order wasn't charged. You can try again from your cart.</p>
            </>
          )}
          {!error && order && order.paymentStatus === 'unpaid' && (
            <>
              <span className="material-symbols-outlined text-4xl text-primary mb-4">hourglass_top</span>
              <h2 className="font-headline-md text-headline-md text-primary mb-2">Still Processing</h2>
              <p className="font-body-md text-secondary mb-6">Ziina hasn't confirmed this payment yet. Refresh this page in a minute, or check your email for confirmation.</p>
            </>
          )}
          <Link to="/shop" className="font-label-caps text-label-caps text-primary underline">Continue shopping</Link>
        </div>
      </main>
      <Footer variant="checkout" />
    </div>
  )
}
```

- [ ] **Step 2: Register the route**

In `frontend/src/App.tsx`, add the lazy import next to `CheckoutPage`:

```typescript
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'))
```

Add the route right after `/checkout`:

```tsx
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
```

- [ ] **Step 3: Type-check**

Run: `cd frontend && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Build**

Run: `cd frontend && npm run build`
Expected: build succeeds, `CheckoutSuccessPage` appears as its own chunk in the output.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/CheckoutSuccessPage.tsx frontend/src/App.tsx
git commit -m "feat(frontend): add checkout success page that verifies Ziina payment

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 11: End-to-end smoke test with Ziina test mode

**Files:**
- None (verification-only task).

**Interfaces:**
- Consumes: everything from Tasks 1–10.
- Produces: nothing (confirms the feature works before calling it done).

- [ ] **Step 1: Set up both `.env` files**

`backend/.env`: real `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` (already required), plus `ZIINA_API_KEY=<the user's real key>` and `ZIINA_TEST_MODE=true`.
`frontend/.env.local`: `VITE_API_URL=http://localhost:3001` (plus existing Supabase vars, still needed for products/admin).

- [ ] **Step 2: Run the migration from Task 1 against the real Supabase project** (if not already applied).

- [ ] **Step 3: Start both servers**

```bash
cd backend && npm run dev
```
```bash
cd frontend && npm run dev
```

- [ ] **Step 4: Walk the Ziina path in a browser**

Add an item to cart → checkout → fill the form → select "Pay with Ziina" → submit.
Expected: redirected to a `ziina.com`/`pay.ziina.com` hosted checkout page in test mode.

Complete the test payment per Ziina's test-mode UI.
Expected: redirected back to `http://localhost:5173/checkout/success?order=<id>`, page shows "Confirming payment…" briefly then "Payment Successful".

- [ ] **Step 5: Verify the order record**

Run: `curl -s http://localhost:3001/api/admin/orders -H "Authorization: Bearer <token from POST /api/admin/login>"` (or check via the admin UI at `/admin/orders`).
Expected: the order shows `status: "processing"`, `paymentStatus: "paid"`, `paymentProvider: "ziina"`, `paymentReference` set to a Ziina intent id.

- [ ] **Step 6: Verify the COD path still works unchanged**

Repeat checkout selecting "Cash on Delivery".
Expected: immediate "Order Placed" confirmation (no redirect), order has `paymentProvider: "cod"`, `paymentStatus: "unpaid"`, `status: "pending"`.

No commit for this task — it's verification only. If any step fails, fix the relevant task's code and re-run this task before considering the feature done.

---

### Task 12: Admin panel — show payment status

**Files:**
- Modify: `frontend/src/admin/AdminDashboardPage.tsx`
- Modify: `frontend/src/admin/AdminOrdersPage.tsx`
- Modify: `frontend/src/admin/AdminOrderDetailPage.tsx`

**Interfaces:**
- Consumes: `Order.paymentProvider`/`paymentStatus`/`paymentReference` (Task 7), `Order.paymentMethod` (existing).
- Produces: `PaymentBadge` component exported from `AdminDashboardPage.tsx` (alongside the existing `StatusBadge`) — consumed by the other two files in this same task.

Added after Task 11: the admin panel currently shows only `order.paymentMethod` (a label like "Cash on Delivery" or "Ziina") with no indication of whether the order was actually paid, and `AdminOrderDetailPage.tsx` hardcodes "collect cash on delivery" regardless of payment method — misleading for a Ziina order that's already been paid online. This task adds a payment-status badge and, on the detail page, the Ziina reference id when present.

- [ ] **Step 1: Add `PaymentBadge` next to `StatusBadge`**

In `frontend/src/admin/AdminDashboardPage.tsx`, add after the existing `StatusBadge` function:

```tsx
export function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: 'bg-primary-container text-on-primary',
    unpaid: 'bg-soft-blush text-primary',
    failed: 'bg-error-container text-error',
  }
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-label-caps text-label-caps tracking-wider uppercase whitespace-nowrap ${colors[status] ?? 'bg-surface-variant text-primary'}`}
    >
      {status}
    </span>
  )
}
```

- [ ] **Step 2: Show it in `AdminOrdersPage.tsx`**

Import it: `import { PaymentBadge, StatusBadge } from './AdminDashboardPage'` (replacing the existing `StatusBadge`-only import).

In the mobile card view, replace:
```tsx
                  <span className="text-secondary">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} item(s) · {order.paymentMethod}
                  </span>
```
with:
```tsx
                  <span className="text-secondary flex items-center gap-2">
                    {order.items.reduce((n, i) => n + i.quantity, 0)} item(s) · {order.paymentMethod}
                    <PaymentBadge status={order.paymentStatus} />
                  </span>
```

In the desktop table, replace:
```tsx
                    <td className="px-6 py-4 text-secondary text-sm">{order.paymentMethod}</td>
```
with:
```tsx
                    <td className="px-6 py-4 text-secondary text-sm">
                      <div className="flex items-center gap-2">
                        {order.paymentMethod}
                        <PaymentBadge status={order.paymentStatus} />
                      </div>
                    </td>
```

- [ ] **Step 3: Show payment detail in `AdminOrderDetailPage.tsx`**

Import it: `import { PaymentBadge, StatusBadge } from './AdminDashboardPage'` (replacing the existing `StatusBadge`-only import).

Replace:
```tsx
        <p className="text-sm text-secondary mt-3">Payment: {order.paymentMethod} — collect cash on delivery.</p>
```
with:
```tsx
        <div className="text-sm text-secondary mt-3 flex items-center gap-2 flex-wrap">
          <span>Payment: {order.paymentMethod}</span>
          <PaymentBadge status={order.paymentStatus} />
          {order.paymentProvider === 'cod' && <span>— collect cash on delivery.</span>}
          {order.paymentReference && <span className="text-xs">Ref: {order.paymentReference}</span>}
        </div>
```

- [ ] **Step 4: Type-check**

Run: `cd frontend && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Build**

Run: `cd frontend && npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/admin/AdminDashboardPage.tsx frontend/src/admin/AdminOrdersPage.tsx frontend/src/admin/AdminOrderDetailPage.tsx
git commit -m "feat(admin): show payment status and reference on orders

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** Data model (Task 1), backend Ziina client + routes (Tasks 4–5), README rollout doc (Task 6), frontend order-creation-via-backend + Ziina calls (Task 8), checkout UI (Task 9), success/verification page (Task 10), end-to-end manual test (Task 11) — all spec sections have a task. PayPal and webhooks are explicitly out of scope per the spec and have no tasks, correctly.
- **Type consistency:** `PaymentProvider`/`PaymentStatus` field names (`paymentProvider`, `paymentStatus`, `paymentReference`) are identical across `backend/src/types.ts` (Task 2), `backend/src/mappers.ts` (Task 2), `backend/src/repository.ts` (Task 3), `backend/src/routes.ts` (Task 5), `frontend/src/types/api.ts` (Task 7), and `frontend/src/lib/api.ts` (Task 8). Route paths (`/api/payments/ziina/create`, `/api/payments/ziina/status/:orderId`) match between Task 5 (defines) and Task 8 (calls).
