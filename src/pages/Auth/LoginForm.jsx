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
import { useTranslation } from 'react-i18next'
import { ReactComponent as KanTrackIcon } from '~/assets/kantrack.svg'
import { useColorScheme } from '@mui/material'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'

const LoginForm = () => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  let [searchParams] = useSearchParams()
  const verifiedEmail = searchParams.get('verifiedEmail')
  const registeredEmail = searchParams.get('registeredEmail')

  const submitLogIn = async (data) => {
    const { email, password } = data
    setLoading(true)

    const res = await dispatch(loginUserAPI({ email, password }))
    setLoading(false)

    if (!res.error) navigate('/boards')
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
          boxShadow: 4
        }}
      >
        <CardContent sx={{ px: 4 }}>
          {/* --- Logo section --- */}
          <Box
            sx={{
              width: 'calc(100% + 64px)',
              ml: -4,
              mr: -4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
              mt: -2,
              py: 1.5,
              borderRadius: '12px 12px 0 0',
              background:
                mode === 'dark'
                  ? 'linear-gradient(135deg, #34495e, #1a2f45ff)'
                  : 'linear-gradient(135deg, #1976d2, #3974afff)'
            }}
          >
            <KanTrackIcon style={{ width: '85%', color: 'white' }} />
          </Box>

          {/* --- Subtitle --- */}
          <Typography
            variant='body2'
            sx={{
              textAlign: 'center',
              mb: 2.5
            }}
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
              disabled={loading}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
                borderRadius: 2,
                backgroundColor: mode === 'dark' ? '#34495e' : '#1976d2',
                color: 'white',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? '#34495e' : '#1565c0'
                }
              }}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  thickness={5}
                  sx={{
                    color: 'white'
                  }}
                />
              ) : (
                t('login_button')
              )}
            </Button>

            <Divider sx={{ my: 2.5, borderColor: mode === 'dark' ? 'grey.800' : 'grey.400' }} />

            <Typography
              textAlign='center'
              variant='body2'
            >
              {t('no_account_message')},{' '}
              <Link
                to='/register'
                style={{
                  color: mode === 'dark' ? '#7dbeffff' : '#3f9fffff',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
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
