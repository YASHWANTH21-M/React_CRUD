import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { authApi, clearAuthSession, getStoredRole, getStoredToken, saveAuthSession } from '../api'

interface AuthContextValue {
  token: string | null
  username: string | null
  role: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string, role: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const USERNAME_KEY = 'employee_username'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(getStoredToken())
  const [username, setUsername] = useState(localStorage.getItem(USERNAME_KEY))
  const [role, setRole] = useState(getStoredRole())

  const login = async (name: string, password: string) => {
    const response = await authApi.login(name, password)
    saveAuthSession(response.token, response.role)
    localStorage.setItem(USERNAME_KEY, name)
    setToken(response.token); setRole(response.role); setUsername(name)
  }

  const register = async (name: string, password: string, requestedRole: string) => {
    const response = await authApi.register(name, password, requestedRole)
    saveAuthSession(response.token, response.role)
    localStorage.setItem(USERNAME_KEY, name)
    setToken(response.token); setRole(response.role); setUsername(name)
  }

  const logout = () => {
    clearAuthSession(); localStorage.removeItem(USERNAME_KEY)
    setToken(null); setRole(null); setUsername(null)
  }

  const value = useMemo(() => ({ token, username, role, isAuthenticated: Boolean(token), login, register, logout }), [token, username, role])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
