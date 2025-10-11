import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { ReactComponent as KanTrackIcon } from '~/assets/kantrack.svg'

const LoginForm = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()

  let [searchParams] = useSearchParams()
  const verifiedEmail = searchParams.get('verifiedEmail')
  const registeredEmail = searchParams.get('registeredEmail')

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: t('logging') }
    ).then(res => {
      if (!res.error) navigate('/')
    })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 3,
          boxShadow: 4,
          background: 'linear-gradient(135deg, #032141e4, #010a1696)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* --- Logo --- */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
              mt: -2
            }}
          >
            <KanTrackIcon style={{ width: '100%' }} />
          </Box>

          {/* --- Subtitle --- */}
          <Typography
            variant='body2'
            color='text.secondary'
            textAlign='center'
            mb={3}
          >
            {t('login_subtitle')}
          </Typography>

          {/* --- Verified / Registered email messages --- */}
          {verifiedEmail && (
            <Box sx={{ mb: 2 }}>
              <Typography color='success.main'>
                {t('email_verified_message', { email: verifiedEmail })}
              </Typography>
            </Box>
          )}

          {registeredEmail && (
            <Box sx={{ mb: 2 }}>
              <Typography color='warning.main'>
                {t('please_verify_email_message', { email: registeredEmail })}
              </Typography>
            </Box>
          )}

          {/* --- Form --- */}
          <form onSubmit={handleSubmit(submitLogIn)}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label={t('enter_email_placeholder')}
                type='text'
                variant='outlined'
                fullWidth
                size='small'
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName='email' />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label={t('enter_password_placeholder')}
                type='password'
                variant='outlined'
                fullWidth
                size='small'
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName='password' />
            </Box>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
                borderRadius: 2
              }}
              className='interceptor-loading'
            >
              {t('login_button')}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography textAlign='center' variant='body2'>
              {t('no_account_message')}{', '}
              <Link
                to='/register'
                style={{ textDecoration: 'none', color: '#1976d2' }}
              >
                {t('create_account_link')}
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginForm
