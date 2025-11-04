import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import SecurityIcon from '@mui/icons-material/Security'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch } from 'react-redux'
import { useTranslation, Trans } from 'react-i18next'
import { verify2faAPI } from '~/apis'
import { updateCurrentUser, loginUserAPI } from '~/redux/user/userSlice'
import Footer from '~/components/Footer/Footer'

const Require2FA = ({ user }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [otpToken, setConfirmOtpToken] = useState('')
  const [error, setError] = useState(null)
  const [loadingVerify, setLoadingVerify] = useState(false)
  const [loadingResend, setLoadingResend] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const handleVerify2FA = () => {
    if (!otpToken.trim()) {
      const errMsg = t('require_enter_code')
      setError(errMsg)
      toast.error(errMsg)
      return
    }

    setLoadingVerify(true)
    verify2faAPI(user?.email, otpToken.trim())
      .then((updatedUser) => {
        dispatch(updateCurrentUser(updatedUser))
        setConfirmOtpToken('')
        setError(null)
      })
      .finally(() => {
        setLoadingVerify(false)
      })
  }

  const handleResendCode = () => {
    setLoadingResend(true)
    dispatch(loginUserAPI({ email: user?.email, password: user?.password }))
      .unwrap()
      .then((res) => {
        if (res.require2fa === true) {
          toast.success(t('mail_resent'))
          setCountdown(60)
        }
      })
      .finally(() => setLoadingResend(false))
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
              mt: 1.5,
              flexWrap: 'wrap'
            }}
          >
            <TextField
              autoFocus
              autoComplete="off"
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
              disabled={loadingVerify}
              onClick={handleVerify2FA}
              sx={{
                minWidth: '120px',
                height: '55px',
                fontSize: '1em'
              }}
            >
              {loadingVerify ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                t('confirm')
              )}
            </Button>

            <Button
              type="button"
              variant="contained"
              color="warning"
              size="medium"
              disabled={loadingResend || countdown > 0}
              onClick={handleResendCode}
              sx={{
                minWidth: '150px',
                height: '55px',
                fontSize: '1em'
              }}
            >
              {loadingResend ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : countdown > 0 ? (
                `${t('resend_in')} ${countdown}s`
              ) : (
                t('resend_code')
              )}
            </Button>

            <Button
              type="button"
              variant="contained"
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