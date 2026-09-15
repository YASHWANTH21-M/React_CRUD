import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

interface ConfirmationDialogProps {
  open: boolean
  title: string
  message: string
  busy?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmationDialog({ open, title, message, busy = false, onCancel, onConfirm }: ConfirmationDialogProps) {
  return <Dialog open={open} onClose={() => !busy && onCancel()}><DialogTitle>{title}</DialogTitle><DialogContent><Typography color="text.secondary">{message}</Typography></DialogContent><DialogActions><Button onClick={onCancel} disabled={busy}>Cancel</Button><Button color="error" variant="contained" onClick={onConfirm} disabled={busy}>{busy ? 'Deleting...' : 'Delete'}</Button></DialogActions></Dialog>
}
