import Box from '@mui/material/Box'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardType from './BoardType'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { socketIoInstance } from '~/socketClient'
import { updateBoardDetailsAPI } from '~/apis'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch } from 'react-redux'

const BoardBar = ({ board }) => {
  const dispatch = useDispatch()

  const onUpdateBoardTitle = (newTitle) => {
    const newBoard = { ...board }
    updateBoardDetailsAPI(board._id, { title: newTitle })
      .then(() => {
        if (newTitle) newBoard.title = newTitle
        dispatch(updateCurrentActiveBoard(newBoard))
        socketIoInstance.emit('FE_UPDATE_BOARD_TITLE', { boardId: newBoard._id, board: newBoard })
      })
  }

  return (
    <Box sx={{
      width: '100%',
      height: theme => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 2,
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#293A4A' : '#155DA9'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ minWidth: '300px' }}>
        <ToggleFocusInput
          value={board?.title}
          onChangedValue={onUpdateBoardTitle}
          inputFontSize='18px'
          colorWhiteMode='white'
          bgWhiteMode='#155DA9'
          bgDarkMode='#293A4A'
          forcusBorderColor='white'
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BoardType boardType={board?.type} />
        <InviteBoardUser boardId={board._id} />
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  )
}

export default BoardBar
