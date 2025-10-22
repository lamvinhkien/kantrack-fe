import { useState } from 'react'
import { toast } from 'react-toastify'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import React from 'react'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useConfirm } from 'material-ui-confirm'
import { cloneDeep } from 'lodash'
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { socketIoInstance } from '~/socketio/socketClient'
import { useTranslation } from 'react-i18next'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { BOARD_MEMBER_ACTIONS } from '~/utils/constants'
import Typography from '@mui/material/Typography'
import { useBoardPermission } from '~/hooks/useBoardPermission'

const Column = ({ column }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { can } = useBoardPermission()
  const [loading, setLoading] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column },
    disabled: !can(BOARD_MEMBER_ACTIONS.moveColumn)
  })

  const dndKitColumnStyles = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const orderedCards = column.cards.map((card) => {
    return {
      ...card,
      columnTitle: column?.title
    }
  })

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error(t('enter_card_title'))
      return
    }

    try {
      setLoading(true)

      const newCardData = { title: newCardTitle.trim(), columnId: column._id }
      const createdCard = await createNewCardAPI({ ...newCardData, boardId: board._id })
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
      if (columnToUpdate) {
        if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
          columnToUpdate.cards = [createdCard]
          columnToUpdate.cardOrderIds = [createdCard._id]
        } else {
          columnToUpdate.cards.push(createdCard)
          columnToUpdate.cardOrderIds.push(createdCard._id)
        }
      }

      dispatch(updateCurrentActiveBoard(newBoard))
      socketIoInstance.emit('FE_ADD_CARD_IN_BOARD', { boardId: newBoard._id, board: newBoard })

      toggleOpenNewCardForm()
      setNewCardTitle('')
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: t('delete_column'),
      description: t('confirm_delete_column'),
      confirmationText: t('confirm'),
      cancellationText: t('cancel'),
      confirmationButtonProps: { color: 'error' }
    }).then(() => {
      toast.promise(
        deleteColumnDetailsAPI(column._id)
          .then(res => {
            const newBoard = { ...board }
            newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
            newBoard.columnOrderIds = newBoard.columnOrderIds.filter(c => c.id !== column._id)
            dispatch(updateCurrentActiveBoard(newBoard))
            socketIoInstance.emit('FE_DELETE_COLUMN_IN_BOARD', { boardId: newBoard._id, board: newBoard })
            toast.success(res?.deleteResult)
          }),
        { pending: t('deleting') }
      )

    }).catch(() => { })
  }

  const onUpdateColumnTitle = (newTitle) => {
    updateColumnDetailsAPI(column._id, { title: newTitle.trim() }).then(() => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(c => c._id === column._id)
      if (columnToUpdate) columnToUpdate.title = newTitle
      dispatch(updateCurrentActiveBoard(newBoard))
      socketIoInstance.emit('FE_UPDATE_COLUMN_IN_BOARD', { boardId: newBoard._id, board: newBoard })
    })
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: theme => theme.palette.mode === 'dark' ? '#1E2A36' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: theme => `calc(${theme.kantrack.boardContentHeight} - ${theme.spacing(5)})`
        }}>
        {/* Header */}
        <Box sx={{
          height: theme => theme.kantrack.columnHeaderHeight,
          p: '8px 10px 8px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <BoardPermissionGate
            action={BOARD_MEMBER_ACTIONS.editColumnTitle}
            fallback={
              <Typography
                sx={{
                  '&.MuiTypography-root': {
                    fontSize: '16px !important',
                    fontWeight: 'bold'
                  },
                  px: '6px'
                }}
              >
                {column?.title}
              </Typography>
            }
          >
            <ToggleFocusInput value={column?.title} onChangedValue={onUpdateColumnTitle} data-no-dnd="true" />
          </BoardPermissionGate>

          <Box>
            <BoardPermissionGate
              actions={[BOARD_MEMBER_ACTIONS.deleteColumn]}
            >
              <Tooltip title={t('more_options')}>
                <ExpandMoreIcon
                  sx={{ color: 'text.primary', cursor: 'pointer' }}
                  id="column-dropdown"
                  aria-controls={open ? 'menu-column-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>

              <Menu
                id="menu-column-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                  list: {
                    'aria-labelledby': 'column-dropdown'
                  }
                }}
              >
                <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.deleteColumn}>
                  <MenuItem
                    onClick={handleDeleteColumn}
                    sx={{
                      '&:hover': {
                        color: 'error.main',
                        '& .delete-forever-icon': { color: 'error.main' }
                      }
                    }}
                  >
                    <ListItemIcon><DeleteForeverIcon className='delete-forever-icon' fontSize="small" /></ListItemIcon>
                    <ListItemText>{t('delete_column')}</ListItemText>
                  </MenuItem>
                </BoardPermissionGate>
              </Menu>
            </BoardPermissionGate>
          </Box>
        </Box>

        {/* List card */}
        <ListCards cards={orderedCards} />

        {/* Footer */}
        <BoardPermissionGate
          actions={[BOARD_MEMBER_ACTIONS.addCard, BOARD_MEMBER_ACTIONS.moveColumn]}
          fallback={
            <Box sx={{
              p: 1
            }}></Box>
          }
        >
          <Box sx={{
            height: theme => theme.kantrack.columnFooterHeight,
            p: 2
          }}>
            {!openNewCardForm
              ?
              <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <BoardPermissionGate
                  action={BOARD_MEMBER_ACTIONS.addCard}
                  fallback={<Box sx={{ flex: 1 }} />}
                >
                  <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>{t('add_new_card')}</Button>
                </BoardPermissionGate>
                <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.moveColumn}>
                  <Tooltip title={t('drag_to_move')}>
                    <DragHandleIcon sx={{
                      cursor: 'pointer',
                      color: 'text.primary',
                      ml: 'auto'
                    }} />
                  </Tooltip>
                </BoardPermissionGate>
              </Box>
              :
              <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.addCard}>
                <Box sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TextField
                    value={newCardTitle}
                    onChange={(event) => setNewCardTitle(event.target.value)}
                    id="outlined-search"
                    label={t('enter_card_title')}
                    type="text"
                    size='small'
                    variant="outlined"
                    autoFocus
                    data-no-dnd="true"
                    sx={{
                      '& label': { color: 'text.primary' },
                      '& input': {
                        color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                        bgcolor: theme => theme.palette.mode === 'dark' ? '#333643' : 'white'
                      },
                      '& label.Mui-focused': { color: theme => theme.palette.primary.main },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: theme => theme.palette.primary.main },
                        '&:hover fieldset': { borderColor: theme => theme.palette.primary.main },
                        '&.Mui-focused fieldset': { borderColor: theme => theme.palette.primary.main }
                      },
                      '& .MuiOutlinedInput-input': {
                        borderRadius: 1
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      className='interceptor-loading'
                      onClick={addNewCard}
                      variant='contained'
                      color='success'
                      size='small'
                      disabled={loading}
                      data-no-dnd="true"
                      sx={{
                        boxShadow: 'none',
                        border: '0.5px solid',
                        borderColor: theme => theme.palette.success.main,
                        '&:hover': { bgcolor: theme => theme.palette.success.main }
                      }}
                    >
                      {t('add')}
                    </Button>

                    <CloseIcon
                      data-no-dnd="true"
                      sx={{
                        color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                        cursor: 'pointer'
                      }}
                      fontSize='small'
                      onClick={toggleOpenNewCardForm}
                    />
                  </Box>
                </Box>
              </BoardPermissionGate>
            }
          </Box>
        </BoardPermissionGate>
      </Box>
    </div>
  )
}

export default Column