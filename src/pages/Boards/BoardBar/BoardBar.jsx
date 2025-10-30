import Box from '@mui/material/Box'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BoardType from './BoardType'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { socketIoInstance } from '~/socketio/socketClient'
import { updateBoardDetailsAPI, deleteBoardDetailsAPI } from '~/apis'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch } from 'react-redux'
import RefreshBoard from './RefreshBoard'
import { useConfirm } from 'material-ui-confirm'
import { useTranslation } from 'react-i18next'
import BoardSettings from './BoardSettings'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { BOARD_MEMBER_ACTIONS } from '~/utils/constants'
import Typography from '@mui/material/Typography'
import { selectCurrentUser, updateUserAPI, updateCurrentUser } from '~/redux/user/userSlice'
import { useSelector } from 'react-redux'
import FavouriteBoard from './FavouriteBoard'
import { useState } from 'react'

const BoardBar = ({ board, handleRefresh }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const onUpdateBoardTitle = (newTitle) => {
    if (newTitle.length < 3) {
      toast.error(t('min_title', { limit: 3 }))
      return
    }

    if (newTitle.length > 35) {
      toast.error(t('max_title', { limit: 35 }))
      return
    }

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
    return updateBoardDetailsAPI(board._id, { type: newType })
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
            socketIoInstance.emit('FE_REMOVE_MEMBER', { boardId: newBoard._id, removedUserId: removeMember._id })
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

  const confirmLeaveBoard = useConfirm()
  const onLeaveBoard = (leaveUser) => {
    const newBoard = { ...board }

    const ownerIds = newBoard.ownerIds || []
    const memberIds = newBoard.memberIds || []

    const isOwner = ownerIds.includes(leaveUser._id)
    const isLastOwner = isOwner && ownerIds.length === 1
    const isOnlyMember = ownerIds.length + memberIds.length === 1

    if (isOnlyMember) {
      toast.error(t('cannot_leave_as_last_member'))
      return
    }

    if (isLastOwner) {
      toast.error(t('cannot_leave_as_last_owner'))
      return
    }

    confirmLeaveBoard({
      title: t('leave_board'),
      description: t('confirm_leave_board'),
      confirmationText: t('confirm'),
      cancellationText: t('cancel'),
      confirmationButtonProps: { color: 'error' }
    })
      .then(() => {
        updateBoardDetailsAPI(board._id, { leaveBoard: leaveUser })
          .then(() => {
            if (newBoard.ownerIds?.includes(leaveUser._id))
              newBoard.ownerIds = newBoard.ownerIds.filter(id => id !== leaveUser._id)

            if (newBoard.owners?.some(owner => owner._id === leaveUser._id))
              newBoard.owners = newBoard.owners.filter(owner => owner._id !== leaveUser._id)

            if (newBoard.memberIds?.includes(leaveUser._id))
              newBoard.memberIds = newBoard.memberIds.filter(id => id !== leaveUser._id)

            if (newBoard.members?.some(member => member._id === leaveUser._id))
              newBoard.members = newBoard.members.filter(member => member._id !== leaveUser._id)

            dispatch(updateCurrentActiveBoard(newBoard))
            socketIoInstance.emit('FE_UPDATE_BOARD', {
              boardId: newBoard._id,
              board: newBoard
            })

            navigate('/boards')
          })
      })
      .catch(() => { })
  }

  const onUpdatePermission = (updatePermissions) => {
    const newBoard = { ...board }
    updateBoardDetailsAPI(board._id, { updatePermissions })
      .then(() => {
        newBoard.memberPermissions = updatePermissions
        dispatch(updateCurrentActiveBoard(newBoard))
        socketIoInstance.emit('FE_UPDATE_BOARD', { boardId: newBoard._id, board: newBoard })
      })
  }

  const isFavourite = currentUser?.favouriteBoards?.some(b => b.boardId === board?._id)
  const onFavouriteBoard = () => {
    dispatch(updateUserAPI({ favouriteAction: true, boardId: board?._id }))
    if (isFavourite) {
      dispatch(updateCurrentUser({
        ...currentUser,
        favouriteBoards: currentUser.favouriteBoards.filter(b => b.boardId !== board?._id)
      }))
    } else {
      dispatch(updateCurrentUser({
        ...currentUser,
        favouriteBoards: [
          { boardId: board?._id, viewedAt: Date.now() },
          ...(currentUser?.favouriteBoards || [])
        ]
      }))
    }
  }

  const [isDeletingBoard, setIsDeletingBoard] = useState(false)
  const confirmDeleteBoard = useConfirm()
  const onDeleteBoard = () => {
    confirmDeleteBoard({
      title: t('delete_board'),
      description: t('confirm_delete_board'),
      confirmationText: t('confirm'),
      cancellationText: t('cancel'),
      confirmationButtonProps: { color: 'error' }
    })
      .then(async () => {
        setIsDeletingBoard(true)
        try {
          await deleteBoardDetailsAPI(board?._id)
          toast.success(t('board_deleted'))
          socketIoInstance.emit('FE_DELETE_BOARD', board?._id)
          navigate('/boards')
        } finally {
          setIsDeletingBoard(false)
        }
      })
      .catch(() => { })
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
      overflowY: 'hidden',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#293A4A' : '#155DA9'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ minWidth: '400px' }}>
        <BoardPermissionGate
          action={BOARD_MEMBER_ACTIONS.editBoardTitle}
          fallback={
            <Typography
              sx={{
                '&.MuiTypography-root': {
                  fontSize: '18px !important',
                  fontWeight: 'bold',
                  color: 'white'
                },
                px: '6px'
              }}
            >
              {board?.title}
            </Typography>
          }
        >
          <ToggleFocusInput
            value={board?.title}
            onChangedValue={onUpdateBoardTitle}
            inputFontSize='18px'
            colorWhiteMode='white'
            bgWhiteMode='#155DA9'
            bgDarkMode='#293A4A'
            forcusBorderColor='white'
          />
        </BoardPermissionGate>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FavouriteBoard
          handleFavourite={onFavouriteBoard}
          favourite={isFavourite}
        />

        <RefreshBoard handleRefresh={handleRefresh} />

        <BoardType
          boardType={board?.type}
          handleUpdateBoardType={onUpdateBoardType}
          ownerIds={board?.ownerIds}
          memberIds={board?.memberIds}
          currentUser={currentUser}
        />

        <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.inviteMemberToBoard}>
          <InviteBoardUser boardId={board._id} />
        </BoardPermissionGate>

        <BoardSettings
          ownerIds={board?.ownerIds}
          memberIds={board?.memberIds}
          boardPermission={board?.memberPermissions}
          handleUpdatePermission={onUpdatePermission}
          handleDeleteBoard={onDeleteBoard}
          isDeletingBoard={isDeletingBoard}
          currentUser={currentUser}
        />

        <BoardUserGroup
          boardMembers={board?.members}
          boardOwners={board?.owners}
          handleRemoveMember={onRemoveMember}
          handleAssignAdmin={onAssignAdmin}
          handleLeaveBoard={onLeaveBoard}
          currentUser={currentUser}
        />
      </Box>
    </Box>
  )
}

export default BoardBar
