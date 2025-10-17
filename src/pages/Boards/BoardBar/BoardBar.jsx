import Box from '@mui/material/Box'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardType from './BoardType'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { socketIoInstance } from '~/socketio/socketClient'
import { updateBoardDetailsAPI } from '~/apis'
import { updateCurrentActiveBoard, fetchBoardDetailsAPI } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch } from 'react-redux'
import RefreshBoard from './RefreshBoard'
import { useConfirm } from 'material-ui-confirm'
import { useTranslation } from 'react-i18next'

const BoardBar = ({ board }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onUpdateBoardTitle = (newTitle) => {
    const newBoard = { ...board }
    updateBoardDetailsAPI(board._id, { title: newTitle })
      .then(() => {
        if (newTitle) newBoard.title = newTitle
        dispatch(updateCurrentActiveBoard(newBoard))
        socketIoInstance.emit('FE_UPDATE_BOARD', { boardId: newBoard._id, board: newBoard })
      })
  }

  const onUpdateBoardType = (newType) => {
    const newBoard = { ...board }
    updateBoardDetailsAPI(board._id, { type: newType })
      .then(() => {
        if (newType) newBoard.type = newType
        dispatch(updateCurrentActiveBoard(newBoard))
        socketIoInstance.emit('FE_UPDATE_BOARD', { boardId: newBoard._id, board: newBoard })
      })
  }

  const confirmRemoveMember = useConfirm()
  const onRemoveMember = (removeMember) => {
    const newBoard = { ...board }
    confirmRemoveMember({
      title: t('remove_member'),
      description: t('confirm_remove_member'),
      confirmationText: t('confirm'),
      cancellationText: t('cancel'),
      confirmationButtonProps: { color: 'error' }
    })
      .then(() => {
        updateBoardDetailsAPI(board._id, { removeMember })
          .then(() => {
            newBoard.memberIds = newBoard.memberIds.filter(id => id !== removeMember._id)
            newBoard.members = newBoard.members.filter(member => member._id !== removeMember._id)
            dispatch(updateCurrentActiveBoard(newBoard))
            socketIoInstance.emit('FE_UPDATE_BOARD', { boardId: newBoard._id, board: newBoard })
          })
      })
      .catch(() => { })
  }

  const confirmAssignAdmin = useConfirm()
  const onAssignAdmin = (assignAdmin) => {
    const newBoard = { ...board }
    confirmAssignAdmin({
      title: t('assign_admin'),
      description: t('confirm_assign_admin'),
      confirmationText: t('confirm'),
      cancellationText: t('cancel'),
      confirmationButtonProps: { color: 'primary' }
    })
      .then(() => {
        updateBoardDetailsAPI(board._id, { assignAdmin })
          .then(() => {
            newBoard.memberIds = newBoard.memberIds.filter(id => id !== assignAdmin._id)
            newBoard.ownerIds = [...newBoard.ownerIds, assignAdmin._id]
            newBoard.members = newBoard.members.filter(member => member._id !== assignAdmin._id)
            newBoard.owners = [...newBoard.owners, assignAdmin]
            dispatch(updateCurrentActiveBoard(newBoard))
            socketIoInstance.emit('FE_UPDATE_BOARD', { boardId: newBoard._id, board: newBoard })
          })
      })
      .catch(() => { })
  }

  const onRefreshBoard = () => {
    dispatch(fetchBoardDetailsAPI(board._id))
  }

  return (
    <Box sx={{
      width: '100%',
      height: theme => theme.kantrack.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 2,
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#293A4A' : '#155DA9'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ minWidth: '400px' }}>
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
        <RefreshBoard handleRefresh={onRefreshBoard} />
        <BoardType boardType={board?.type} handleUpdateBoardType={onUpdateBoardType} />
        <InviteBoardUser boardId={board._id} />
        <BoardUserGroup
          boardMembers={board?.members}
          boardOwners={board?.owners}
          handleRemoveMember={onRemoveMember}
          handleAssignAdmin={onAssignAdmin}
        />
        {/* Settings */}
      </Box>
    </Box>
  )
}

export default BoardBar
