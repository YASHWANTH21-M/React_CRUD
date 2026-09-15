import { CircularProgress, Stack, Typography } from '@mui/material'

export function Loading({ label = 'Loading...' }: { label?: string }) {
  return <Stack alignItems="center" spacing={1} sx={{ py: 6 }}><CircularProgress size={28} /><Typography color="text.secondary">{label}</Typography></Stack>
}
