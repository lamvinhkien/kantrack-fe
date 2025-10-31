import Box from '@mui/material/Box'
import Mode from './Mode/Mode'
import { ReactComponent as KanTrackIcon } from '~/assets/kantrack-transparent.svg'
import { ReactComponent as KanTrackMiniIcon } from '~/assets/kantrack-mini-transparent.svg'
import Profile from './Profile/Profile'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
import Language from './Language/Language'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined'
import { useMediaQuery, useTheme } from '@mui/material'

const AppBar = () => {
  const { t } = useTranslation()
  const user = useSelector(selectCurrentUser)
  const isAuthorized = (user && !user.password)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const buttonStyle = {
    border: 'none',
    textTransform: 'none',
    color: 'white',
    fontWeight: 500,
    px: 1.2,
    '&:hover': {
      border: 'none',
      backgroundColor: 'rgba(255,255,255,0.1)'
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.kantrack.appBarHeight,
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
          {isMobile ? (
            <KanTrackMiniIcon style={{ width: 30, margin: '4px 2px 0px 0px', color: 'white' }} />
          ) : (
            <KanTrackIcon style={{ width: 115, margin: '5px 8px 0px 0px', color: 'white' }} />
          )}
        </Link>

        <Button component={Link} to='/' variant='outlined' sx={buttonStyle}>
          {t('home')}
        </Button>

        {isAuthorized && (
          <Button component={Link} to='/boards' variant='outlined' sx={buttonStyle}>
            {t('board')}
          </Button>
        )}
      </Box>

      {/* --- Center Section --- */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 1
        }}
      >
        {isAuthorized ? (
          <Box sx={{ width: '100%', maxWidth: 700 }}>
            <AutoCompleteSearchBoard />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textWrap: 'nowrap'
            }}
          >
            <RocketLaunchOutlinedIcon sx={{ color: 'white', fontSize: 24 }} />

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: 'white',
                letterSpacing: 0.3
              }}
            >
              {t('slogan')}
            </Typography>

            <Typography sx={{ color: 'white', opacity: 0.8, mr: -1 }}>|</Typography>

            <Button
              component={Link}
              to="/register"
              sx={{
                textTransform: 'none',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                '&:hover': {
                  textDecoration: 'underline',
                  backgroundColor: 'transparent'
                }
              }}
            >
              {t('register_now_link')}
            </Button>
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
        {isAuthorized && <Notifications />}
        <Mode />
        <Language />
        {isAuthorized && <Profile />}

        {!isAuthorized && (
          <Button
            component={Link}
            to='/login'
            variant='outlined'
            sx={buttonStyle}
          >
            {t('login_button')}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default AppBar
