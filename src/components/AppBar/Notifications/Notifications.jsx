import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Button,
  Chip,
  Menu,
  MenuItem,
  Divider
} from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchInvitationsAPI,
  updateBoardInvitationAPI,
  selectCurrentNotifications,
  addNotification,
  removeNotification
} from '~/redux/notifications/notificationsSlice'
import { socketIoInstance } from '~/socketio/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { renderTime } from '~/utils/formatters'
import { useTranslation } from 'react-i18next'
import { fetchBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'
import { getScrollbarStyles } from '~/utils/formatters'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'

const Notifications = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const notifications = useSelector(selectCurrentNotifications)
  const currentUser = useSelector(selectCurrentUser)

  const [anchorEl, setAnchorEl] = useState(null)
  const [hover, setHover] = useState(false)
  const [disableUntil, setDisableUntil] = useState(0)
  const [newNotification, setNewNotification] = useState(false)

  const menuOpen = Boolean(anchorEl)
  const now = Date.now()
  const tooltipAllowed = now > disableUntil
  const tooltipOpen = hover && !menuOpen && tooltipAllowed

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget)
    setDisableUntil(Date.now() + 1000)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setDisableUntil(Date.now() + 600)
    setHover(false)
  }

  useEffect(() => {
    dispatch(fetchInvitationsAPI())

    const onReceiveNewInvitation = (invitation) => {
      if (invitation.inviteeId === currentUser._id) {
        dispatch(addNotification(invitation))
      }
    }

    const onDeletedBoardGlobal = (boardId) => {
      dispatch(removeNotification(boardId))
    }

    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    socketIoInstance.on('BE_DELETE_BOARD_GLOBAL', onDeletedBoardGlobal)

    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
      socketIoInstance.off('BE_DELETE_BOARD_GLOBAL', onDeletedBoardGlobal)
    }
  }, [dispatch, currentUser._id])

  useEffect(() => {
    const hasPending = notifications?.some(
      (inv) => inv.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING
    )
    setNewNotification(hasPending)
  }, [notifications])

  const updateBoardInvitation = (invitationId, status) => {
    dispatch(updateBoardInvitationAPI({ invitationId, status }))
      .then(async (res) => {
        if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
          const boardRes = await dispatch(fetchBoardDetailsAPI(res.payload.boardInvitation.boardId))
          const newBoard = {
            ...boardRes.payload,
            memberIds: [...boardRes.payload.memberIds, res.payload.inviteeId]
          }
          socketIoInstance.emit('FE_UPDATE_BOARD', { boardId: newBoard._id, board: newBoard })
          navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        }
      })
  }

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Tooltip
        title={t('notification')}
        arrow
        placement="bottom"
        open={tooltipOpen}
      >
        <IconButton
          color="inherit"
          onClick={handleOpenMenu}
          sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        >
          <Badge
            color="warning"
            variant={newNotification ? 'dot' : 'none'}
          >
            <NotificationsNoneIcon
              fontSize="medium"
              sx={{
                color: newNotification ? 'yellow' : 'white'
              }}
            />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'notification-menu-button',
          sx: {
            p: 0,
            maxHeight: 500,
            overflowY: 'auto',
            width: 350
          }
        }}
        PaperProps={{
          elevation: 6,
          sx: theme => ({
            mt: 1,
            borderRadius: 2,
            overflow: 'hidden',
            ...getScrollbarStyles(theme)
          })
        }}
      >
        {(!notifications || notifications.length === 0) ? (
          <MenuItem sx={{ justifyContent: 'center', py: 2, color: 'gray' }}>
            {t('no_notification')}
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <Box key={index}>
              <MenuItem
                sx={{
                  alignItems: 'flex-start',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.2,
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupAddIcon fontSize="small" sx={{ color: 'orange' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.9rem',
                      lineHeight: 1.4,
                      flex: 1
                    }}
                  >
                    <strong>{notification.inviter?.displayName}</strong>{' '}
                    {t('invited_board')}{' '}
                    <strong>{notification.board?.title}</strong>
                  </Typography>
                </Box>

                {notification.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING && (
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
                    <Button
                      className="interceptor-loading"
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        updateBoardInvitation(
                          notification._id,
                          BOARD_INVITATION_STATUS.ACCEPTED
                        )
                      }
                    >
                      {t('accept')}
                    </Button>
                    <Button
                      className="interceptor-loading"
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() =>
                        updateBoardInvitation(
                          notification._id,
                          BOARD_INVITATION_STATUS.REJECTED
                        )
                      }
                    >
                      {t('reject')}
                    </Button>
                  </Box>
                )}

                {notification.boardInvitation.status !== BOARD_INVITATION_STATUS.PENDING && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    {notification.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED && (
                      <Chip
                        icon={<DoneIcon />}
                        label={t('accepted')}
                        color="success"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                    {notification.boardInvitation.status === BOARD_INVITATION_STATUS.REJECTED && (
                      <Chip
                        icon={<NotInterestedIcon />}
                        label={t('rejected')}
                        color="error"
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                )}

                <Typography
                  variant="caption"
                  sx={{
                    alignSelf: 'flex-end',
                    fontSize: '0.75rem',
                    color: 'gray'
                  }}
                >
                  {renderTime(notification.createdAt, { locale: i18n.language })}
                </Typography>
              </MenuItem>

              {index !== notifications.length - 1 && (
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              )}
            </Box>
          ))
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
