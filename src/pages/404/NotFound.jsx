import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Footer from '~/components/Footer/Footer'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='h5' sx={{ fontWeight: '500' }}>
          {t('not_found_title')}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            mt: 2
          }}
        >
          {t('go_home_link')}
        </Button>
        <Footer lineWidth={100} />
      </Box>
    </Box>
  )
}

export default NotFound
