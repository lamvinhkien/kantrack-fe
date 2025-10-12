import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import SecurityIcon from '@mui/icons-material/Security'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { verify2faAPI } from '~/apis'
import { updateCurrentUser } from '~/redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useTranslation, Trans } from 'react-i18next'
import CircularProgress from '@mui/material/CircularProgress'
import Footer from '~/components/Footer/Footer'

const Require2FA = ({ user }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [otpToken, setConfirmOtpToken] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRequire2FA = () => {
    if (!otpToken) {
      const errMsg = t('require_enter_code')
      setError(errMsg)
      toast.error(errMsg)
      return
    }

    setLoading(true)
    verify2faAPI(user?.email, otpToken)
      .then(updatedUser => {
        dispatch(updateCurrentUser(updatedUser))
        setConfirmOtpToken('')
        setError(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal disableScrollLock open={true} sx={{ overflowY: 'auto' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          bgcolor: 'white',
          borderRadius: 'none',
          border: 'none',
          outline: 0,
          padding: '60px 20px 20px',
          margin: '0 auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <SecurityIcon sx={{ color: '#27ae60' }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#27ae60' }}
          >
            {t('require_2fa')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            mt: 2
          }}
        >
          <Box sx={{ textAlign: 'center', lineHeight: 1.8 }}>
            <Trans
              i18nKey="enter_2fa_code_description"
              values={{ email: user.email }}
            />
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mt: 1.5
            }}
          >
            <TextField
              autoFocus
              autoComplete="nope"
              label={t('enter_code')}
              variant="outlined"
              sx={{ minWidth: '200px' }}
              value={otpToken}
              onChange={(e) => setConfirmOtpToken(e.target.value)}
              error={!!error && !otpToken}
            />

            <Button
              type="button"
              variant="contained"
              color="primary"
              size="medium"
              disabled={loading}
              onClick={handleRequire2FA}
              sx={{
                minWidth: '120px',
                height: '55px',
                fontSize: '1em'
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'white'
                  }}
                />
              ) : (
                t('confirm')
              )}
            </Button>

            <Button
              type="button"
              variant="text"
              color="error"
              size="medium"
              sx={{
                minWidth: '120px',
                height: '55px',
                fontSize: '1em'
              }}
              onClick={() => dispatch(updateCurrentUser(null))}
            >
              {t('logout')}
            </Button>
          </Box>
        </Box>

        <Footer lineWidth={150} />
      </Box>
    </Modal>
  )
}

export default Require2FA
