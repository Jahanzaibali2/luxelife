import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckoutHeader } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { formatPrice, useCart } from '../context/CartContext'
import { api } from '../lib/api'

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  emirate: z.string().min(1, 'Please select an emirate'),
  area: z.string().min(1, 'Area is required'),
  street: z.string().min(1, 'Street address is required'),
  apartment: z.string().optional(),
  instructions: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

const COD = 'Cash on Delivery'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const currency = items[0]?.currency ?? '$'
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) })

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
        currency,
        paymentMethod: COD,
      })
      setOrderNumber(order.orderNumber)
      clearCart()
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!submitted && items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md antialiased">
      <CheckoutHeader />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
        <div className="mb-12">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-2">Checkout</h1>
          <p className="font-body-lg text-body-lg text-secondary">Complete your order details below.</p>
        </div>

        {submitted ? (
          <div className="bg-surface-container-low p-8 rounded-lg border border-outline/15 text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-primary mb-4">check_circle</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Order Placed</h2>
            <p className="font-body-md text-secondary mb-6">
              Thank you. Your cash-on-delivery order{orderNumber ? ` ${orderNumber}` : ''} is confirmed. Pay the courier when it arrives.
            </p>
            <Link to="/shop" className="font-label-caps text-label-caps text-primary underline">Continue shopping</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16">
              <div className="lg:col-span-7 flex flex-col gap-12">
                <section>
                  <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3 border-b border-outline/15 pb-4">
                    <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-caps text-[10px]">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-8">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-label-sm text-label-sm text-secondary mb-1" htmlFor="email">Email Address</label>
                      <input className="input-minimal w-full font-body-md text-body-md text-on-surface" id="email" placeholder="you@example.com" type="email" {...register('email')} />
                      {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="col-span-1">
                      <label className="block font-label-sm text-label-sm text-secondary mb-1" htmlFor="firstName">First Name</label>
                      <input className="input-minimal w-full font-body-md text-body-md text-on-surface" id="firstName" placeholder="John" type="text" {...register('firstName')} />
                      {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="col-span-1">
                      <label className="block font-label-sm text-label-sm text-secondary mb-1" htmlFor="lastName">Last Name</label>
                      <input className="input-minimal w-full font-body-md text-body-md text-on-surface" id="lastName" placeholder="Doe" type="text" {...register('lastName')} />
                      {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-label-sm text-label-sm text-secondary mb-1" htmlFor="phone">Phone Number (UAE)</label>
                      <div className="flex gap-4">
                        <span className="font-body-md text-body-md text-secondary py-2 border-b border-outline-variant">+971</span>
                        <input className="input-minimal flex-grow font-body-md text-body-md text-on-surface" id="phone" placeholder="50 123 4567" type="tel" {...register('phone')} />
                      </div>
                      {errors.phone && <p className="text-error text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3 border-b border-outline/15 pb-4">
                    <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-caps text-[10px]">2</span>
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-8">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-label-sm text-label-sm text-secondary mb-1" htmlFor="emirate">Emirate</label>
                      <select className="input-minimal w-full font-body-md text-body-md text-on-surface bg-transparent appearance-none" id="emirate" {...register('emirate')}>
                        <option value="">Select Emirate</option>
                        <option value="dubai">Dubai</option>
                        <option value="abudhabi">Abu Dhabi</option>
                        <option value="sharjah">Sharjah</option>
                        <option value="ajman">Ajman</option>
                      </select>
                      {errors.emirate && <p className="text-error text-sm mt-1">{errors.emirate.message}</p>}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-label-sm text-label-sm text-secondary mb-1" htmlFor="area">Area / Neighborhood</label>
                      <input className="input-minimal w-full font-body-md text-body-md text-on-surface" id="area" placeholder="e.g. Downtown Dubai" type="text" {...register('area')} />
                      {errors.area && <p className="text-error text-sm mt-1">{errors.area.message}</p>}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-label-sm text-label-sm text-secondary mb-1" htmlFor="street">Street Address</label>
                      <input className="input-minimal w-full font-body-md text-body-md text-on-surface" id="street" placeholder="Street Name, Building Name, Villa No." type="text" {...register('street')} />
                      {errors.street && <p className="text-error text-sm mt-1">{errors.street.message}</p>}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block font-label-sm text-label-sm text-secondary mb-1" htmlFor="apartment">Apartment / Suite (Optional)</label>
                      <input className="input-minimal w-full font-body-md text-body-md text-on-surface" id="apartment" placeholder="Apt 123" type="text" {...register('apartment')} />
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3 border-b border-outline/15 pb-4">
                    <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-caps text-[10px]">3</span>
                    Delivery Instructions
                  </h2>
                  <div className="grid grid-cols-1 gap-y-8">
                    <div className="col-span-1">
                      <label className="block font-label-sm text-label-sm text-secondary mb-2" htmlFor="instructions">Additional notes for the courier (Optional)</label>
                      <textarea className="w-full border border-outline-variant bg-transparent p-4 rounded font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-0 transition-colors" id="instructions" placeholder="e.g. Leave at reception, Call before delivery..." rows={3} {...register('instructions')} />
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="sticky top-32 bg-surface-container-low p-8 rounded-lg border border-outline/5 flex flex-col gap-8">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary mb-6">Order Summary</h3>
                    <div className="flex flex-col gap-6 mb-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start">
                          <div className="w-20 h-24 bg-surface-container flex-shrink-0 rounded overflow-hidden">
                            <img className="w-full h-full object-cover" alt={item.name} loading="lazy" decoding="async" src={item.image} />
                          </div>
                          <div className="flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-body-md text-body-md font-medium text-primary line-clamp-2 pr-4">{item.name}</span>
                              <span className="font-body-md text-body-md font-medium text-primary whitespace-nowrap">{formatPrice(item.price * item.quantity, item.currency)}</span>
                            </div>
                            <span className="font-label-sm text-label-sm text-secondary mb-2">{item.variant}</span>
                            <span className="font-label-sm text-label-sm text-secondary">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-outline/15 pt-6 pb-6 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body-md text-body-md text-secondary">Subtotal</span>
                        <span className="font-body-md text-body-md text-primary">{formatPrice(subtotal, currency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-body-md text-body-md text-secondary">Shipping</span>
                        <span className="font-body-md text-body-md text-primary">Complimentary</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-body-md text-body-md text-secondary">VAT (5%)</span>
                        <span className="font-body-md text-body-md text-primary">Included</span>
                      </div>
                    </div>
                    <div className="border-t border-outline/15 pt-6 mb-8 flex justify-between items-center">
                      <span className="font-headline-md text-headline-md text-primary">Total</span>
                      <span className="font-headline-md text-headline-md text-primary">{formatPrice(subtotal, currency)}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-label-caps text-label-caps text-secondary mb-4 tracking-[0.1em]">PAYMENT METHOD</h4>
                    <div className="flex flex-col gap-3 mb-8">
                      <div className="flex items-center gap-3 p-4 border border-primary-container bg-surface rounded">
                        <span className="material-symbols-outlined text-primary">payments</span>
                        <div>
                          <p className="font-body-md text-body-md text-primary">Cash on Delivery</p>
                          <p className="font-label-sm text-label-sm text-secondary">Pay the courier when your order arrives.</p>
                        </div>
                      </div>
                    </div>
                    {submitError && <p className="text-error text-sm mb-4">{submitError}</p>}
                    <button type="submit" disabled={submitting || items.length === 0} className="w-full bg-primary-container text-on-primary font-label-caps text-label-caps tracking-[0.1em] py-4 rounded hover:bg-tertiary transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                      {submitting ? 'PLACING ORDER…' : 'PLACE ORDER'}
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                    <p className="text-center font-label-sm text-label-sm text-secondary mt-4">
                      By placing your order, you agree to our <a className="underline hover:text-primary" href="#">Terms & Conditions</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
      <Footer variant="checkout" />
    </div>
  )
}
