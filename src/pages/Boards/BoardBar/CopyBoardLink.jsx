import { Box, Tooltip, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

const CopyBoardLink = ({ handleCopyBoardLink, copyStatus }) => {
  const { t } = useTranslation()

  return (
    <Tooltip arrow title={t('copy_board_link')}>
      <Box
        onClick={handleCopyBoardLink}
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
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.12)'
          }
        }}
      >
        {copyStatus ? (
          <>
            <CheckIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              {t('copied')}
            </Typography>
          </>
        ) : (
          <>
            <ContentCopyIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              {t('copy_link')}
            </Typography>
          </>
        )}
      </Box>
    </Tooltip>
  )
}

export default CopyBoardLink
