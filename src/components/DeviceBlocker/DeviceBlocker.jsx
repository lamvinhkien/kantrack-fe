import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PhonelinkOffIcon from '@mui/icons-material/PhonelinkOff'
import { useTranslation } from 'react-i18next'

const DeviceBlocker = ({ children }) => {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(width < 768 && isTouch)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  if (isMobile) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme => theme.palette.background.default,
          color: theme => theme.palette.text.primary,
          px: 3,
          textAlign: 'center'
        }}
      >
        <PhonelinkOffIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {t('deviceBlocker_title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={400}>
          {t('deviceBlocker_description')}
        </Typography>
      </Box>
    )
  }

  return children
}

export default DeviceBlocker
