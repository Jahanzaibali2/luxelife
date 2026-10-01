import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Price } from '../components/Price'
import { useCart } from '../context/CartContext'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { Reveal } from '../components/motion/Reveal'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()

  return (
    <div className="flex min-h-screen flex-col bg-white font-body-md text-ink">
      <Header variant="cart" />
      <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile pb-section-gap md:px-margin-desktop">
        <Reveal className="border-b border-hairline pb-10 pt-16 md:pt-28">
          <p className="mb-4 font-label-caps text-label-caps text-secondary">Your selection</p>
          <h1 className="font-display-lg text-display-lg">Cart</h1>
        </Reveal>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-32 text-center">
            <ShoppingBag strokeWidth={1} className="h-10 w-10 text-secondary" />
            <p className="font-serif text-headline-md">Your cart is empty.</p>
            <Link to="/shop" className="link-underline is-drawn text-button">
              Browse the collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-16 pt-4 lg:grid-cols-12 lg:gap-6">
            <ul className="lg:col-span-7">
              {items.map((item) => (
                <li key={item.id} className="flex gap-6 border-b border-hairline py-8">
                  <div className="h-40 w-32 shrink-0 overflow-hidden bg-backdrop md:h-48 md:w-40">
                    <img alt={item.name} className="h-full w-full object-cover" src={item.image} loading="lazy" decoding="async" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <h3 className="font-serif text-2xl leading-tight">{item.name}</h3>
                        <p className="mt-2 font-label-caps text-label-caps text-secondary">{item.variant}</p>
                      </div>
                      <Price amount={item.price * item.quantity} variant="line" className="shrink-0" />
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <div className="flex items-center gap-3 text-label-sm">
                        <button type="button" aria-label={`Decrease quantity of ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center border border-hairline text-secondary transition-colors hover:border-ink hover:text-ink">
                          <Minus strokeWidth={1.25} className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-5 text-center tabular-nums" aria-live="polite">{item.quantity}</span>
                        <button type="button" aria-label={`Increase quantity of ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center border border-hairline text-secondary transition-colors hover:border-ink hover:text-ink">
                          <Plus strokeWidth={1.25} className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="flex items-center gap-2 text-label-sm text-secondary transition-colors hover:text-ink">
                        <Trash2 strokeWidth={1.25} className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-28 lg:pt-8">
                <h2 className="mb-6 font-label-caps text-label-caps">Order summary</h2>
                <dl className="flex flex-col gap-3 border-b border-hairline pb-6 text-label-sm">
                  <div className="flex justify-between">
                    <dt className="text-secondary">Subtotal</dt>
                    <dd><Price amount={subtotal} variant="inline" /></dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-secondary">Delivery</dt>
                    <dd>Complimentary</dd>
                  </div>
                </dl>
                <div className="flex items-baseline justify-between py-6">
                  <span className="font-label-caps text-label-caps">Total</span>
                  <Price amount={subtotal} variant="emphasis" />
                </div>
                <Link to="/checkout" className="btn-primary group w-full">
                  Checkout
                  <ArrowRight strokeWidth={1.25} className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
                </Link>
                <Link to="/shop" className="mx-auto mt-5 flex w-fit items-center gap-2 text-label-sm text-secondary transition-colors hover:text-ink">
                  <ArrowLeft strokeWidth={1.25} className="h-4 w-4" />
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer variant="cart" />
    </div>
  )
}
