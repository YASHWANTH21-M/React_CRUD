import axios from 'axios'
import type { Employee, EmployeePayload } from './types'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

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
