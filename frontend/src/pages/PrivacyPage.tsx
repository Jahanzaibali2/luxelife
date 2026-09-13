// Standard e-commerce boilerplate - review before treating as final legal
// copy. Fields worth double-checking: support email/phone, data-retention
// specifics, and whether any analytics/marketing tools are added later
// (this list should stay in sync with what the Site actually uses).
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

export default function PrivacyPage() {
  return (
    <div className="text-on-surface font-body-md min-h-screen flex flex-col bg-warm-ivory">
      <Header variant="about" />
      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-section-gap">
        <h1 className="font-display-lg text-display-lg text-primary mb-4">Privacy Policy</h1>
        <p className="font-label-sm text-label-sm text-secondary mb-16">Last updated: September 2026</p>

        <Section title="1. Information We Collect">
          <p>
            When you place an order or contact us, we collect information such as your name, email address, phone
            number, and delivery address. We do not collect or store full payment card details — card payments are
            handled directly by Ziina, our payment processor.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>
            We use your information to process and deliver orders, respond to enquiries, and communicate order
            updates. We do not sell your personal information to third parties.
          </p>
        </Section>

        <Section title="3. Sharing With Third Parties">
          <p>
            We share order and payment details with our payment processor (Ziina) and courier partners only as
            needed to fulfil your order. These providers are contractually required to protect your information.
          </p>
        </Section>

        <Section title="4. Data Security">
          <p>
            We take reasonable technical and organisational measures to protect your personal information against
            unauthorised access, loss, or misuse.
          </p>
        </Section>

        <Section title="5. Your Rights">
          <p>
            You may request access to, correction of, or deletion of your personal information at any time by
            contacting us.
          </p>
        </Section>

        <Section title="6. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Continued use of the Site after changes are posted
            constitutes acceptance of the revised policy.
          </p>
        </Section>

        <Section title="7. Contact">
          <p>Questions about this Privacy Policy can be sent to support@luxelife.com.</p>
        </Section>
      </main>
      <Footer variant="about" />
    </div>
  )
}
