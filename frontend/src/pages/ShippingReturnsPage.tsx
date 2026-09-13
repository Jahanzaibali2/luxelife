// Standard e-commerce boilerplate - review before treating as final policy.
// Fields worth double-checking: actual delivery timeframes, real shipping
// carriers, and the return window (14 days is a common default, not
// pulled from any existing business decision in this codebase).
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-headline-md text-headline-md text-primary mb-4">{title}</h2>
      <div className="font-body-md text-body-md text-secondary leading-relaxed space-y-4">{children}</div>
    </section>
  )
}

export default function ShippingReturnsPage() {
  return (
    <div className="text-on-surface font-body-md min-h-screen flex flex-col bg-warm-ivory">
      <Header variant="about" />
      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-section-gap">
        <h1 className="font-display-lg text-display-lg text-primary mb-4">Shipping &amp; Returns</h1>
        <p className="font-label-sm text-label-sm text-secondary mb-16">Last updated: September 2026</p>

        <Section title="Shipping">
          <p>
            We currently offer complimentary shipping within the UAE, and ship internationally to select
            destinations. Orders are typically processed within 1–2 business days. For international orders, any
            customs duties or import taxes are the responsibility of the recipient and may be collected at checkout
            or on delivery, depending on destination.
          </p>
        </Section>

        <Section title="Order Tracking">
          <p>
            Once your order has been dispatched, you will receive a confirmation with tracking details where
            available.
          </p>
        </Section>

        <Section title="Returns">
          <p>
            We accept returns within 14 days of delivery for items in their original, unused condition with all
            packaging and tags intact. To start a return, contact us with your order number. Return shipping costs
            are the responsibility of the customer unless the item arrived damaged or incorrect.
          </p>
        </Section>

        <Section title="Refunds">
          <p>
            Once your return is received and inspected, refunds are issued to your original payment method (or, for
            Cash on Delivery orders, via bank transfer) within 5–7 business days.
          </p>
        </Section>

        <Section title="Damaged or Incorrect Items">
          <p>
            If your order arrives damaged or incorrect, contact us within 48 hours of delivery with photos of the
            item, and we'll arrange a replacement or refund at no cost to you.
          </p>
        </Section>

        <Section title="Contact">
          <p>Questions about shipping or returns can be sent to support@luxelife.com.</p>
        </Section>
      </main>
      <Footer variant="about" />
    </div>
  )
}
