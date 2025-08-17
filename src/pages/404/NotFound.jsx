import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontWeight: '500' }}>404 Not Found</Typography>
        <Link to='/' style={{ textDecoration: 'none' }}>Go Home</Link>
      </Box>
    </Box>
  )
}

export default NotFound