import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { useTranslation } from 'react-i18next'
import CircularProgress from '@mui/material/CircularProgress'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Badge from '@mui/material/Badge'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { BOARD_MEMBER_ACTIONS } from '~/utils/constants'
import { ExpandMore } from '@mui/icons-material'
import { getScrollbarStyles } from '~/utils/formatters'

const UserGroup = ({ cardMemberIds = [], onUpdateCardMembers }) => {
  const { t } = useTranslation()
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [loadingUser, setLoadingUser] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined

  const board = useSelector(selectCurrentActiveBoard)
  const allUsers = [...(board?.owners || []), ...(board?.members || [])]

  const FE_CardMembers = cardMemberIds
    .map((id) => allUsers.find((u) => u._id === id))
    .filter(Boolean)

  const handleTogglePopover = (event) => {
    setAnchorPopoverElement(anchorPopoverElement ? null : event.currentTarget)
  }

  const handleUpdateCardMembers = async (user) => {
    setLoadingUser(user._id)
    try {
      const incomingMemberInfo = {
        userId: user._id,
        action: cardMemberIds.includes(user._id)
          ? CARD_MEMBER_ACTIONS.REMOVE
          : CARD_MEMBER_ACTIONS.ADD
      }
      await onUpdateCardMembers(incomingMemberInfo)
    } finally {
      setLoadingUser(null)
    }
  }

  const isOwner = (userId) => board?.owners?.some((o) => o._id === userId)

  const MAX_DISPLAY = 5
  const visibleMembers = FE_CardMembers.slice(0, MAX_DISPLAY)
  const remainingCount = FE_CardMembers.length - MAX_DISPLAY

  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
      {(visibleMembers && visibleMembers.length > 0)
        ? visibleMembers.map((user, index) => (
          <Tooltip arrow title={user?.displayName} key={index}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                isOwner(user._id) ? (
                  <EmojiEventsIcon sx={{ fontSize: 13, color: '#f1c40f' }} />
                ) : null
              }
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  cursor: 'pointer',
                  border: isOwner(user._id) ? '2px solid #f1c40f' : 'none',
                  opacity: loadingUser === user._id ? 0.5 : 1
                }}
                alt={user?.displayName}
                src={user?.avatar?.url}
              />
            </Badge>
          </Tooltip>
        ))
        :
        <BoardPermissionGate
          action={BOARD_MEMBER_ACTIONS.editCardMember}
          fallback={
            <Box sx={{ mt: 1, opacity: 0.9, fontWeight: 300 }}>
              {t('no_member')}
            </Box>
          }
        >
        </BoardPermissionGate>
      }

      {remainingCount > 0 && (
        <Tooltip arrow title={t('more_members', { count: remainingCount })}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? '#2f3542'
                  : theme.palette.grey[300],
              color: (theme) =>
                theme.palette.mode === 'dark'
                  ? '#ffffffcc'
                  : '#172b4d'
            }}
          >
            +{remainingCount}
          </Box>
        </Tooltip>
      )}

      <BoardPermissionGate
        action={BOARD_MEMBER_ACTIONS.editCardMember}
        fallback={
          FE_CardMembers && FE_CardMembers.length > MAX_DISPLAY &&
          <Tooltip arrow title={t('show_more')}>
            <Box
              aria-describedby={popoverId}
              onClick={handleTogglePopover}
              sx={{
                width: 34,
                height: 34,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '50%',
                color: (theme) =>
                  theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '#2f3542'
                    : theme.palette.grey[200],
                '&:hover': {
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
                }
              }}
            >
              <ExpandMore fontSize="small" />
            </Box>
          </Tooltip>
        }
      >
        <Tooltip arrow title={t('add_member')}>
          <Box
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            sx={{
              width: 34,
              height: 34,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '50%',
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? '#2f3542'
                  : theme.palette.grey[200],
              '&:hover': {
                color: (theme) =>
                  theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
              }
            }}
          >
            <AddIcon fontSize="small" />
          </Box>
        </Tooltip>
      </BoardPermissionGate>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={theme => ({
            p: 1,
            minWidth: 260,
            maxHeight: 320,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            ...getScrollbarStyles(theme),
            gap: 1
          })}
        >
          <BoardPermissionGate
            action={BOARD_MEMBER_ACTIONS.editCardMember}
            fallback={
              FE_CardMembers.map((user) => {
                const isUserOwner = isOwner(user._id)
                return (
                  <Box
                    key={user._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      p: 0.6,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark' ? '#2f3542' : '#f4f5f7'
                      },
                      opacity: loadingUser === user._id ? 0.6 : 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1.5 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          isUserOwner ? (
                            <EmojiEventsIcon sx={{ fontSize: 13, color: '#f1c40f' }} />
                          ) : null
                        }
                      >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            border: isUserOwner ? '2px solid #f1c40f' : 'none'
                          }}
                          alt={user?.displayName}
                          src={user?.avatar?.url}
                        />
                      </Badge>

                      <Box>
                        <Box sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                          {user?.displayName}
                        </Box>
                        <Box
                          sx={{
                            fontSize: '0.75rem',
                            color: 'text.secondary',
                            wordBreak: 'break-all'
                          }}
                        >
                          {user?.email}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )
              })
            }
          >
            {allUsers.map((user) => {
              const isUserCardMember = cardMemberIds.includes(user._id)
              const isUserOwner = isOwner(user._id)
              return (
                <Box
                  key={user._id}
                  onClick={() => handleUpdateCardMembers(user)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    p: 0.6,
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? '#2f3542' : '#f4f5f7'
                    },
                    opacity: loadingUser === user._id ? 0.6 : 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1.5 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        isUserOwner ? (
                          <EmojiEventsIcon sx={{ fontSize: 13, color: '#f1c40f' }} />
                        ) : null
                      }
                    >
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          border: isUserOwner ? '2px solid #f1c40f' : 'none'
                        }}
                        alt={user?.displayName}
                        src={user?.avatar?.url}
                      />
                    </Badge>

                    <Box>
                      <Box sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                        {user?.displayName}
                      </Box>
                      <Box
                        sx={{
                          fontSize: '0.75rem',
                          color: 'text.secondary',
                          wordBreak: 'break-all'
                        }}
                      >
                        {user?.email}
                      </Box>
                    </Box>
                  </Box>

                  {loadingUser === user._id ? (
                    <CircularProgress size={18} sx={{ color: '#1976d2' }} />
                  ) : isUserCardMember ? (
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#27ae60' }} />
                  ) : (
                    <AddIcon sx={{ fontSize: 18, color: (theme) => theme.palette.mode === 'dark' ? 'grey.400' : 'grey.700' }} />
                  )}
                </Box>
              )
            })}
          </BoardPermissionGate>
        </Box>
      </Popover>
    </Box>
  )
}

export default UserGroup
