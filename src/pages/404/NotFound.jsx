import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Footer from '~/components/Footer/Footer'

const NotFound = () => {
  const { t } = useTranslation()

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

        <Link to='/' style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              mt: 3,
              fontSize: '18px',
              color: (theme) =>
                theme.palette.mode === 'dark'
                  ? theme.palette.info.light
                  : theme.palette.info.main,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {t('go_home_link')}
          </Box>
        </Link>

        <Footer lineWidth={100} />
      </Box>
    </Box>
  )
}

export default NotFound
