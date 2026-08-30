import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import HomePage from './pages/HomePage'

const ShopAllPage = lazy(() => import('./pages/ShopAllPage'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminLoginPage = lazy(() => import('./admin/AdminLoginPage'))
const AdminProtectedRoute = lazy(() => import('./admin/AdminProtectedRoute'))
const AdminDashboardPage = lazy(() => import('./admin/AdminDashboardPage'))
const AdminProductsPage = lazy(() => import('./admin/AdminProductsPage'))
const AdminProductFormPage = lazy(() => import('./admin/AdminProductFormPage'))
const AdminOrdersPage = lazy(() => import('./admin/AdminOrdersPage'))
const AdminOrderDetailPage = lazy(() => import('./admin/AdminOrderDetailPage'))

function PageFallback() {
  return <div className="min-h-screen bg-warm-ivory" aria-busy="true" />
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AdminAuthProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopAllPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="products/new" element={<AdminProductFormPage />} />
                  <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AdminAuthProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
