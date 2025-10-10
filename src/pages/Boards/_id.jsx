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

const Board = () => {
  const dispatch = useDispatch()

  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()

  useEffect(() => {
    dispatch(updateCurrentActiveBoard(null))
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  useEffect(() => {
    if (!socketIoInstance) return

    const onReceiveNewBoard = (newBoard) => {
      if (newBoard._id === boardId) dispatch(updateCurrentActiveBoard(newBoard))
    }

    if (boardId) socketIoInstance.emit('FE_JOIN_BOARD', boardId)
    socketIoInstance.on('BE_UPDATE_BOARD_TITLE', onReceiveNewBoard)
    socketIoInstance.on('BE_MOVE_COLUMN_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_MOVE_CARD_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_ADD_COLUMN_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_DELETE_COLUMN_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_UPDATE_COLUMN_TITLE_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_ADD_CARD_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_DELETE_CARD_IN_BOARD', onReceiveNewBoard)
    socketIoInstance.on('BE_UPDATE_CARD_IN_BOARD', onReceiveNewBoard)

    return () => {
      if (boardId) socketIoInstance.emit('FE_LEAVE_BOARD', boardId)
      socketIoInstance.off('BE_UPDATE_BOARD_TITLE', onReceiveNewBoard)
      socketIoInstance.off('BE_MOVE_COLUMN_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_MOVE_CARD_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_ADD_COLUMN_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_DELETE_COLUMN_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_UPDATE_COLUMN_TITLE_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_ADD_CARD_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_DELETE_CARD_IN_BOARD', onReceiveNewBoard)
      socketIoInstance.off('BE_UPDATE_CARD_IN_BOARD', onReceiveNewBoard)
    }
  }, [dispatch, boardId])

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
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    }).then(() => {
      socketIoInstance.emit('FE_MOVE_CARD_IN_BOARD', { boardId: newBoard._id, board: newBoard })
    })
  }

  if (!board) return <PageLoadingSpinner caption='Loading Board...' />

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <ActiveCard />
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumn={moveColumn}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
