import Box from '@mui/material/Box'
import { useLocation, Navigate } from 'react-router-dom'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const Auth = () => {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) return <Navigate to='/boards' />

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth