import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid ID or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-shell min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,#F4ECDF,transparent_60%)]">
      <div className="admin-card w-full max-w-sm p-6 sm:p-8">
        <div className="text-center mb-7">
          <Logo
            to="/"
            className="inline-flex justify-center flex-col items-center gap-2 mb-3"
            imageClassName="h-11 w-11 object-contain shrink-0"
            textClassName="admin-wordmark text-[32px] leading-none text-admin-ink"
          />
          <h1 className="admin-card-title">Welcome back</h1>
          <p className="admin-hint mt-0.5">Sign in to the admin panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="admin-label" htmlFor="username">
              Admin ID
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input"
              placeholder="Enter admin ID"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-[13px] bg-admin-red-tint text-admin-red-ink px-4 py-3 rounded-[10px]" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary w-full !h-11 mt-2"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
