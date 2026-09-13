// Standard e-commerce boilerplate - review before treating as final legal
// copy. Fields worth double-checking: registered legal entity name,
// governing-law emirate, support email/phone, and business address (none of
// these exist anywhere else in the codebase yet).
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

export default function TermsPage() {
  return (
    <div className="text-on-surface font-body-md min-h-screen flex flex-col bg-warm-ivory">
      <Header variant="about" />
      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-section-gap">
        <h1 className="font-display-lg text-display-lg text-primary mb-4">Terms of Service</h1>
        <p className="font-label-sm text-label-sm text-secondary mb-16">Last updated: September 2026</p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or placing an order through LuxeLife (the "Site"), you agree to be bound by these Terms of
            Service. If you do not agree to these terms, please do not use the Site.
          </p>
        </Section>

        <Section title="2. Products &amp; Pricing">
          <p>
            All prices are listed in AED and are inclusive of 5% UAE VAT unless stated otherwise. We reserve the
            right to correct pricing errors and to change prices at any time without prior notice. Product images
            are for illustrative purposes; actual items may vary slightly in colour or finish.
          </p>
        </Section>

        <Section title="3. Orders &amp; Payment">
          <p>
            Orders may be paid via Cash on Delivery or by card. Card payments are processed by Ziina, a licensed
            payment institution regulated by the Central Bank of the UAE; LuxeLife does not store your full card
            details. We reserve the right to refuse or cancel any order at our discretion, including in cases of
            suspected fraud or pricing errors.
          </p>
        </Section>

        <Section title="4. Intellectual Property">
          <p>
            All content on this Site — including text, images, logos, and design — is the property of LuxeLife or
            its licensors and may not be reproduced without written permission.
          </p>
        </Section>

        <Section title="5. Limitation of Liability">
          <p>
            LuxeLife is not liable for indirect, incidental, or consequential damages arising from your use of the
            Site or products purchased through it, to the fullest extent permitted by applicable law.
          </p>
        </Section>

        <Section title="6. Governing Law">
          <p>These Terms are governed by the laws of the United Arab Emirates.</p>
        </Section>

        <Section title="7. Changes to These Terms">
          <p>
            We may update these Terms from time to time. Continued use of the Site after changes are posted
            constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>Questions about these Terms can be sent to support@luxelife.com.</p>
        </Section>
      </main>
      <Footer variant="about" />
    </div>
  )
}
