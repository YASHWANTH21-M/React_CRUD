import { memo } from 'react'
import { Avatar, Box, Chip, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import type { Employee } from '../types'
import { Loading } from './Loading'

interface EmployeeTableProps {
  employees: Employee[]
  loading: boolean
  canManage: boolean
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

export const EmployeeTable = memo(function EmployeeTable({ employees, loading, canManage, onEdit, onDelete }: EmployeeTableProps) {
  return <TableContainer><Table sx={{ minWidth: 760 }}><TableHead><TableRow><TableCell>Employee</TableCell><TableCell>Department</TableCell><TableCell>Job title</TableCell><TableCell>Phone</TableCell><TableCell>Salary</TableCell>{canManage && <TableCell align="right">Actions</TableCell>}</TableRow></TableHead><TableBody>{loading ? <TableRow><TableCell colSpan={canManage ? 6 : 5}><Loading label="Loading employees..." /></TableCell></TableRow> : employees.length === 0 ? <TableRow><TableCell colSpan={canManage ? 6 : 5} align="center"><Typography color="text.secondary" py={6}>No employees match your filters.</Typography></TableCell></TableRow> : employees.map((employee) => <TableRow hover key={employee.id}><TableCell><Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 700 }}>{`${employee.firstName[0] || ''}${employee.lastName[0] || ''}`.toUpperCase()}</Avatar><Box><Typography fontWeight={650}>{employee.firstName} {employee.lastName}</Typography><Typography variant="body2" color="text.secondary">{employee.email}</Typography></Box></Stack></TableCell><TableCell><Chip label={employee.department} size="small" color="primary" variant="outlined" /></TableCell><TableCell>{employee.jobTitle}</TableCell><TableCell>{employee.phoneNumber}</TableCell><TableCell>${Number(employee.salary).toLocaleString()}</TableCell>{canManage && <TableCell align="right"><Tooltip title="Edit employee"><IconButton color="primary" aria-label="Edit" onClick={() => onEdit(employee)}><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip><Tooltip title="Delete employee"><IconButton color="error" aria-label="Delete" onClick={() => onDelete(employee)}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip></TableCell>}</TableRow>)}</TableBody></Table></TableContainer>
})
