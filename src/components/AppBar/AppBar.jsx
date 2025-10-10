import Box from '@mui/material/Box'
import Mode from './Mode/Mode'
import { ReactComponent as KanTrackIcon } from '~/assets/kantrack.svg'
import Dashboard from './Menus/Dashboard'
import Profile from './Menus/Profile'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
import Language from './Language/Language'

const AppBar = () => {
  return (
    <Box sx={{
      width: '100%',
      height: theme => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 2,
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1E2A36' : '#10447fff'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ width: 400, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to='/'>
          <KanTrackIcon style={{ width: 115, marginTop: 4, color: 'white' }} />
        </Link>
        <Dashboard />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
        <AutoCompleteSearchBoard />
      </Box>

      <Box sx={{ width: 400, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
        <Language />
        <Mode />
        <Notifications />
        <Profile />
      </Box>
    </Box>
  )
}

export default AppBar
