import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE,
  FIELD_REQUIRED_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { registerUserAPI } from '~/apis'
import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import { ReactComponent as KanTrackIcon } from '~/assets/kantrack.svg'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const RegisterForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(registerUserAPI({ email, password }), { pending: t('registering') })
      .then(user => { navigate(`/login?registeredEmail=${user.email}`) })
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
            color='rgba(255,255,255,0.8)'
            textAlign='center'
            mb={3}
          >
            {t('register_subtitle')}
          </Typography>

          {/* --- Form --- */}
          <form onSubmit={handleSubmit(submitRegister)}>
            {/* Email */}
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

            {/* Password */}
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

            {/* Password Confirmation */}
            <Box sx={{ mb: 2 }}>
              <TextField
                label={t('enter_password_confirmation_placeholder')}
                type='password'
                variant='outlined'
                fullWidth
                size='small'
                error={!!errors['password_confirmation']}
                {...register('password_confirmation', {
                  validate: (value) =>
                    value === watch('password') || PASSWORD_CONFIRMATION_MESSAGE
                })}
              />
              <FieldErrorAlert
                errors={errors}
                fieldName='password_confirmation'
              />
            </Box>

            {/* Register Button */}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.primary.dark
                }
              }}
              className='interceptor-loading'
            >
              {t('register_button')}
            </Button>

            <Divider sx={{ my: 2, mx: -4 }} />

            <Typography textAlign='center' variant='body2'>
              {t('already_have_account_message')}{', '}
              <Link
                to='/login'
                style={{ textDecoration: 'none', color: '#1976d2' }}
              >
                {t('login_now_link')}
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RegisterForm
