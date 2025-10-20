import { useState } from 'react'
import {
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { BOARD_MEMBER_ACTIONS } from '~/utils/constants'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const BoardType = ({ boardType, handleUpdateBoardType }) => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    if (!loading) setAnchorEl(null)
  }

  const handleSelect = async (type) => {
    if (type === boardType || loading) return
    try {
      setLoading(true)
      await handleUpdateBoardType(type)
    } finally {
      setLoading(false)
      setAnchorEl(null)
    }
  }

  const isPublic = boardType === 'public'

  return (
    <>
      <Tooltip arrow title={isPublic ? t('public_board') : t('private_board')}>
        <Box
          onClick={handleClick}
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
          {isPublic ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />}
          <Typography variant="body2" fontWeight={500}>
            {isPublic ? t('public') : t('private')}
          </Typography>
        </Box>
      </Tooltip>

      <BoardPermissionGate
        action={BOARD_MEMBER_ACTIONS.editBoardType}
        fallback={
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                width: 350,
                whiteSpace: 'normal',
                position: 'relative',
                overflow: 'hidden'
              }
            }}
          >
            <Box
              sx={{
                position: 'relative',
                p: '4px 0 10px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ flexGrow: 1, textAlign: 'center' }}
              >
                {t('change_visibility')}
              </Typography>

              <IconButton
                size="small"
                onClick={handleClose}
                sx={{ position: 'absolute', right: 10, top: -1, pointerEvents: 'auto' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider />

            <MenuItem
              disableRipple
              sx={{
                alignItems: 'flex-start',
                cursor: 'not-allowed',
                pointerEvents: 'auto',
                bgcolor: 'transparent !important',
                '&:hover': { bgcolor: 'transparent' },
                '&.Mui-focusVisible': { backgroundColor: 'transparent' },
                '&.Mui-selected': { backgroundColor: 'transparent' },
                '&.Mui-selected:hover': { backgroundColor: 'transparent' },
                '&:active': { backgroundColor: 'transparent' }
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <ListItemIcon>
                <PublicIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={t('public')}
                secondary={t('des_public')}
                secondaryTypographyProps={{
                  sx: { whiteSpace: 'normal', wordBreak: 'break-word' }
                }}
              />
            </MenuItem>

            <MenuItem
              disableRipple
              sx={{
                alignItems: 'flex-start',
                cursor: 'not-allowed',
                pointerEvents: 'auto',
                bgcolor: 'transparent !important',
                '&:hover': { bgcolor: 'transparent' },
                '&.Mui-focusVisible': { backgroundColor: 'transparent' },
                '&.Mui-selected': { backgroundColor: 'transparent' },
                '&.Mui-selected:hover': { backgroundColor: 'transparent' },
                '&:active': { backgroundColor: 'transparent' }
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={t('private')}
                secondary={t('des_private')}
                secondaryTypographyProps={{
                  sx: { whiteSpace: 'normal', wordBreak: 'break-word' }
                }}
              />
            </MenuItem>

            <Divider />

            <Box
              sx={{
                p: 1,
                textAlign: 'center',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                color: 'warning.main'
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
              <Typography variant="body2">{t('admin_only')}</Typography>
            </Box>
          </Menu>
        }
      >
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: 350,
              whiteSpace: 'normal',
              position: 'relative',
              overflow: 'hidden',
              transition: 'opacity 0.25s ease',
              opacity: loading ? 0.5 : 1
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              p: '4px 0 10px 0',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ flexGrow: 1, textAlign: 'center' }}
            >
              {t('change_visibility')}
            </Typography>

            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ position: 'absolute', right: 10, top: -1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          <MenuItem onClick={() => handleSelect('public')} sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon>
              <PublicIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t('public')}
              secondary={t('des_public')}
              secondaryTypographyProps={{
                sx: { whiteSpace: 'normal', wordBreak: 'break-word' }
              }}
            />
          </MenuItem>

          <MenuItem onClick={() => handleSelect('private')} sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t('private')}
              secondary={t('des_private')}
              secondaryTypographyProps={{
                sx: { whiteSpace: 'normal', wordBreak: 'break-word' }
              }}
            />
          </MenuItem>

          {loading && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(140, 140, 140, 0.5)',
                zIndex: 10
              }}
            >
              <CircularProgress size={28} />
            </Box>
          )}
        </Menu>
      </BoardPermissionGate>
    </>
  )
}

export default BoardType
