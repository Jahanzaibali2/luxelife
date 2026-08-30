import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import HomePage from './pages/HomePage'
import ShopAllPage from './pages/ShopAllPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import AdminLayout from './admin/AdminLayout'
import AdminLoginPage from './admin/AdminLoginPage'
import AdminProtectedRoute from './admin/AdminProtectedRoute'
import AdminDashboardPage from './admin/AdminDashboardPage'
import AdminProductsPage from './admin/AdminProductsPage'
import AdminProductFormPage from './admin/AdminProductFormPage'
import AdminOrdersPage from './admin/AdminOrdersPage'
import AdminOrderDetailPage from './admin/AdminOrderDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AdminAuthProvider>
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
        </AdminAuthProvider>
      </CartProvider>
    </BrowserRouter>
  )
}
