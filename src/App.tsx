import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import axios from 'axios'
import {
  Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider,
  FormControl, IconButton, InputLabel, MenuItem, Select, Snackbar, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Toolbar, Tooltip, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { employeeApi } from './api'
import type { ApiError, Employee, EmployeePayload } from './types'
import './App.css'

const emptyForm: EmployeePayload = { firstName: '', lastName: '', email: '', phoneNumber: '', department: '', jobTitle: '', salary: 0, joiningDate: '' }
const departments = ['Engineering', 'Finance', 'Human Resources', 'Marketing', 'Operations', 'Sales']
type FieldErrors = Partial<Record<keyof EmployeePayload, string>>

function errorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) return error.response?.data?.message || 'The server could not complete that request.'
  return 'Something went wrong. Please try again.'
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [form, setForm] = useState<EmployeePayload>(emptyForm)
  const [formErrors, setFormErrors] = useState<FieldErrors>({})

  const loadEmployees = async () => {
    setLoading(true); setError('')
    try { setEmployees(await employeeApi.list()) } catch (loadError) { setError(errorMessage(loadError)) } finally { setLoading(false) }
  }
  useEffect(() => { void loadEmployees() }, [])

  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const text = `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.jobTitle}`.toLowerCase()
    return text.includes(search.toLowerCase()) && (department === 'all' || employee.department === department)
  }), [employees, search, department])
  const payroll = employees.reduce((sum, employee) => sum + Number(employee.salary), 0)
  const activeDepartments = new Set(employees.map((employee) => employee.department)).size

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormErrors({}); setDialogOpen(true) }
  const openEdit = (employee: Employee) => {
    setEditing(employee)
    setForm({ firstName: employee.firstName, lastName: employee.lastName, email: employee.email, phoneNumber: employee.phoneNumber, department: employee.department, jobTitle: employee.jobTitle, salary: employee.salary, joiningDate: employee.joiningDate })
    setFormErrors({}); setDialogOpen(true)
  }
  const updateField = (field: keyof EmployeePayload, value: string | number) => setForm((current) => ({ ...current, [field]: value }))
  const validate = () => {
    const next: FieldErrors = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!/^\d{10}$/.test(form.phoneNumber)) next.phoneNumber = 'Use exactly 10 digits'
    if (!form.department) next.department = 'Choose a department'
    if (!form.jobTitle.trim()) next.jobTitle = 'Job title is required'
    if (!form.salary || Number(form.salary) <= 0) next.salary = 'Salary must be greater than zero'
    if (!form.joiningDate) next.joiningDate = 'Joining date is required'
    setFormErrors(next); return Object.keys(next).length === 0
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!validate()) return
    setSaving(true); setError('')
    try {
      if (editing) { await employeeApi.update(editing.id, form); setNotice('Employee updated successfully') }
      else { await employeeApi.create(form); setNotice('Employee added successfully') }
      setDialogOpen(false); await loadEmployees()
    } catch (saveError) { setError(errorMessage(saveError)) } finally { setSaving(false) }
  }
  const remove = async () => {
    if (!deleteTarget) return
    setSaving(true); setError('')
    try { await employeeApi.remove(deleteTarget.id); setNotice('Employee deleted successfully'); setDeleteTarget(null); await loadEmployees() }
    catch (deleteError) { setError(errorMessage(deleteError)) } finally { setSaving(false) }
  }

  return <Box className="app-shell">
    <Box className="topbar"><Container maxWidth="xl"><Stack direction="row" alignItems="center" py={2}><Stack direction="row" spacing={1.5} alignItems="center"><Box className="brand-mark"><GroupsOutlinedIcon /></Box><Typography className="brand-wordmark">TEAM / 01</Typography></Stack></Stack></Container></Box>
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Box className="hero-panel"><Box><Typography className="eyebrow">People directory / September 2026</Typography><Typography variant="h4">Make every teammate<br /><span className="hero-accent">count.</span></Typography><Typography color="text.secondary" mt={1.5} maxWidth={470}>A clear, calm space for the people who move your work forward.</Typography></Box><Box className="hero-orbit" aria-hidden="true"><Box className="orbit-core"><GroupsOutlinedIcon /></Box><Box className="orbit-ring ring-one" /><Box className="orbit-ring ring-two" /></Box></Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} mb={4}><Box><Typography className="section-label">TEAM SNAPSHOT</Typography><Typography color="text.secondary" mt={0.5}>Manage your team records and keep employee data up to date.</Typography></Box><Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add employee</Button></Stack>
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
      <Box className="stats-grid" mb={4}><StatCard label="Total employees" value={employees.length.toString()} icon={<GroupsOutlinedIcon />} tone="blue" /><StatCard label="Departments" value={activeDepartments.toString()} icon={<TrendingUpIcon />} tone="teal" /><StatCard label="Annual payroll" value={`$${payroll.toLocaleString()}`} icon={<Typography fontWeight={800}>$</Typography>} tone="amber" /></Box>
      <Card className="table-card"><Toolbar sx={{ px: { xs: 2, md: 3 }, py: 1.5, gap: 1.5, flexWrap: 'wrap' }}><Typography component="div" fontWeight={750} sx={{ mr: 'auto' }}>Employee directory <Chip size="small" label={filteredEmployees.length} sx={{ ml: 1, fontWeight: 700 }} /></Typography><TextField size="small" placeholder="Search people..." value={search} onChange={(event) => setSearch(event.target.value)} InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }} sx={{ width: { xs: '100%', sm: 220 } }} /><FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Department</InputLabel><Select value={department} label="Department" onChange={(event) => setDepartment(event.target.value)}><MenuItem value="all">All departments</MenuItem>{departments.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl><Tooltip title="Refresh employees"><IconButton onClick={() => void loadEmployees()}><RefreshIcon /></IconButton></Tooltip></Toolbar><Divider />
        <TableContainer><Table sx={{ minWidth: 760 }}><TableHead><TableRow><TableCell>Employee</TableCell><TableCell>Department</TableCell><TableCell>Job title</TableCell><TableCell>Phone</TableCell><TableCell>Salary</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{loading ? <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={28} sx={{ my: 5 }} /></TableCell></TableRow> : filteredEmployees.length === 0 ? <TableRow><TableCell colSpan={6} align="center"><Typography color="text.secondary" py={6}>No employees match your filters.</Typography></TableCell></TableRow> : filteredEmployees.map((employee) => <TableRow hover key={employee.id}><TableCell><Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }}>{`${employee.firstName[0] || ''}${employee.lastName[0] || ''}`.toUpperCase()}</Avatar><Box><Typography fontWeight={650}>{employee.firstName} {employee.lastName}</Typography><Typography variant="body2" color="text.secondary">{employee.email}</Typography></Box></Stack></TableCell><TableCell><Chip label={employee.department} size="small" color="primary" variant="outlined" /></TableCell><TableCell>{employee.jobTitle}</TableCell><TableCell>{employee.phoneNumber}</TableCell><TableCell>${Number(employee.salary).toLocaleString()}</TableCell><TableCell align="right"><Tooltip title="Edit employee"><IconButton color="primary" onClick={() => openEdit(employee)}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete employee"><IconButton color="error" onClick={() => setDeleteTarget(employee)}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip></TableCell></TableRow>)}</TableBody></Table></TableContainer></Card>
    </Container>
    <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm"><Box component="form" onSubmit={submit}><DialogTitle>{editing ? 'Edit employee' : 'Add employee'}<Typography variant="body2" color="text.secondary" mt={0.5}>{editing ? 'Update this employee record.' : 'Create a new employee record.'}</Typography></DialogTitle><DialogContent dividers><Box className="form-grid"><TextField label="First name" value={form.firstName} onChange={(event) => updateField('firstName', event.target.value)} error={Boolean(formErrors.firstName)} helperText={formErrors.firstName} required /><TextField label="Last name" value={form.lastName} onChange={(event) => updateField('lastName', event.target.value)} error={Boolean(formErrors.lastName)} helperText={formErrors.lastName} required /><TextField label="Email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} error={Boolean(formErrors.email)} helperText={formErrors.email} required /><TextField label="Phone number" value={form.phoneNumber} onChange={(event) => updateField('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 10))} error={Boolean(formErrors.phoneNumber)} helperText={formErrors.phoneNumber || '10 digits'} required /><FormControl error={Boolean(formErrors.department)} required><InputLabel>Department</InputLabel><Select label="Department" value={form.department} onChange={(event) => updateField('department', event.target.value)}>{departments.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select>{formErrors.department && <Typography variant="caption" color="error" mt={0.5}>{formErrors.department}</Typography>}</FormControl><TextField label="Job title" value={form.jobTitle} onChange={(event) => updateField('jobTitle', event.target.value)} error={Boolean(formErrors.jobTitle)} helperText={formErrors.jobTitle} required /><TextField label="Annual salary" type="number" value={form.salary || ''} onChange={(event) => updateField('salary', Number(event.target.value))} error={Boolean(formErrors.salary)} helperText={formErrors.salary} required /><TextField label="Joining date" type="date" value={form.joiningDate} onChange={(event) => updateField('joiningDate', event.target.value)} error={Boolean(formErrors.joiningDate)} helperText={formErrors.joiningDate} InputLabelProps={{ shrink: true }} required /></Box></DialogContent><DialogActions sx={{ px: 3, py: 2 }}><Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button><Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}>{editing ? 'Save changes' : 'Add employee'}</Button></DialogActions></Box></Dialog>
    <Dialog open={Boolean(deleteTarget)} onClose={() => !saving && setDeleteTarget(null)}><DialogTitle>Delete employee?</DialogTitle><DialogContent><Typography color="text.secondary">This will permanently remove {deleteTarget?.firstName} {deleteTarget?.lastName} from the directory.</Typography></DialogContent><DialogActions><Button onClick={() => setDeleteTarget(null)} disabled={saving}>Cancel</Button><Button color="error" variant="contained" onClick={() => void remove()} disabled={saving}>{saving ? 'Deleting...' : 'Delete'}</Button></DialogActions></Dialog>
    <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice('')} message={notice} />
  </Box>
}

function StatCard({ label, value, icon, tone }: { label: string; value: string; icon: ReactNode; tone: 'blue' | 'teal' | 'amber' }) {
  return <Card className={`stat-card ${tone}`}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h5" fontWeight={800} mt={1}>{value}</Typography></Box><Box className="stat-icon">{icon}</Box></Stack></CardContent></Card>
}

export default App
