import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

function PageLoadingSpinner({ caption, AppBar = false }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        height: (theme) => AppBar ? theme.kantrack.pageWithoutAppBarHeight : '100vh'
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 1 }}>{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner
