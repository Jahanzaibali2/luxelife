import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

const CATEGORIES = ['orders', 'delivery', 'payments', 'returns', 'products'] as const

const FAQ_DATA: Record<string, { question: string; answer: string }[]> = {
  orders: [
    {
      question: 'How can I track my luxury order?',
      answer: "Once your order has been dispatched, you will receive an email containing a tracking link. You can also monitor the status of your order by logging into your LuxeLife account and navigating to 'Order History'.",
    },
    {
      question: 'Can I modify my order after placing it?',
      answer: 'Due to our swift processing times designed to get your items to you quickly, we have a very limited window to amend orders. Please contact our concierge immediately if a change is needed.',
    },
  ],
  delivery: [
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, LuxeLife delivers globally. We partner with premium courier services to ensure your curated pieces arrive safely, no matter your location. International shipping rates and times vary by destination.',
    },
    {
      question: 'Will I need to pay customs duties?',
      answer: 'For many destinations, duties and taxes are calculated and collected at checkout. For others, you may be responsible for paying these fees upon delivery. Please check our detailed shipping policy for specific country regulations.',
    },
  ],
  payments: [
    {
      question: 'Which payment methods are accepted?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. For select high-value items, we also offer secure wire transfer options.',
    },
  ],
}

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
                          <span className={`material-symbols-outlined accordion-icon text-secondary ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
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
              <Link to="/contact" className="bg-primary text-on-primary font-label-caps text-label-caps tracking-[0.1em] px-8 py-4 rounded hover:bg-primary-container btn-lift whitespace-nowrap">
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
