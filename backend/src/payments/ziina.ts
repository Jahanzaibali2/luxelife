import { resolve } from 'node:path'

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
  const normalized = status.toLowerCase()
  if (normalized === 'completed') return 'paid'
  if (normalized === 'failed' || normalized === 'cancelled' || normalized === 'canceled') return 'failed'
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

// ponytail: cross-platform check — on Windows, import.meta.url has 3 slashes and
// forward slashes, but process.argv[1] is a backslash path. Use URL constructor
// to normalize both to the same file:// URL format.
if (import.meta.url === new URL(`file://${resolve(process.argv[1]).replace(/\\/g, '/')}`).href) {
  demo()
}
