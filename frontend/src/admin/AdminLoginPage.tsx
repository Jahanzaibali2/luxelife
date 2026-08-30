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
    <div className="min-h-screen bg-primary-container flex items-center justify-center px-4 font-body-md">
      <div className="w-full max-w-md bg-surface p-8 md:p-12 rounded border border-outline/15">
        <div className="text-center mb-8">
          <Logo
            to="/"
            className="justify-center flex-col mb-2"
            imageClassName="h-12 w-12 object-contain shrink-0"
            textClassName="font-display-lg text-headline-lg text-primary"
          />
          <p className="font-label-caps text-label-caps text-secondary tracking-widest">ADMIN LOGIN</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label-caps text-label-caps text-secondary mb-2" htmlFor="username">
              Admin ID
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-outline/30 bg-transparent py-2 font-body-md focus:border-primary focus:ring-0 focus:outline-none"
              placeholder="Enter admin ID"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block font-label-caps text-label-caps text-secondary mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-outline/30 bg-transparent py-2 font-body-md focus:border-primary focus:ring-0 focus:outline-none"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-4 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
