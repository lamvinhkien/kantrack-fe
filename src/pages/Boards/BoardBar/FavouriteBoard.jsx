import { Box, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'

const FavouriteBoard = ({ handleFavourite, favourite = false }) => {
  const { t } = useTranslation()

  return (
    <Tooltip arrow title={favourite ? t('un_favourite_board') : t('favourite_board')}>
      <Box
        onClick={handleFavourite}
        sx={{
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          cursor: 'pointer',
          textWrap: 'nowrap',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' }
        }}
      >
        {favourite ? (
          <>
            <StarIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              {t('un_favourite')}
            </Typography>
          </>
        ) : (
          <>
            <StarBorderIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              {t('favourite')}
            </Typography>
          </>
        )}
      </Box>
    </Tooltip>
  )
}

export default FavouriteBoard
