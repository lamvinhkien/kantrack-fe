import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Logout from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
import { Link } from 'react-router-dom'
import ListItemText from '@mui/material/ListItemText'
import { useTranslation } from 'react-i18next'

const Profile = () => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: t('logout'),
      description: t('confirm_logout'),
      confirmationText: t('confirm'),
      cancellationText: t('cancel'),
      confirmationButtonProps: { color: 'error' }
    })
      .then(() => { dispatch(logoutUserAPI()) })
      .catch(() => { })
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title={t('account')}>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ padding: 0 }}
          >
            <Avatar sx={{ width: 35, height: 35 }} alt={currentUser?.displayName} src={currentUser?.avatar?.url} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to="/settings/account" sx={{ mb: 1 }} >
          <ListItemIcon>
            <Avatar
              src={currentUser?.avatar?.url}
              alt={currentUser?.displayName}
              sx={{ width: 28, height: 28 }}
            />
          </ListItemIcon>
          <ListItemText primary={t('account')} />
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{ '&:hover': { color: 'error.main', '& .logout-icon': { color: 'error.main' } } }}
        >
          <ListItemIcon>
            <Logout className='logout-icon' fontSize="small" />
          </ListItemIcon>
          {t('logout')}
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default Profile