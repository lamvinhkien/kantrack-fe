import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { socketIoInstance } from '~/socketio/socketClient'
import { useTranslation } from 'react-i18next'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { BOARD_MEMBER_ACTIONS } from '~/utils/constants'

const ListColumns = ({ columns }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [loading, setLoading] = useState(false)

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error(t('enter_column_title'))
      return
    }

    if (newColumnTitle.length < 3) {
      toast.error(t('min_title', { limit: 3 }))
      return
    }

    if (newColumnTitle.length > 25) {
      toast.error(t('max_title', { limit: 25 }))
      return
    }

    try {
      setLoading(true)

      const newColumnData = { title: newColumnTitle }
      const createdColumn = await createNewColumnAPI({ ...newColumnData, boardId: board._id })

      createdColumn.cards = [generatePlaceholderCard(createdColumn)]
      createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

      const newBoard = cloneDeep(board)
      newBoard.columns.push(createdColumn)
      newBoard.columnOrderIds.push(createdColumn._id)
      dispatch(updateCurrentActiveBoard(newBoard))

      socketIoInstance.emit('FE_ADD_COLUMN_IN_BOARD', { boardId: newBoard._id, board: newBoard })

      toggleOpenNewColumnForm()
      setNewColumnTitle('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        pr: 2,
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column key={column._id} column={column} />)}

        <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.addColumn}>
          {!openNewColumnForm
            ?
            <Box onClick={toggleOpenNewColumnForm} sx={{
              minWidth: '250px',
              maxWidth: '250px',
              ml: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}>
              <Button
                sx={{
                  color: 'white',
                  width: '100%',
                  justifyContent: 'flex-start',
                  pl: 2.5,
                  py: 1
                }}
                startIcon={<NoteAddIcon />}
              >
                {t('add_new_column')}
              </Button>
            </Box>
            :
            <Box sx={{
              minWidth: '250px',
              maxWidth: '250px',
              ml: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
                value={newColumnTitle}
                onChange={(event) => setNewColumnTitle(event.target.value)}
                id="outlined-search"
                label={t('enter_column_title')}
                type="text"
                size='small'
                variant="outlined"
                autoFocus
                sx={{
                  '& label': { color: 'white' },
                  '& input': { color: 'white' },
                  '& label.Mui-focused': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1 }}>
                <Button
                  className='interceptor-loading'
                  onClick={addNewColumn}
                  variant='contained' color='success' size='small'
                  disabled={loading}
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
                  sx={{
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  fontSize='small'
                  onClick={toggleOpenNewColumnForm}
                />
              </Box>
            </Box>
          }
        </BoardPermissionGate>
      </Box>
    </SortableContext>
  )
}

export default ListColumns