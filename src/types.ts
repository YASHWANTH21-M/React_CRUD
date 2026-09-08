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
