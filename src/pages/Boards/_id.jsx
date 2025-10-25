/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { socketIoInstance } from '~/socketio/socketClient'
import { selectCurrentUser, updateCurrentUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Board = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const { boardId } = useParams()

  useEffect(() => {
    dispatch(updateCurrentActiveBoard(null))
    dispatch(fetchBoardDetailsAPI(boardId))
    dispatch(updateCurrentUser({
      ...currentUser,
      recentBoards: [
        { boardId, viewedAt: Date.now() },
        ...(currentUser?.recentBoards || []).filter(b => b.boardId !== boardId)
      ]
    }))
  }, [dispatch, boardId])

  useEffect(() => {
    if (!socketIoInstance) return

    const onReceiveNewBoard = (newBoard) => {
      if (newBoard._id !== boardId) return

      const isPrivate = newBoard.type === 'private'
      const isMember = newBoard.memberIds?.includes(currentUser._id)
      const isOwner = newBoard.ownerIds?.includes(currentUser._id)

      if (isPrivate && !isMember && !isOwner) {
        toast.error(t('access_removed'))
        dispatch(updateCurrentActiveBoard(null))
        socketIoInstance.emit('FE_LEAVE_BOARD', boardId)
        navigate('/boards')
        return
      }

      dispatch(updateCurrentActiveBoard(newBoard))
    }

    const onRemovedFromBoard = ({ boardId: removedBoardId, removedUserId }) => {
      if (removedUserId === currentUser._id && removedBoardId === boardId) {
        toast.error(t('removed_user_from_board'))
        dispatch(updateCurrentActiveBoard(null))
        socketIoInstance.emit('FE_LEAVE_BOARD', boardId)
        navigate('/boards')
      }
    }

    if (boardId) socketIoInstance.emit('FE_JOIN_BOARD', boardId)
    socketIoInstance.on('BE_UPDATE_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_MOVE_COLUMN_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_MOVE_CARD_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_ADD_COLUMN_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_DELETE_COLUMN_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_UPDATE_COLUMN_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_ADD_CARD_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_DELETE_CARD_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_UPDATE_CARD_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_REMOVE_MEMBER', onRemovedFromBoard)

    return () => {
      if (boardId) socketIoInstance.emit('FE_LEAVE_BOARD', boardId)
      socketIoInstance.off('BE_UPDATE_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_MOVE_COLUMN_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_MOVE_CARD_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_ADD_COLUMN_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_DELETE_COLUMN_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_UPDATE_COLUMN_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_ADD_CARD_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_DELETE_CARD_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_UPDATE_CARD_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_REMOVE_MEMBER', onRemovedFromBoard)
    }
  }, [dispatch, boardId, currentUser, navigate, t])

  const moveColumn = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds }).then(() => {
      socketIoInstance.emit('FE_MOVE_COLUMN_IN_BOARD', { boardId: newBoard._id, board: newBoard })
    })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds }).then(() => {
      socketIoInstance.emit('FE_MOVE_CARD_IN_BOARD', { boardId: newBoard._id, board: newBoard })
    })
  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds,
      boardId
    }).then(() => {
      socketIoInstance.emit('FE_MOVE_CARD_IN_BOARD', { boardId: newBoard._id, board: newBoard })
    })
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      {board
        ?
        <>
          <BoardBar board={board} />
          <BoardContent
            board={board}
            moveColumn={moveColumn}
            moveCardInTheSameColumn={moveCardInTheSameColumn}
            moveCardToDifferentColumn={moveCardToDifferentColumn}
          />
          <ActiveCard />
        </>
        :
        <PageLoadingSpinner caption={t('loading')} AppBar={true} />
      }
    </Container>
  )
}

export default Board
