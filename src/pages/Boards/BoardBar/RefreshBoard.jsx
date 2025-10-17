import { Box, Tooltip, Typography } from '@mui/material'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled'
import { useTranslation } from 'react-i18next'

const RefreshBoard = ({ handleRefresh }) => {
  const { t } = useTranslation()

  return (
    <Tooltip arrow title={t('refresh_board')}>
      <Box
        onClick={handleRefresh}
        sx={{
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.12)'
          }
        }}
      >
        <ReplayCircleFilledIcon fontSize="small" />
        <Typography variant="body2" fontWeight={500}>
          {t('refresh')}
        </Typography>
      </Box>
    </Tooltip>
  )
}

export default RefreshBoard
