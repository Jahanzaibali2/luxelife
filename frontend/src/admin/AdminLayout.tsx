import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { to: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
]

export default function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-warm-ivory flex font-body-md">
      <aside className="w-64 bg-primary-container text-on-primary flex flex-col shrink-0">
        <div className="p-6 border-b border-on-primary/10">
          <Link to="/admin" className="font-headline-md text-headline-md text-surface-container block">
            LuxeLife
          </Link>
          <span className="font-label-caps text-label-caps text-on-primary-container text-[10px] tracking-widest mt-1 block">
            ADMIN
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded font-label-caps text-label-caps text-[11px] tracking-wider transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-on-primary-container hover:bg-on-primary/10 hover:text-surface-bright'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-on-primary/10 space-y-2">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-on-primary-container hover:text-surface-bright font-label-sm text-label-sm transition-colors">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            View Store
          </Link>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-on-primary-container hover:text-surface-bright font-label-sm text-label-sm transition-colors w-full">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-surface border-b border-outline/15 px-8 py-4 sticky top-0 z-10">
          <h1 className="font-headline-md text-headline-md text-primary">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
