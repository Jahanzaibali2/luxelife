import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { adminApi } from '../lib/api'

interface AdminAuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('luxelife-admin-token'),
  )

  const login = useCallback(async (username: string, password: string) => {
    const { token: newToken } = await adminApi.login(username, password)
    localStorage.setItem('luxelife-admin-token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('luxelife-admin-token')
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token, login, logout],
  )

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
