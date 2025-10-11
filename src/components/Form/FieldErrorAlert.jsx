import Alert from '@mui/material/Alert'
import { useTranslation } from 'react-i18next'

function FieldErrorAlert({ errors, fieldName }) {
  const { t } = useTranslation()

  if (!errors || !errors[fieldName]) return null
  const rawMessage = errors[fieldName]?.message

  return (
    <Alert
      severity="error"
      sx={{
        backgroundColor: 'transparent',
        fontSize: '0.85rem',
        mt: 0.5,
        p: 0,
        '.MuiAlert-icon': {
          fontSize: '1.1rem',
          mr: 0.8,
          ml: 0
        },
        '.MuiAlert-message': {
          overflow: 'hidden',
          padding: 0,
          mt: 0.8
        }
      }}
    >
      {t(rawMessage)}
    </Alert>
  )
}

export default FieldErrorAlert
