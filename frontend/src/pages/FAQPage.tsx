import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

// ponytail: every answer must match checkout code + ShippingReturnsPage. Change policy there, change it here.
const FAQ_DATA: Record<string, { question: string; answer: string }[]> = {
  orders: [
    {
      question: 'How do I know my order went through?',
      answer: "You'll see your order number on screen as soon as it's placed, and we email a confirmation to the address you gave at checkout. Card orders are confirmed once the payment goes through.",
    },
    {
      question: 'Do I need an account to order?',
      answer: 'No. Checkout is guest-only. You just need your name, email, phone number and delivery address.',
    },
    {
      question: 'Can I change or cancel my order?',
      answer: 'Orders are usually processed within 1–2 business days, so contact us as soon as possible by phone or WhatsApp on +971 52 657 2012 with your order number.',
    },
  ],
  delivery: [
    {
      question: 'How much is shipping?',
      answer: 'Shipping within the UAE is free.',
    },
    {
      question: 'Do you ship outside the UAE?',
      answer: 'Yes, to select destinations, including Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, the United States, the United Kingdom and India. Customs duties or import taxes on international orders are paid by the recipient.',
    },
    {
      question: 'How do I track my order?',
      answer: "Once your order is dispatched, we'll send you tracking details where available. You can also message us with your order number for an update.",
    },
  ],
  payments: [
    {
      question: 'Which payment methods do you accept?',
      answer: 'Cash on Delivery (pay the courier when your order arrives) or credit/debit card. Card payments are handled on a secure Ziina payment page.',
    },
    {
      question: 'What currency are prices in? Is VAT included?',
      answer: 'All prices are in UAE Dirhams (AED) and include 5% VAT.',
    },
  ],
  returns: [
    {
      question: 'What is your return policy?',
      answer: 'You can return items within 14 days of delivery if they are unused, in their original condition, with all packaging and tags. Contact us with your order number to start a return. Return shipping is paid by the customer unless the item arrived damaged or incorrect.',
    },
    {
      question: 'How are refunds paid?',
      answer: 'Once we receive and inspect your return, we refund your original payment method within 5–7 business days. Cash on Delivery orders are refunded by bank transfer.',
    },
    {
      question: 'My item arrived damaged or wrong. What do I do?',
      answer: "Contact us within 48 hours of delivery with photos and we'll send a replacement or refund at no cost to you.",
    },
  ],
}

const CATEGORIES = Object.keys(FAQ_DATA)

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('orders')
  const [openKey, setOpenKey] = useState<string | null>(null)

  const scrollToCategory = (id: string) => {
    setActiveCategory(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleAccordion = (key: string) => {
    setOpenKey(openKey === key ? null : key)
  }

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      <title>FAQ | LuxeLife</title>
      <meta name="description" content="Answers about LuxeLife orders, delivery across the UAE, payment and returns." />
      <Header variant="faq" />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
          <h1 className="font-display-lg text-display-lg text-primary mb-6">Frequently Asked Questions</h1>
          <p className="font-body-lg text-body-lg text-secondary">Find answers to our most common inquiries. For further assistance, our concierge team is always available.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-3 lg:col-span-3 sticky top-32 self-start hidden md:block">
            <div className="space-y-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => scrollToCategory(cat)}
                  className={`w-full text-left font-label-caps text-label-caps tracking-[0.1em] pb-2 transition-all uppercase ${
                    activeCategory === cat
                      ? 'text-primary border-b border-primary'
                      : 'text-secondary hover:text-primary border-b border-transparent hover:border-outline/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-9 lg:col-span-8 lg:col-start-5 space-y-16">
            {Object.entries(FAQ_DATA).map(([sectionId, items]) => (
              <section key={sectionId} className="scroll-mt-32" id={sectionId}>
                <h2 className="font-headline-md text-headline-md text-primary mb-8 border-b border-outline/15 pb-4 capitalize">{sectionId}</h2>
                <div className="space-y-4">
                  {items.map((item, i) => {
                    const key = `${sectionId}-${i}`
                    const isOpen = openKey === key
                    return (
                      <div key={key} className="border-b border-outline/15 pb-4">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(key)}
                          className={`accordion-button w-full flex justify-between items-center text-left py-4 hover:opacity-80 transition-opacity ${isOpen ? 'active' : ''}`}
                        >
                          <span className="font-body-lg text-body-lg text-primary">{item.question}</span>
                          <Plus strokeWidth={1.25} aria-hidden className={`accordion-icon h-4 w-4 shrink-0 text-secondary ${isOpen ? 'rotate-45' : ''}`} />
                        </button>
                        <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                          <p className="text-secondary font-body-md text-body-md pb-4 pt-2">{item.answer}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}

            <div className="bg-surface-container-low rounded-xl p-8 border border-outline/10 flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary mb-2">Still need help?</h3>
                <p className="font-body-md text-body-md text-secondary">Our dedicated concierge team is available to assist you.</p>
              </div>
              <Link to="/contact" className="btn-primary whitespace-nowrap">
                CONTACT US
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="faq" />
    </div>
  )
}
