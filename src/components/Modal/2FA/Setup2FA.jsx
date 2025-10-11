import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import SecurityIcon from '@mui/icons-material/Security'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import CancelIcon from '@mui/icons-material/Cancel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { get2FA_QRCodeAPI, setup2faAPI } from '~/apis'
import CircularProgress from '@mui/material/CircularProgress'
import { SETUP_2FA_ACTIONS } from '~/utils/constants'
import { useTranslation, Trans } from 'react-i18next'

const Setup2FA = ({ isOpen, toggleOpen, action2FA, handleSuccessSetup2FA }) => {
  const { t } = useTranslation()
  const [otpToken, setConfirmOtpToken] = useState('')
  const [error, setError] = useState(null)
  const [QRCodeImageUrl, setQRCodeImageUrl] = useState(null)

  useEffect(() => {
    if (isOpen && action2FA === SETUP_2FA_ACTIONS.ENABLE) {
      get2FA_QRCodeAPI().then(res => {
        setQRCodeImageUrl(res.qrcode)
      })
    }
  }, [isOpen, action2FA])

  const handleCloseModal = () => {
    toggleOpen(!isOpen)
  }

  const handleConfirmSetup2FA = () => {
    if (!otpToken) {
      const errMsg = t('require_enter_code')
      setError(errMsg)
      toast.error(errMsg)
      return
    }

    setup2faAPI(otpToken, action2FA).then(updatedUser => {
      handleSuccessSetup2FA(updatedUser)
      toast.success(`2FA ${action2FA}d.`)
      setConfirmOtpToken('')
      setError(null)
    })
  }

  return (
    <Modal
      disableScrollLock
      open={isOpen}
      onClose={handleCloseModal}
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: 700,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '120px auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}
        >
          <CancelIcon
            color="error"
            sx={{ '&:hover': { color: 'error.light' } }}
            onClick={handleCloseModal}
          />
        </Box>

        <Box
          sx={{
            mb: 1,
            mt: -3,
            pr: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          {action2FA === SETUP_2FA_ACTIONS.ENABLE ? (
            <SecurityIcon sx={{ color: '#27ae60' }} />
          ) : (
            <LockOpenIcon sx={{ color: '#ae2727ff' }} />
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color:
                action2FA === SETUP_2FA_ACTIONS.ENABLE
                  ? '#27ae60'
                  : '#ae2727ff'
            }}
          >
            {action2FA === SETUP_2FA_ACTIONS.ENABLE
              ? t('enable_2fa')
              : t('disable_2fa')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            p: 1
          }}
        >
          {action2FA === SETUP_2FA_ACTIONS.ENABLE ? (
            !QRCodeImageUrl ? (
              <CircularProgress sx={{ margin: '30px 0px' }} />
            ) : (
              <img
                style={{
                  width: '100%',
                  maxWidth: '250px',
                  objectFit: 'contain'
                }}
                src={QRCodeImageUrl}
                alt="qr-code"
              />
            )
          ) : null}

          <Box sx={{ textAlign: 'center' }}>
            {action2FA === SETUP_2FA_ACTIONS.ENABLE ? (
              <Trans i18nKey="enable_2fa_description" />
            ) : (
              <Trans i18nKey="disable_2fa_description" />
            )}
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              my: 1
            }}
          >
            <TextField
              autoFocus
              autoComplete="nope"
              label={t('enter_your_code')}
              type="text"
              variant="outlined"
              sx={{ minWidth: '280px' }}
              value={otpToken}
              onChange={(e) => setConfirmOtpToken(e.target.value)}
              error={!!error && !otpToken}
            />

            <Button
              type="button"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                textTransform: 'none',
                minWidth: '120px',
                height: '55px',
                fontSize: '1em'
              }}
              onClick={handleConfirmSetup2FA}
            >
              {t('confirm')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default Setup2FA
