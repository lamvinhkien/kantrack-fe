import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import Auth from '~/pages/Auth/Auth'
import NotFound from '~/pages/404/NotFound'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/boards/6892ec2bdefb145da0430266' replace={true} />} />

      {/* Board Detail */}
      <Route path='/boards/:boardId' element={<Board />} />

      {/* Auth */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      {/* 404 Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
