import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { useAdminAuth } from '../context/AdminAuthContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { to: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
]

function usePageTitle(): string {
  const { pathname } = useLocation()
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
    `flex items-center gap-3 px-4 py-3 rounded font-label-caps text-label-caps text-[11px] tracking-wider transition-colors ${
      isActive
        ? 'bg-white/[0.12] text-on-primary border-l-[3px] border-inverse-primary pl-[13px]'
        : 'text-on-primary-container hover:bg-white/[0.06] hover:text-on-primary border-l-[3px] border-transparent pl-[13px]'
    }`

  const sidebar = (
    <>
      <div className="p-5 border-b border-on-primary/10">
        <Logo
          to="/admin"
          className="block"
          textClassName="font-headline-md text-headline-md text-surface-container"
          imageClassName="h-8 w-8 object-contain shrink-0"
        />
        <span className="font-label-caps text-label-caps text-on-primary-container text-[10px] tracking-widest mt-1 block">
          ADMIN
        </span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-on-primary/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 text-on-primary-container hover:text-surface-bright font-label-sm text-label-sm transition-colors rounded hover:bg-on-primary/10"
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          View Store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 text-on-primary-container hover:text-surface-bright font-label-sm text-label-sm transition-colors w-full rounded hover:bg-on-primary/10"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-warm-ivory flex font-body-md">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,16rem)] bg-primary-container text-on-primary flex flex-col shrink-0 transform transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:w-64 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="bg-surface border-b border-outline/15 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              className="lg:hidden p-2 -ml-2 text-primary hover:bg-surface-container-low rounded"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-primary truncate">{pageTitle}</h1>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface border-t border-outline/15 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-3">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 text-[10px] font-label-caps tracking-wider transition-colors ${
                    isActive ? 'text-primary' : 'text-secondary'
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
