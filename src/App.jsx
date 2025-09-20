import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import Auth from '~/pages/Auth/Auth'
import NotFound from '~/pages/404/NotFound'
import AccountVerification from '~/pages/Auth/AccountVerification'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Require2FA from './components/Modal/2FA/Require2FA'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' />
  if (user.require2fa && !user.is2faVerified) return <Require2FA user={user} />
  return <Outlet />
}

const App = () => {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path='/' element={<Navigate to='/boards' replace={true} />} />
        <Route path='/boards' element={<Boards />} />
        <Route path='/boards/:boardId' element={<Board />} />
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
      </Route>

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
