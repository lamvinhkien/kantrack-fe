import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Logout from '@mui/icons-material/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Profile = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
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
      .then(() => {
        dispatch(logoutUserAPI()).then(() => {
          toast.success(t('logout_success'))
          navigate('/login')
        })
      })
      .catch(() => { })
  }

  return (
    <>
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
              sx={{ width: 24, height: 24 }}
            />
          </ListItemIcon>
          {t('account')}
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
    </>
  )
}

export default Profile