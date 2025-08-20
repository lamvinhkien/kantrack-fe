import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
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

const LoginForm = () => {
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
      { pending: 'Logging in...' }
    ).then(res => {
      if (!res.error) navigate('/')
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      {
        verifiedEmail &&
        <Box sx={{ marginBottom: '10px' }}>
          <Typography>
            Your email {verifiedEmail} has been verified.
          </Typography>
        </Box>
      }
      {
        registeredEmail &&
        <Box sx={{ marginBottom: '10px' }}>
          <Typography>
            Please verify your email: {registeredEmail}.
          </Typography>
        </Box>
      }
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
          <Button type='submit' variant='outlined' className='interceptor-loading'>Login</Button>
        </Box>
        <Link to='/register' style={{ textDecoration: 'none' }}>
          <Typography>
            Create account
          </Typography>
        </Link>
      </Box>
    </form>
  )
}

export default LoginForm