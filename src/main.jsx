import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import App from '~/App.jsx'
import theme from '~/theme.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      dialogProps: { maxWidth: 'xs' },
      confirmationButtonProps: { color: 'primary', variant: 'outlined' },
      cancellationButtonProps: { color: 'inherit' },
      allowClose: false,
      buttonOrder: ['confirm', 'cancel']
    }}>
      <CssBaseline />
      <App />
      <ToastContainer position='top-center' theme="colored" autoClose={3500} />
    </ConfirmProvider>
  </CssVarsProvider>
)
