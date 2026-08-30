import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'

export type FooterVariant =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'about'
  | 'faq'
  | 'contact'

interface FooterProps {
  variant: FooterVariant
}

export function Footer({ variant }: FooterProps) {
  if (variant === 'checkout') {
    return (
      <footer className="w-full bg-surface-container-low border-t border-outline/10 py-8 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center">
        <Logo
          textClassName="font-headline-md text-headline-md text-primary/40"
          imageClassName="h-7 w-7 object-contain shrink-0 opacity-40"
        />
        <span className="font-label-sm text-label-sm text-secondary">© 2024 LuxeLife. Secure Checkout.</span>
      </footer>
    )
  }

  if (variant === 'contact') {
    return (
      <footer className="bg-primary text-on-primary w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-start px-margin-mobile md:px-margin-desktop py-16 w-full max-w-container-max mx-auto gap-12">
          <div className="flex flex-col max-w-sm">
            <Logo
              textClassName="font-headline-md text-headline-md text-on-primary"
              imageClassName="h-8 w-8 object-contain shrink-0"
            />
            <p className="font-body-md text-body-md text-on-primary/80 leading-relaxed mb-6">
              Curated for the discerning lifestyle. Elevating the everyday with carefully selected pieces that embody quality and minimalist elegance.
            </p>
            <div className="font-label-caps text-label-caps text-on-primary/60">
              © 2024 LuxeLife. All rights reserved.
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 font-body-md text-body-md">
            <div className="flex flex-col space-y-4">
              <Link to="/about" className="text-on-primary/80 hover:text-surface-bright transition-colors">About Us</Link>
              <Link to="/contact" className="text-on-primary/80 hover:text-surface-bright transition-colors">Contact Us</Link>
            </div>
            <div className="flex flex-col space-y-4">
              <Link to="/faq" className="text-on-primary/80 hover:text-surface-bright transition-colors">FAQ</Link>
              <a href="#" className="text-on-primary/80 hover:text-surface-bright transition-colors">Shipping & Returns</a>
            </div>
            <div className="flex flex-col space-y-4 col-span-2 md:col-span-1">
              <a href="#" className="text-on-primary/80 hover:text-surface-bright transition-colors">Privacy Policy</a>
              <a href="#" className="text-on-primary/80 hover:text-surface-bright transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  if (variant === 'cart' || variant === 'faq') {
    return (
      <footer className="bg-primary dark:bg-primary-container full-width px-margin-mobile md:px-margin-desktop py-section-gap w-full flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0 mt-auto">
        <div className="flex flex-col gap-6">
          <Logo
            textClassName="font-headline-md text-headline-md text-on-primary dark:text-on-primary-container"
            imageClassName="h-8 w-8 object-contain shrink-0"
          />
          <p className="font-body-md text-body-md text-on-primary/80 max-w-sm">
            © 2024 LuxeLife. All rights reserved. Curated for the discerning lifestyle.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 font-body-md text-body-md">
          <Link to="/about" className="text-on-primary/80 hover:text-on-primary-container transition-colors">About Us</Link>
          <Link to="/contact" className="text-on-primary/80 hover:text-on-primary-container transition-colors">Contact Us</Link>
          <Link to="/faq" className={`text-on-primary/80 hover:text-on-primary-container transition-colors ${variant === 'faq' ? 'underline' : ''}`}>FAQ</Link>
          <a href="#" className="text-on-primary/80 hover:text-on-primary-container transition-colors">Privacy Policy</a>
          <a href="#" className="text-on-primary/80 hover:text-on-primary-container transition-colors">Terms of Service</a>
          <a href="#" className="text-on-primary/80 hover:text-on-primary-container transition-colors">Shipping & Returns</a>
        </div>
      </footer>
    )
  }

  if (variant === 'about') {
    return (
      <footer className="bg-primary-container dark:bg-tertiary-container text-surface-container dark:text-surface-bright full-width mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
          <div className="md:col-span-2 flex flex-col gap-6">
            <Logo
              textClassName="font-display-lg text-headline-md text-surface-container"
              imageClassName="h-8 w-8 object-contain shrink-0"
            />
            <p className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant">
              Elevating everyday living with curated, premium lifestyle essentials.
            </p>
            <p className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant mt-auto pt-8">
              © 2024 LuxeLife. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label-caps text-label-caps text-surface-bright mb-2">Explore</h4>
            <Link to="/shop" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Shop</Link>
            <Link to="/about" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">About</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label-caps text-label-caps text-surface-bright mb-2">Support</h4>
            <a href="#" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Customer Care</a>
            <Link to="/contact" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Contact</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label-caps text-label-caps text-surface-bright mb-2">Connect</h4>
            <a href="#" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Newsletter</a>
          </div>
        </div>
      </footer>
    )
  }

  if (variant === 'product') {
    return (
      <footer className="bg-primary-container dark:bg-tertiary-container w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter px-margin-mobile md:px-margin-desktop py-16 md:py-section-gap max-w-container-max mx-auto">
          <div className="md:col-span-1 mb-8 md:mb-0">
            <Logo
              className="mb-4"
              textClassName="font-display-lg text-headline-md text-surface-container"
              imageClassName="h-8 w-8 object-contain shrink-0"
            />
            <div className="font-body-md text-body-md text-surface-container-high text-sm">© 2024 LuxeLife. All rights reserved.</div>
          </div>
          <div className="flex flex-col gap-4 font-label-caps text-label-caps">
            <Link to="/shop" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Shop</Link>
            <a href="#" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Customer Care</a>
          </div>
          <div className="flex flex-col gap-4 font-label-caps text-label-caps">
            <Link to="/about" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">About</Link>
            <Link to="/contact" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Contact</Link>
          </div>
          <div className="flex flex-col gap-4 font-label-caps text-label-caps">
            <a href="#" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Newsletter</a>
          </div>
        </div>
      </footer>
    )
  }

  if (variant === 'shop') {
    return (
      <footer className="bg-primary-container dark:bg-tertiary-container w-full">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter px-margin-mobile md:px-margin-desktop py-12 md:py-section-gap max-w-container-max mx-auto">
          <div className="md:col-span-2 mb-8 md:mb-0">
            <Logo
              className="mb-4"
              textClassName="font-display-lg text-headline-md text-surface-container"
              imageClassName="h-8 w-8 object-contain shrink-0"
            />
            <p className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant font-body-md text-body-md max-w-xs">
              Curating the finest in modern minimalism. Elevate your everyday with our exclusive collections.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/shop" className="text-surface-bright font-bold font-label-caps text-label-caps hover:text-surface-bright transition-colors duration-200">Shop</Link>
            <a href="#" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200 font-label-caps text-label-caps">Customer Care</a>
            <Link to="/about" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200 font-label-caps text-label-caps">About</Link>
            <Link to="/contact" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200 font-label-caps text-label-caps">Contact</Link>
            <a href="#" className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200 font-label-caps text-label-caps">Newsletter</a>
          </div>
          <div className="md:col-span-2 flex items-end justify-start md:justify-end mt-8 md:mt-0">
            <p className="text-on-tertiary-container dark:text-on-tertiary-fixed-variant font-body-md text-sm">
              © 2024 LuxeLife. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  }

  // home
  return (
    <footer className="bg-primary-container dark:bg-tertiary-container w-full mt-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto">
        <div className="md:col-span-2 flex flex-col gap-4 pr-8">
          <Logo
            textClassName="font-display-lg text-headline-md text-surface-container"
            imageClassName="h-8 w-8 object-contain shrink-0"
          />
          <p className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant mt-2 max-w-sm">
            Curated products designed to add style, convenience and character to everyday life.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-label-caps text-surface-container opacity-50 mb-2">Shop</span>
          <Link to="/shop" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">New Arrivals</Link>
          <Link to="/shop" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Best Sellers</Link>
          <Link to="/shop" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Categories</Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-label-caps text-surface-container opacity-50 mb-2">Support</span>
          <a href="#" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Customer Care</a>
          <Link to="/contact" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Contact Us</Link>
          <Link to="/faq" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">FAQ</Link>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-label-caps text-label-caps text-surface-container opacity-50 mb-2">Company</span>
          <Link to="/about" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">About</Link>
          <a href="#" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Terms</a>
          <a href="#" className="font-body-md text-body-md text-on-tertiary-container dark:text-on-tertiary-fixed-variant hover:text-surface-bright transition-colors duration-200">Privacy</a>
        </div>
      </div>
      <div className="border-t border-on-tertiary-container/20 px-margin-mobile md:px-margin-desktop py-6 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-body-md text-body-md text-on-tertiary-container text-sm">© 2024 LuxeLife. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-on-tertiary-container hover:text-surface-bright cursor-pointer transition-colors">language</span>
        </div>
      </div>
    </footer>
  )
}
