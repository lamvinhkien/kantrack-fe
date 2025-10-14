import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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
import { useColorScheme } from '@mui/material'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const RegisterForm = () => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const submitRegister = async (data) => {
    const { email, password } = data
    setLoading(true)

    try {
      const user = await registerUserAPI({ email, password })
      if (user) {
        toast.success(t('account_created'))
        navigate(`/login?registeredEmail=${user.email}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
        transition: 'background-color 0.4s ease'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ zIndex: 2 }}
      >
        <Card
          sx={{
            width: 400,
            borderRadius: 3,
            boxShadow: 4,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{
            px: 4, position: 'relative', zIndex: 2,
            bgcolor: mode === 'dark' ? '#26282aff' : 'white'
          }}>
            {/* --- Logo section --- */}
            <Box
              component={Link}
              to='/'
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                variant='body2'
                sx={{
                  textAlign: 'center',
                  mb: 2.5
                }}
              >
                {t('register_subtitle')}
              </Typography>
            </motion.div>

            {/* --- Form --- */}
            <form onSubmit={handleSubmit(submitRegister)}>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
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
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                      <CircularProgress size={22} thickness={5} sx={{ color: 'white' }} />
                    ) : (
                      t('register_button')
                    )}
                  </Button>
                </motion.div>

                <Divider
                  sx={{
                    my: 2.5,
                    borderColor: mode === 'dark' ? 'grey.800' : 'grey.400'
                  }}
                />

                <Typography textAlign='center' variant='body2'>
                  {t('already_have_account_message')},{' '}
                  <Link
                    to='/login'
                    style={{
                      color: mode === 'dark' ? '#7dbeffff' : '#3f9fffff',
                      fontWeight: 500,
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                  >
                    {t('login_now_link')}
                  </Link>
                </Typography>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}

export default RegisterForm
