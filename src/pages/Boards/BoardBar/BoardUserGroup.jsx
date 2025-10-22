import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import { useTranslation } from 'react-i18next'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CloseIcon from '@mui/icons-material/Close'
import { useColorScheme } from '@mui/material'
import Button from '@mui/material/Button'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { getScrollbarStyles } from '~/utils/formatters'

const BoardUserGroup = ({
  boardMembers = [],
  boardOwners = [],
  limit = 5,
  handleRemoveMember,
  handleAssignAdmin,
  handleLeaveBoard,
  currentUser
}) => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const isMenuOpen = Boolean(menuAnchorEl)

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const handleMenuOpen = (event, user) => {
    setMenuAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setSelectedUser(null)
  }

  const allUsers = [
    ...(boardOwners || []).map((u) => ({ ...u, isOwner: true })),
    ...(boardMembers || []).map((u) => ({ ...u, isOwner: false }))
  ]

  return (
    <>
      <Tooltip arrow title={t('view_board_member')}>
        <Box
          onClick={handleTogglePopover}
          sx={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            transition: 'transform 0.25s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              '& .hover-border': { borderColor: 'grey.200' }
            }
          }}
        >
          {allUsers.slice(0, limit).map((user, index) => (
            <Avatar
              key={user._id || index}
              alt={user?.displayName}
              src={user?.avatar?.url}
              className="hover-border"
              sx={{
                width: 34,
                height: 34,
                border: '2px solid transparent',
                marginLeft: index === 0 ? 0 : '-8px',
                transition: 'border-color 0.25s ease'
              }}
            />
          ))}

          {allUsers.length > limit && (
            <Box
              className="hover-border"
              sx={{
                width: 34,
                height: 34,
                marginLeft: '-8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '50%',
                border: '2px solid transparent',
                color: '#fff',
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.20)'
                    : 'rgba(255,255,255,0.30)',
                transition: 'border-color 0.25s ease'
              }}
            >
              +{allUsers.length - limit}
            </Box>
          )}
        </Box>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: 3,
            minWidth: 280,
            maxHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            p: 0
          }
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: mode === 'dark' ? '#2f2f2f' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            borderBottom:
              mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ flex: 1, textAlign: 'center', pointerEvents: 'none' }}
          >
            {t('board_members')}
          </Typography>
          <IconButton
            size="small"
            onClick={handleTogglePopover}
            sx={{ position: 'absolute', right: 13, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={theme => ({
            flex: 1,
            overflowY: 'auto',
            p: 1.2,
            backgroundColor: mode === 'dark' ? '#2f2f2f' : '#ffffff',
            ...getScrollbarStyles(theme)
          })}
        >
          {allUsers.map((user, index) => (
            <Box
              key={user._id || index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1,
                py: 1,
                borderRadius: 1.5,
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flex: 1,
                  minWidth: 0,
                  mr: 2
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    user.isOwner ? (
                      <EmojiEventsIcon sx={{ fontSize: 13, color: '#f1c40f' }} />
                    ) : null
                  }
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      border: user.isOwner ? '2px solid #f1c40f' : 'none'
                    }}
                    alt={user?.displayName}
                    src={user?.avatar?.url}
                  />
                </Badge>

                <Box sx={{ overflow: 'hidden' }}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {user?.displayName}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.78rem',
                      opacity: 0.8
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

              <BoardPermissionGate
                customCheck={() =>
                  boardOwners.some((o) => o._id === currentUser._id) &&
                  !boardOwners.some((o) => o._id === user._id)
                }
              >
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, user)}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </BoardPermissionGate>
            </Box>
          ))}
        </Box>

        <BoardPermissionGate
          customCheck={() =>
            boardOwners.some((o) => o._id === currentUser._id) ||
            boardMembers.some((m) => m._id === currentUser._id)
          }
        >
          <Box
            sx={{
              borderTop:
                mode === 'dark'
                  ? '1px solid rgba(255,255,255,0.12)'
                  : '1px solid rgba(0,0,0,0.12)',
              p: 1.5,
              textAlign: 'center',
              backgroundColor: mode === 'dark' ? '#2f2f2f' : '#ffffff'
            }}
          >
            <Button
              variant="text"
              color="error"
              fullWidth
              onClick={() => handleLeaveBoard(currentUser)}
              sx={{
                fontWeight: 500,
                textTransform: 'none',
                borderRadius: 2,
                px: 2.5,
                py: 0.6,
                borderWidth: 1.3
              }}
            >
              {t('leave_board')}
            </Button>
          </Box>
        </BoardPermissionGate>
      </Popover>

      <BoardPermissionGate customCheck={() => boardOwners.some((o) => o._id === currentUser._id)}>
        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 4,
            sx: {
              borderRadius: 2,
              minWidth: 200,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(40,40,40,0.96)'
                  : 'rgba(240,240,240,0.98)',
              backdropFilter: 'blur(6px)',
              border: (theme) =>
                theme.palette.mode === 'dark'
                  ? '1px solid rgba(255,255,255,0.08)'
                  : '1px solid rgba(0,0,0,0.06)',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 4px 18px rgba(0,0,0,0.6)'
                  : '0 4px 18px rgba(0,0,0,0.12)',
              '& .MuiMenuItem-root': {
                fontSize: '0.82rem',
                py: 0.6,
                px: 1.3,
                borderRadius: 1.2,
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.05)'
                }
              }
            }
          }}
        >
          <MenuItem
            onClick={() => {
              handleAssignAdmin(selectedUser)
              handleMenuClose()
            }}
          >
            <ListItemIcon>
              <EmojiEventsIcon fontSize="small" sx={{ color: '#f1c40f' }} />
            </ListItemIcon>
            <ListItemText primary={t('assign_admin')} />
          </MenuItem>

          <Divider sx={{ my: 0.3 }} />

          <MenuItem
            onClick={() => {
              handleRemoveMember(selectedUser)
              handleMenuClose()
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <HighlightOffIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText primary={t('remove_member')} />
          </MenuItem>
        </Menu>
      </BoardPermissionGate>
    </>
  )
}

export default BoardUserGroup
