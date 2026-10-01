import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { CartProvider } from './context/CartContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { CartDrawer } from './components/CartDrawer'
import { Cursor } from './components/Cursor'
import { EASE_EDITORIAL } from './components/motion/ease'
import { SmoothScroll } from './components/motion/SmoothScroll'
import HomePage from './pages/HomePage'

const ShopAllPage = lazy(() => import('./pages/ShopAllPage'))
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const ShippingReturnsPage = lazy(() => import('./pages/ShippingReturnsPage'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminLoginPage = lazy(() => import('./admin/AdminLoginPage'))
const AdminProtectedRoute = lazy(() => import('./admin/AdminProtectedRoute'))
const AdminDashboardPage = lazy(() => import('./admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('./admin/AdminProductsPage'))
const AdminProductFormPage = lazy(() => import('./admin/AdminProductFormPage'))
const AdminOrdersPage = lazy(() => import('./admin/AdminOrdersPage'))
const AdminCategoriesPage = lazy(() => import('./admin/AdminCategoriesPage'))
const AdminCategoryFormPage = lazy(() => import('./admin/AdminCategoryFormPage'))
const AdminOrderDetailPage = lazy(() => import('./admin/AdminOrderDetailPage'))

function PageFallback() {
  return <div className="min-h-screen bg-white" aria-busy="true" />
}

function AnimatedRoutes() {
  const location = useLocation()
  const lenis = useLenis()
  // Admin pages share one layout; don't replay the transition between them.
  const key = location.pathname.startsWith('/admin') ? 'admin' : location.pathname

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => (lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0))}
    >
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_EDITORIAL } }}
        exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopAllPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:slug" element={<CategoryPage />} />
            <Route path="/gifts" element={<CategoryPage edit="gifts" />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/shipping-returns" element={<ShippingReturnsPage />} />

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/new" element={<AdminProductFormPage />} />
                <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="categories/new" element={<AdminCategoryFormPage />} />
                <Route path="categories/:slug/edit" element={<AdminCategoryFormPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="orders/:id" element={<AdminOrderDetailPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          <CartProvider>
            <WishlistProvider>
              <AdminAuthProvider>
                <AnimatedRoutes />
                <CartDrawer />
                <Cursor />
              </AdminAuthProvider>
            </WishlistProvider>
          </CartProvider>
        </SmoothScroll>
      </MotionConfig>
    </BrowserRouter>
  )
}
