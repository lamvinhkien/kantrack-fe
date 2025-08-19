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

const RegisterForm = () => {
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(registerUserAPI({ email, password }), { pending: 'Registration is in progress...' })
      .then(user => { navigate(`/login?registeredEmail=${user.email}`) })
  }

  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ marginBottom: '10px' }}>
          <TextField label='Enter Email...' type='text' variant='outlined' fullWidth
            error={!!errors['email']}
            {...register('email', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: EMAIL_RULE,
                message: EMAIL_RULE_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'email'} />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <TextField label='Enter Password...' type='password' variant='outlined' fullWidth
            error={!!errors['password']}
            {...register('password', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: PASSWORD_RULE,
                message: PASSWORD_RULE_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'password'} />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <TextField label='Enter Password Confirmation...' type='password' variant='outlined' fullWidth
            error={!!errors['password_confirmation']}
            {...register('password_confirmation', {
              validate: (value) => {
                if (value === watch('password')) return true
                return PASSWORD_CONFIRMATION_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'password_confirmation'} />
        </Box>
        <Box sx={{ marginBottom: '10px' }}>
          <Button type='submit' variant='outlined' className='interceptor-loading'>Register</Button>
        </Box>
        <Link to='/login' style={{ textDecoration: 'none' }}>
          <Typography>
            Login Now
          </Typography>
        </Link>
      </Box>
    </form>
  )
}

export default RegisterForm