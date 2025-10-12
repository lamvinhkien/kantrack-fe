import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const Footer = ({ lineWidth = 100 }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        mt: 4,
        mb: 1
      }}
    >
      {/* Line trái */}
      <Box
        sx={{
          width: lineWidth,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(25,118,210,0.5))'
        }}
      />

      {/* Text KanTrack */}
      <Typography
        sx={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontSize: '0.95rem',
          background: 'linear-gradient(90deg, #1976d2, #63a4ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 6px rgba(25,118,210,0.3)'
        }}
      >
        KanTrack
      </Typography>

      {/* Line phải */}
      <Box
        sx={{
          width: lineWidth,
          height: '1px',
          background: 'linear-gradient(90deg, rgba(25,118,210,0.5), transparent)'
        }}
      />
    </Box>
  )
}

export default Footer
