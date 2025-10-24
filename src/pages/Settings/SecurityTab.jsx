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
import { useDispatch, useSelector } from 'react-redux'
import { updateUserAPI, logoutUserAPI, updateCurrentUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { useState } from 'react'
import Setup2FA from '~/components/Modal/2FA/Setup2FA'
import { alpha } from '@mui/material/styles'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { SETUP_2FA_ACTIONS } from '~/utils/constants'
import { useTranslation } from 'react-i18next'

const SecurityTab = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const confirmChangePassword = useConfirm()
  const submitChangePassword = (data) => {
    confirmChangePassword({
      title: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LogoutIcon sx={{ color: 'error.main' }} /> {t('change_password')}
        </Box>
      ),
      description: t('change_password_description'),
      confirmationButtonProps: { color: 'error' },
      confirmationText: t('confirm'),
      cancellationText: t('cancel')
    })
      .then(() => {
        const { current_password, new_password } = data
        toast
          .promise(dispatch(updateUserAPI({ current_password, new_password })), {
            pending: t('updating')
          })
          .then((res) => {
            if (!res.error) {
              toast.success(t('change_password_success'))
              dispatch(logoutUserAPI())
            }
          })
      })
      .catch(() => { })
  }

  const [openSetup2FA, setOpenSetup2FA] = useState(false)
  const [action2FA, setAction2FA] = useState(null)
  const user = useSelector(selectCurrentUser)

  const handleOpenSetup2FA = (action) => {
    setOpenSetup2FA(true)
    setAction2FA(action)
  }

  const handleSuccessSetup2FA = (updatedUser) => {
    dispatch(updateCurrentUser(updatedUser))
    setOpenSetup2FA(false)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Setup2FA
        isOpen={openSetup2FA}
        toggleOpen={setOpenSetup2FA}
        handleSuccessSetup2FA={handleSuccessSetup2FA}
        action2FA={action2FA}
      />

      <Box
        sx={(theme) => ({
          maxWidth: '1200px',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 6,

          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }
        })}
      >
        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box
            sx={{
              width: { xs: '100%', sm: '400px' },
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockOutlinedIcon />
              <Typography variant='h6'>
                {t('change_password_title')}
              </Typography>
            </Box>

            <Box>
              <TextField
                fullWidth
                label={t('current_password')}
                type='password'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PasswordIcon fontSize='small' />
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
                label={t('new_password')}
                type='password'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon fontSize='small' />
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
                label={t('new_password_confirmation')}
                type='password'
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockResetIcon fontSize='small' />
                    </InputAdornment>
                  )
                }}
                {...register('new_password_confirmation', {
                  validate: (value) =>
                    value === watch('new_password') ||
                    t('password_confirmation_not_match')
                })}
                error={!!errors['new_password_confirmation']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password_confirmation'} />
            </Box>

            <Box>
              <Button
                className='interceptor-loading'
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
              >
                {t('update')}
              </Button>
            </Box>
          </Box>
        </form>

        <Divider
          orientation="vertical"
          flexItem
          sx={(theme) => ({
            mx: 2,
            [theme.breakpoints.down('md')]: {
              orientation: 'horizontal',
              width: '100%'
            }
          })}
        />

        <Box
          sx={{
            width: { xs: '100%', sm: '400px' },
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockOutlinedIcon />
            <Typography variant='h6'>
              {t('two_factor_authentication_title')}
            </Typography>
          </Box>

          <Alert
            severity={user.require2fa ? 'success' : 'warning'}
            sx={(theme) => ({
              '.MuiAlert-message': { overflow: 'hidden' },
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha(
                    user.require2fa
                      ? theme.palette.success.main
                      : theme.palette.warning.main,
                    0.1
                  )
                  : undefined
            })}
          >
            {t('account_security_status')}{' '}
            <Typography component='span' sx={{ fontWeight: 'bold' }}>
              {t('two_factor_authentication_label')}{' '}
              {user.require2fa ? t('enabled') : t('not_enabled')}.
            </Typography>
          </Alert>

          {user.require2fa ? (
            <Button
              type='button'
              variant='contained'
              color='error'
              fullWidth
              onClick={() => handleOpenSetup2FA(SETUP_2FA_ACTIONS.DISABLE)}
            >
              {t('disable_2fa')}
            </Button>
          ) : (
            <Button
              type='button'
              variant='contained'
              color='warning'
              fullWidth
              onClick={() => handleOpenSetup2FA(SETUP_2FA_ACTIONS.ENABLE)}
            >
              {t('enable_2fa')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default SecurityTab