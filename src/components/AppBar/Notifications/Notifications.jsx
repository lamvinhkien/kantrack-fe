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
  addNotification
} from '~/redux/notifications/notificationsSlice'
import { socketIoInstance } from '~/socketio/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { renderTime } from '~/utils/formatters'
import { useTranslation } from 'react-i18next'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

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
    setNewNotification(false)
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
        setNewNotification(true)
      }
    }

    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)

    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }
  }, [dispatch, currentUser._id])

  const updateBoardInvitation = (invitationId, status) => {
    dispatch(updateBoardInvitationAPI({ invitationId, status }))
      .then(res => {
        if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
          navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        }
      })
  }

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ mr: 0.5 }}
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
          sx={{ color: 'white' }}
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
        MenuListProps={{ 'aria-labelledby': 'notification-menu-button' }}
      >
        {!notifications || notifications.length === 0 ? (
          <MenuItem sx={{ minWidth: 200 }}>
            {t('no_notification')}
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <Box key={index}>
              <MenuItem
                sx={{
                  minWidth: 200,
                  maxWidth: 360,
                  overflowY: 'auto'
                }}
              >
                <Box
                  sx={{
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupAddIcon fontSize="small" />
                    <Box>
                      <strong>{notification.inviter?.displayName}</strong> {t('invited_board')}{' '}
                      <strong>{notification.board?.title}</strong>
                    </Box>
                  </Box>

                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'flex-end'
                      }}
                    >
                      <Button
                        className="interceptor-loading"
                        type="submit"
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
                        type="submit"
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

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: 'flex-end'
                    }}
                  >
                    {notification.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED && (
                      <Chip icon={<DoneIcon />} label={t('accepted')} color="success" size="small" />
                    )}
                    {notification.boardInvitation.status === BOARD_INVITATION_STATUS.REJECTED && (
                      <Chip icon={<NotInterestedIcon />} label={t('rejected')} color="error" size="small" />
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="span" sx={{ fontSize: '13px' }}>
                      {renderTime(notification.createdAt, { locale: i18n.language })}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              {index !== notifications.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
