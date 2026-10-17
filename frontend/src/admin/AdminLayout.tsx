import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { useAdminAuth } from '../context/AdminAuthContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'space_dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { to: '/admin/categories', label: 'Categories', icon: 'category' },
  { to: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
]

function usePageTitle(): string {
  const { pathname } = useLocation()
  if (pathname.includes('/categories/new')) return 'Add Category'
  if (pathname.startsWith('/admin/categories') && pathname.includes('/edit')) return 'Edit Category'
  if (pathname.startsWith('/admin/categories')) return 'Categories'
  if (pathname.includes('/products/new')) return 'Add Product'
  if (pathname.includes('/edit')) return 'Edit Product'
  if (pathname.startsWith('/admin/products')) return 'Products'
  if (/^\/admin\/orders\/[^/]+$/.test(pathname)) return 'Order Detail'
  if (pathname.startsWith('/admin/orders')) return 'Orders'
  return 'Dashboard'
}

export default function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pageTitle = usePageTitle()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 h-10 rounded-[10px] text-[14px] font-medium transition-colors ${
      isActive
        ? 'bg-admin-gold-tint text-admin-gold-ink'
        : 'text-admin-muted hover:bg-admin-canvas hover:text-admin-ink'
    }`

  const sidebar = (
    <>
      <div className="px-5 h-16 flex items-center gap-2 border-b border-admin-border">
        <Logo
          to="/admin"
          className="flex items-center gap-2"
          textClassName="admin-wordmark text-[24px] leading-none text-admin-ink"
          imageClassName="h-7 w-7 object-contain shrink-0"
        />
        <span className="admin-badge bg-admin-gold-tint text-admin-gold-ink text-[11px]">Admin</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Admin">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-admin-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 h-10 rounded-[10px] text-[14px] font-medium text-admin-muted hover:bg-admin-canvas hover:text-admin-ink transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          View Store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 h-10 w-full rounded-[10px] text-[14px] font-medium text-admin-muted hover:bg-admin-red-tint hover:text-admin-red-ink transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="admin-shell min-h-screen flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-admin-ink/30 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,16rem)] bg-white border-r border-admin-border flex flex-col shrink-0 transform transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:w-60 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="bg-white/80 backdrop-blur-md border-b border-admin-border px-4 sm:px-6 lg:px-8 h-16 flex items-center sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Open menu"
              className="admin-icon-btn lg:hidden -ml-2"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <h1 className="admin-title truncate">{pageTitle}</h1>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        <nav
          className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur-md border-t border-admin-border pb-[max(0.25rem,env(safe-area-inset-bottom))]"
          aria-label="Admin"
        >
          <div className="grid grid-cols-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[11px] font-medium transition-colors ${
                    isActive ? 'text-admin-gold-ink' : 'text-admin-muted'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="h-16 lg:hidden shrink-0" aria-hidden />
      </div>
    </div>
  )
}
