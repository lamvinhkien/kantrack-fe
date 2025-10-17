import { Box, Typography, Button } from '@mui/material'
import { ReactComponent as KanTrackIcon } from '~/assets/kantrack-transparent.svg'
import KanbanBoardImage from '~/assets/kanban_board.png'
import { useColorScheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Footer from '~/components/Footer/Footer'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const HomeContent = () => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: theme => theme.kantrack.homeContentHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        px: { xs: 3, md: 8 },
        py: { xs: 3, md: 0 },
        bgcolor:
          mode === 'dark'
            ? theme => theme.palette.background.default
            : theme => theme.palette.grey[50],
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Subtle floating gradient background */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '1%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background:
            mode === 'dark'
              ? 'radial-gradient(circle at center, rgba(25,118,210,0.25), transparent 70%)'
              : 'none',
          filter: 'blur(70px)',
          zIndex: 0,
          transition: 'background 0.5s ease'
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
          maxWidth: 1200,
          gap: { xs: 4, md: 4 },
          mb: { xs: 2, md: 10 },
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Left section: content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ flex: 1, textAlign: 'left' }}
        >
          <KanTrackIcon
            style={{
              width: 400,
              marginBottom: 12,
              color: mode === 'dark' ? '#fff' : '#1976d2'
            }}
          />

          <Typography
            variant='h4'
            fontWeight={700}
            color={mode === 'dark' ? 'white' : 'text.primary'}
            gutterBottom
          >
            {t('newTitle')}
          </Typography>

          <Typography
            variant='subtitle1'
            color={mode === 'dark' ? 'grey.400' : 'text.secondary'}
            maxWidth={480}
            mb={2}
          >
            {t('subtitle')}
          </Typography>

          <Button
            component={Link}
            to='/register'
            variant='contained'
            size='large'
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              px: 4,
              py: 1
            }}
          >
            {t('getStarted')}
          </Button>
        </motion.div>

        {/* Right section: illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
        >
          <Box
            component='img'
            src={KanbanBoardImage}
            alt='KanTrack progress illustration'
            sx={{
              width: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          />
        </motion.div>
      </Box>

      <Footer lineWidth={150} />
    </Box>
  )
}

export default HomeContent
