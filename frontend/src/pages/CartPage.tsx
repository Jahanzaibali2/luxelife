import { Link } from 'react-router-dom'
import { formatPrice, useCart } from '../context/CartContext'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const currency = items[0]?.currency ?? '$'

  return (
    <div className="text-on-background font-body-md antialiased min-h-screen flex flex-col bg-warm-ivory">
      <Header variant="cart" />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
        <div className="mb-12">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Your Curated Selection</h1>
          <p className="font-body-lg text-body-lg text-secondary">Review your items before proceeding to checkout.</p>
        </div>
        {items.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-lg border border-outline/15 text-center">
            <p className="font-body-lg text-secondary mb-6">Your cart is empty.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary underline">
              Shop the collection
            </Link>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16">
          <div className="lg:col-span-8 flex flex-col gap-8">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-surface-container-lowest p-6 rounded-lg border border-outline/15 group card-lift">
                <div className="w-full sm:w-40 h-48 sm:h-40 shrink-0 bg-surface-container rounded overflow-hidden">
                  <img alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={item.image} loading="lazy" decoding="async" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary mb-1">{item.name}</h3>
                      <p className="font-body-md text-body-md text-secondary">{item.variant}</p>
                    </div>
                    <button type="button" aria-label="Remove item" onClick={() => removeItem(item.id)} className="text-secondary hover:text-error transition-colors">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-outline/30 rounded">
                      <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-secondary hover:text-primary transition-colors">-</button>
                      <span className="px-4 py-1 font-body-md text-body-md border-x border-outline/30">{item.quantity}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-secondary hover:text-primary transition-colors">+</button>
                    </div>
                    <span className="font-headline-md text-headline-md text-primary">
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline/15 sticky top-32">
              <h2 className="font-headline-md text-headline-md text-primary mb-6 pb-4 border-b border-outline/15">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-body-md text-body-md text-secondary">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between font-body-md text-body-md text-secondary">
                  <span>Estimated Shipping</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between font-body-md text-body-md text-secondary">
                  <span>Payment</span>
                  <span>Cash on Delivery</span>
                </div>
              </div>
              <div className="flex justify-between items-end mb-8 pt-6 border-t border-outline/15">
                <span className="font-body-lg text-body-lg text-primary">Total</span>
                <span className="font-headline-md text-headline-md text-primary">{formatPrice(subtotal, currency)}</span>
              </div>
              <Link to="/checkout" className="block w-full bg-[#452829] text-white font-label-caps text-label-caps tracking-[0.1em] py-4 rounded hover:bg-[#3b2d25] transition-colors btn-lift mb-6 uppercase text-center">
                Proceed to Checkout
              </Link>
              <div className="text-center">
                <Link to="/shop" className="inline-flex items-center gap-2 font-label-sm text-label-sm text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>
      <Footer variant="cart" />
    </div>
  )
}
