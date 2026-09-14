import axios from 'axios'
import type { AuthRequest, AuthResponse, Employee, EmployeePayload } from './types'

const TOKEN_KEY = 'employee_token'
const ROLE_KEY = 'employee_role'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredRole(): string | null {
  return localStorage.getItem(ROLE_KEY)
}

export function saveAuthSession(token: string, role: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ROLE_KEY, role)
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
}

const client = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession()
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>('/auth/login', { username, password } as AuthRequest)
    return response.data
  },
  async register(username: string, password: string, role?: string): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>('/auth/register', { username, password, role } as AuthRequest)
    return response.data
  },
}

export const employeeApi = {
  async list(): Promise<Employee[]> {
    const response = await client.get<Employee[]>('/employees')
    return response.data
  },
  async get(id: number): Promise<Employee> {
    const response = await client.get<Employee>(`/employees/${id}`)
    return response.data
  },
  async create(payload: EmployeePayload): Promise<Employee> {
    const response = await client.post<Employee>('/employees', payload)
    return response.data
  },
  async update(id: number, payload: EmployeePayload): Promise<Employee> {
    const response = await client.put<Employee>(`/employees/${id}`, payload)
    return response.data
  },
  async remove(id: number): Promise<void> {
    await client.delete(`/employees/${id}`)
  },
}
