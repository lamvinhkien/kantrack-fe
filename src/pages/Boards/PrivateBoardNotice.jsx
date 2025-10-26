import { Box, Button, Typography } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const PrivateBoardNotice = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: (theme) => theme.kantrack.pageWithoutAppBarHeight,
        textAlign: 'center',
        px: 2
      }}
    >
      <LockIcon sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
        {t('private_board_title')}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, maxWidth: 480, opacity: 0.8 }}>
        {t('private_board_description')}
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/boards')}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2
        }}
      >
        {t('back_to_board')}
      </Button>
    </Box>
  )
}

export default PrivateBoardNotice
