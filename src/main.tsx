import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { store } from './store'

const theme = createTheme({
  palette: {
    primary: { main: '#2d6cdf' },
    secondary: { main: '#f07167' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    h4: { fontWeight: 750, letterSpacing: '-0.03em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 700, color: '#64748b' } } },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
