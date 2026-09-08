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
