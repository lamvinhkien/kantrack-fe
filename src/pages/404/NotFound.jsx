import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
        <Typography sx={{ fontWeight: '500', fontSize: '1.5rem' }}>
          {t('not_found_title')}
        </Typography>

        <Link to='/' style={{ textDecoration: 'none' }}>
          <Typography
            sx={{
              mt: 1,
              color: (theme) =>
                theme.palette.mode === 'dark'
                  ? theme.palette.info.light
                  : theme.palette.info.main,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {t('go_home_link')}
          </Typography>
        </Link>
      </Box>
    </Box>
  )
}

export default NotFound
