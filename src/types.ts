export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  department: string
  jobTitle: string
  salary: number
  joiningDate: string
}

export type EmployeePayload = Omit<Employee, 'id'>

export interface ApiError {
  status?: number
  error?: string
  message?: string
}

export interface AuthRequest {
  username: string
  password: string
  role?: string
}

export interface AuthResponse {
  token: string
  role: string
  message: string
}
