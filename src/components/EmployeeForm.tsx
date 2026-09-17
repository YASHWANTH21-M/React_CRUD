import { useState, type FormEvent } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import type { EmployeePayload } from '../types'

const departments = ['Engineering', 'Finance', 'Human Resources', 'Marketing', 'Operations', 'Sales']
const emptyForm: EmployeePayload = { firstName: '', lastName: '', email: '', phoneNumber: '', department: '', jobTitle: '', salary: 0, joiningDate: '' }
type FieldErrors = Partial<Record<keyof EmployeePayload, string>>

interface EmployeeFormProps { open: boolean; employee?: EmployeePayload | null; busy: boolean; onClose: () => void; onSubmit: (payload: EmployeePayload) => void }

export function EmployeeForm({ open, employee, busy, onClose, onSubmit }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeePayload>(employee || emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const isEditing = Boolean(employee)
  const update = (field: keyof EmployeePayload, value: string | number) => setForm((current) => ({ ...current, [field]: value }))
  const submit = (event: FormEvent) => {
    event.preventDefault(); const next: FieldErrors = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!/^\d{10}$/.test(form.phoneNumber)) next.phoneNumber = 'Use exactly 10 digits'
    if (!form.department) next.department = 'Choose a department'
    if (!form.jobTitle.trim()) next.jobTitle = 'Job title is required'
    if (!form.salary || Number(form.salary) <= 0) next.salary = 'Salary must be greater than zero'
    if (!form.joiningDate) next.joiningDate = 'Joining date is required'
    setErrors(next); if (!Object.keys(next).length) onSubmit(form)
  }
  return <Dialog open={open} onClose={() => !busy && onClose()} fullWidth maxWidth="sm"><Box component="form" onSubmit={submit}><DialogTitle>{isEditing ? 'Edit employee' : 'Add employee'}<Typography variant="body2" color="text.secondary" mt={0.5}>{isEditing ? 'Update this employee record.' : 'Create a new employee record.'}</Typography></DialogTitle><DialogContent dividers><Box className="form-grid"><TextField label="First name" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} error={Boolean(errors.firstName)} helperText={errors.firstName} required /><TextField label="Last name" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} error={Boolean(errors.lastName)} helperText={errors.lastName} required /><TextField label="Email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} error={Boolean(errors.email)} helperText={errors.email} required /><TextField label="Phone number" value={form.phoneNumber} onChange={(event) => update('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 10))} error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber || '10 digits'} required /><FormControl error={Boolean(errors.department)} required fullWidth><InputLabel id="department-label">Department</InputLabel><Select labelId="department-label" id="department" label="Department" value={form.department} onChange={(event) => update('department', event.target.value)} inputProps={{ 'aria-label': 'Department' }} MenuProps={{ disablePortal: true }}>{departments.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select>{errors.department && <Typography variant="caption" color="error" mt={0.5}>{errors.department}</Typography>}</FormControl><TextField label="Job title" value={form.jobTitle} onChange={(event) => update('jobTitle', event.target.value)} error={Boolean(errors.jobTitle)} helperText={errors.jobTitle} required /><TextField label="Annual salary" type="number" value={form.salary || ''} onChange={(event) => update('salary', Number(event.target.value))} error={Boolean(errors.salary)} helperText={errors.salary} required /><TextField label="Joining date" type="date" value={form.joiningDate} onChange={(event) => update('joiningDate', event.target.value)} error={Boolean(errors.joiningDate)} helperText={errors.joiningDate} InputLabelProps={{ shrink: true }} required /></Box></DialogContent><DialogActions><Button onClick={onClose} disabled={busy}>Cancel</Button><Button type="submit" variant="contained" disabled={busy}>{busy ? 'Saving...' : isEditing ? 'Save changes' : 'Add employee'}</Button></DialogActions></Box></Dialog>
}
