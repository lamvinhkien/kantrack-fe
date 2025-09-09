import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import PasswordIcon from '@mui/icons-material/Password'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { useDispatch } from 'react-redux'
import { updateUserAPI, logoutUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { useState } from 'react'
import Setup2FA from '~/components/Modal/2FA/Setup2FA'
import { alpha } from '@mui/material/styles'

const SecurityTab = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const confirmChangePassword = useConfirm()
  const submitChangePassword = (data) => {
    confirmChangePassword({

      title:
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogoutIcon sx={{ color: 'error.main' }} /> Change Password
        </Box>,
      description: 'You have to login again after successfully changing your password. Continue?',
      confirmationButtonProps: { color: 'error' },
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    })
      .then(() => {
        const { current_password, new_password } = data
        toast.promise(
          dispatch(updateUserAPI({ current_password, new_password })),
          { pending: 'Updating...' }
        ).then(res => {
          if (!res.error) {
            toast.success('Successfully changed your password, please login again.')
            dispatch(logoutUserAPI(false))
          }
        })
      })
      .catch(() => { })
  }

  const [openSetup2FA, setOpenSetup2FA] = useState(false)
  const user = { require_2fa: false }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Setup2FA
        isOpen={openSetup2FA}
        toggleOpen={setOpenSetup2FA}
      />

      <Box sx={{
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
        <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockOutlinedIcon />
            <Typography variant='h6'>Two-Factor Authentication (2FA)</Typography>
          </Box>

          <Alert
            severity={user.require_2fa ? 'success' : 'warning'}
            sx={(theme) => ({
              '.MuiAlert-message': { overflow: 'hidden' },
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha(
                    user.require_2fa
                      ? theme.palette.success.main
                      : theme.palette.warning.main,
                    0.1
                  )
                  : undefined
            })}
          >
            Account security status:{' '}
            <Typography component='span' sx={{ fontWeight: 'bold' }}>
              Two-Factor Authentication (2FA){' '}
              {user.require_2fa ? 'enabled' : 'not enabled'}.
            </Typography>
          </Alert>

          {!user.require_2fa &&
            <Button
              type='button'
              variant='contained'
              color='warning'
              fullWidth
              onClick={() => setOpenSetup2FA(true)}
            >
              Enable 2FA
            </Button>
          }
        </Box>

        <Divider sx={{ width: '100%' }} />

        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockOutlinedIcon />
              <Typography variant='h6'>Change Your Password</Typography>
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('current_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['current_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'current_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('new_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['new_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password'} />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="New Password Confirmation"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('new_password_confirmation', {
                  validate: (value) => {
                    if (value === watch('new_password')) return true
                    return 'Password confirmation does not match.'
                  }
                })}
                error={!!errors['new_password_confirmation']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password_confirmation'} />
            </Box>

            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Change
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default SecurityTab