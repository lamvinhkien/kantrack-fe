import { useState } from 'react'
import { Box, Tooltip, Menu, MenuItem, Typography, ListItemIcon, ListItemText, Divider } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import { useTranslation } from 'react-i18next'

const BoardType = ({ boardType, onChangeBoardType }) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (type) => {
    if (type !== boardType) {
      onChangeBoardType?.(type)
    }
    handleClose()
  }

  const isPublic = boardType === 'public'

  return (
    <>
      <Tooltip title={isPublic ? t('public_board') : t('private_board')}>
        <Box
          onClick={handleClick}
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
          {isPublic ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />}
          <Typography variant="body2" fontWeight={500}>
            {boardType === 'public' ? t('public') : t('private')}
          </Typography>
        </Box>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: '4px 0px 10px 0px', textAlign: 'center' }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {t('change_visibility')}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleSelect('public')}>
          <ListItemIcon>
            <PublicIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={t('public')}
            secondary={t('des_public')}
          />
        </MenuItem>
        <MenuItem onClick={() => handleSelect('private')}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={t('private')}
            secondary={t('des_private')}
          />
        </MenuItem>
      </Menu>
    </>
  )
}

export default BoardType
