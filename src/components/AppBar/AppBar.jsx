import Box from '@mui/material/Box'
import Mode from './Mode/Mode'
import { ReactComponent as KanTrackIcon } from '~/assets/kantrack.svg'
import Profile from './Profile/Profile'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
import Language from './Language/Language'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { Button } from '@mui/material'

const AppBar = () => {
  const user = useSelector(selectCurrentUser)
  const isAuthorized = (user && (!user.require2fa || user.is2faVerified))

  const buttonStyle = {
    border: 'none',
    textTransform: 'none',
    color: 'white',
    fontWeight: 500,
    px: 1.5,
    '&:hover': {
      border: 'none',
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#1E2A36' : '#10447fff',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      {/* --- Left Section --- */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexShrink: 0
        }}
      >
        <Link to='/'>
          <KanTrackIcon style={{ width: 115, margin: '5px 10px 0px 0px', color: 'white' }} />
        </Link>

        <Button component={Link} to='/' variant='outlined' sx={buttonStyle}>
          Home
        </Button>

        {isAuthorized && (
          <Button component={Link} to='/boards' variant='outlined' sx={buttonStyle}>
            Boards
          </Button>
        )}
      </Box>

      {/* --- Center Section --- */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {isAuthorized && (
          <Box sx={{ width: '100%', maxWidth: 700, px: 1 }}>
            <AutoCompleteSearchBoard />
          </Box>
        )}
      </Box>

      {/* --- Right Section --- */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexShrink: 0,
          gap: 1.2
        }}
      >
        <Language />
        <Mode />
        {isAuthorized && <Notifications />}
        {isAuthorized && <Profile />}

        {!isAuthorized && (
          <Button
            component={Link}
            to='/login'
            variant='outlined'
            sx={buttonStyle}
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default AppBar
