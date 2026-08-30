import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  const onSubmit = () => setSubmitted(true)

  return (
    <div className="text-primary font-body-md min-h-screen flex flex-col bg-warm-ivory">
      <Header variant="contact" />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <section className="text-center mb-section-gap">
          <h1 className="font-display-lg text-display-lg text-primary mb-6">Let&apos;s Talk.</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">
            We are here to assist you with inquiries, bespoke requests, and curation guidance. Our dedicated team aims to respond within 24 hours.
          </p>
        </section>

        {submitted ? (
          <div className="bg-surface p-8 rounded border border-outline/15 text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-primary mb-4">mail</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Message Sent</h2>
            <p className="font-body-md text-secondary">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-7 bg-surface p-8 md:p-12 rounded border border-outline/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 accent-bg rounded-bl-full opacity-20 -z-10" />
              <h2 className="font-headline-md text-headline-md text-primary mb-8">Send a Message</h2>
              <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-label-caps text-label-caps text-secondary mb-2" htmlFor="name">Full Name</label>
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow" id="name" placeholder="Enter your name" type="text" {...register('name')} />
                    {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-secondary mb-2" htmlFor="email">Email Address</label>
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow" id="email" placeholder="Enter your email" type="email" {...register('email')} />
                    {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-label-caps text-label-caps text-secondary mb-2" htmlFor="phone">Phone Number</label>
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow" id="phone" placeholder="Optional" type="tel" {...register('phone')} />
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-secondary mb-2" htmlFor="subject">Subject</label>
                    <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow" id="subject" placeholder="How can we help?" type="text" {...register('subject')} />
                  </div>
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-secondary mb-2" htmlFor="message">Your Message</label>
                  <textarea className="w-full bg-transparent border-0 border-b border-outline/30 focus:border-primary focus:ring-0 px-0 py-2 font-body-md field-glow resize-none" id="message" placeholder="Type your message here..." rows={4} {...register('message')} />
                  {errors.message && <p className="text-error text-sm mt-1">{errors.message.message}</p>}
                </div>
                <button className="bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-tertiary transition-colors btn-lift w-full md:w-auto mt-4" type="submit">
                  Send Inquiry
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="space-y-8 mb-12">
                <div className="bg-surface p-8 rounded border border-outline/15 card-lift">
                  <div className="flex items-center space-x-4 mb-4 text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                    <h3 className="font-headline-md text-headline-md">Direct Line</h3>
                  </div>
                  <p className="font-body-md text-secondary mb-2">Speak with a concierge specialist.</p>
                  <a className="font-body-lg text-body-lg text-primary font-medium hover:underline" href="tel:+971526572012">+971 52 657 2012</a>
                </div>
                <div className="bg-surface p-8 rounded border border-outline/15 card-lift">
                  <div className="flex items-center space-x-4 mb-4 text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                    <h3 className="font-headline-md text-headline-md">WhatsApp</h3>
                  </div>
                  <p className="font-body-md text-secondary mb-2">Instant messaging for quick queries.</p>
                  <a className="font-body-lg text-body-lg text-primary font-medium hover:underline" href="https://wa.me/971526572012">+971 52 657 2012</a>
                </div>
              </div>
              <div className="h-64 w-full rounded overflow-hidden relative">
                <img className="w-full h-full object-cover grayscale opacity-90 mix-blend-multiply hover:grayscale-0 transition-all duration-700" alt="Editorial workspace" loading="lazy" decoding="async" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSL_9MqcjWTymZlXlB-WsASzuPRKVI_7DZ9UcPvhgrHMuuvoxMmUSIP7qZLTX6AbnDD_nyqLExFzCQPSK3RUYorXL3-uaCf3w3geelJAXKSw4NQ6s6Hv7_CuZvfXX2LZzTDmF1X9iDGTgSNs6ecz52XHh6JJ-Y9GGV9byHbGyoH8CTDXP2kwQOaXndVlJO85VxU7iUEs5CJyjLrOW-Fzgudk-HCTz2wec9_NaCf_Gzfun-_kYUGRlaFw" />
                <div className="absolute inset-0 bg-primary/10" />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer variant="contact" />
    </div>
  )
}
