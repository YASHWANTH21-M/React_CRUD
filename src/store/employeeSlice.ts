import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { employeeApi } from '../api'
import type { ApiError, Employee, EmployeePayload } from '../types'

interface EmployeeState {
  employees: Employee[]
  selectedEmployee: Employee | null
  loading: boolean
  error: string | null
  success: string | null
}

const initialState: EmployeeState = {
  employees: [], selectedEmployee: null, loading: false, error: null, success: null,
}

function messageFor(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const status = error.response?.status
    const fallback = status === 400 ? 'The submitted employee data is invalid.'
      : status === 401 ? 'Your session has expired. Please log in again.'
        : status === 403 ? 'You are not allowed to perform this action.'
          : status === 404 ? 'The employee was not found.'
            : status === 409 ? 'An employee with that email already exists.'
              : 'The server could not complete that request.'
    return error.response?.data?.message || fallback
  }
  return 'Something went wrong. Please try again.'
}

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (_, { rejectWithValue }) => {
  try { return await employeeApi.list() } catch (error) { return rejectWithValue(messageFor(error)) }
})

export const fetchEmployee = createAsyncThunk('employees/fetchOne', async (id: number, { rejectWithValue }) => {
  try { return await employeeApi.get(id) } catch (error) { return rejectWithValue(messageFor(error)) }
})

export const createEmployee = createAsyncThunk('employees/create', async (payload: EmployeePayload, { rejectWithValue }) => {
  try { return await employeeApi.create(payload) } catch (error) { return rejectWithValue(messageFor(error)) }
})

export const updateEmployee = createAsyncThunk('employees/update', async ({ id, payload }: { id: number; payload: EmployeePayload }, { rejectWithValue }) => {
  try { return await employeeApi.update(id, payload) } catch (error) { return rejectWithValue(messageFor(error)) }
})

export const deleteEmployee = createAsyncThunk('employees/delete', async (id: number, { rejectWithValue }) => {
  try { await employeeApi.remove(id); return id } catch (error) { return rejectWithValue(messageFor(error)) }
})

const employeeSlice = createSlice({
  name: 'employees', initialState, reducers: {
    clearEmployeeMessages(state) { state.error = null; state.success = null },
    clearSelectedEmployee(state) { state.selectedEmployee = null },
  }, extraReducers: (builder) => {
    builder.addCase(fetchEmployees.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => { state.loading = false; state.employees = action.payload })
      .addCase(fetchEmployees.rejected, (state, action) => { state.loading = false; state.error = String(action.payload || 'Unable to load employees.') })
      .addCase(fetchEmployee.fulfilled, (state, action: PayloadAction<Employee>) => { state.selectedEmployee = action.payload })
      .addCase(fetchEmployee.rejected, (state, action) => { state.error = String(action.payload || 'Unable to load the employee.') })
      .addCase(createEmployee.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(createEmployee.fulfilled, (state, action: PayloadAction<Employee>) => { state.loading = false; state.employees.push(action.payload); state.success = 'Employee added successfully' })
      .addCase(createEmployee.rejected, (state, action) => { state.loading = false; state.error = String(action.payload || 'Unable to add the employee.') })
      .addCase(updateEmployee.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => { state.loading = false; state.employees = state.employees.map((item) => item.id === action.payload.id ? action.payload : item); state.success = 'Employee updated successfully' })
      .addCase(updateEmployee.rejected, (state, action) => { state.loading = false; state.error = String(action.payload || 'Unable to update the employee.') })
      .addCase(deleteEmployee.pending, (state) => { state.loading = true; state.error = null; state.success = null })
      .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<number>) => { state.loading = false; state.employees = state.employees.filter((item) => item.id !== action.payload); state.success = 'Employee deleted successfully' })
      .addCase(deleteEmployee.rejected, (state, action) => { state.loading = false; state.error = String(action.payload || 'Unable to delete the employee.') })
  },
})

export const { clearEmployeeMessages, clearSelectedEmployee } = employeeSlice.actions
export default employeeSlice.reducer
