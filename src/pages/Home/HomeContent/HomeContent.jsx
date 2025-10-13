import { Box } from '@mui/material'
import { ReactComponent as KanTrackIcon } from '~/assets/kantrack.svg'

const HomeContent = () => {
  return (
    <Box sx={{ height: theme => theme.kantrack.homeContentHeight }}>
      {/* Logo */}
      <Box>
        <KanTrackIcon style={{ width: 300 }} />
      </Box>
    </Box>
  )
}

export default HomeContent
