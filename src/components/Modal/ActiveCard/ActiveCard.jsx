import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachmentIcon from '@mui/icons-material/Attachment'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import { imageFileValidator, multipleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import UserGroup from './UserGroup/UserGroup'
import DescriptionMdEditor from './Description/DescriptionMdEditor'
import Comment from './Comment/Comment'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectIsShowModalActiveCard,
  selectCurrentActiveCard,
  updateCurrentActiveCard,
  clearAndHideCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { updateCardDetailsAPI, deleteCardDetailsAPI } from '~/apis'
import { styled } from '@mui/material/styles'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { useEffect } from 'react'
import { socketIoInstance } from '~/socketClient'
import AddAttachment from './Attachment/AddAttachment'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import ListAttachment from './Attachment/ListAttachment'
import { useConfirm } from 'material-ui-confirm'
import HeaderCover from './HeaderCover/HeaderCover'
import { cloneDeep } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import usePopover from '~/customHooks/usePopover'
import EditDate from './Date/EditDate'
import DateInfo from './Date/DateInfo'
import Title from './Title/Title'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

const getScrollbarStyles = (theme) => ({
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#b0b0b0',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#777' : '#8c8c8c'
  },
  '&::-webkit-scrollbar-thumb:active': {
    backgroundColor: theme.palette.mode === 'dark' ? '#999' : '#666'
  },

  // Firefox support
  scrollbarWidth: 'thin',
  scrollbarColor:
    theme.palette.mode === 'dark'
      ? '#555 #1e1e1e'
      : '#b0b0b0 #f5f5f5'
})

const ActiveCard = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const confirmDeleteCardCover = useConfirm()
  const confirmDeleteCard = useConfirm()

  const addAttachmentPopover = usePopover()
  const editDatePopover = usePopover()

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  const callApiUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)
    dispatch(updateCurrentActiveCard({ ...updatedCard, columnTitle: activeCard.columnTitle }))
    socketIoInstance.emit('FE_UPDATE_ACTIVE_CARD', { cardId: activeCard._id, card: { ...updatedCard, columnTitle: activeCard.columnTitle } })

    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === activeCard.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = columnToUpdate.cards.map(card =>
        card._id === activeCard._id ? updatedCard : card
      )
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    socketIoInstance.emit('FE_UPDATE_CARD_IN_BOARD', { boardId: newBoard._id, board: newBoard })
  }

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateComplete = (complete) => {
    callApiUpdateCard({ complete: complete })
  }

  const onUploadCardCover = (event) => {
    const error = imageFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    toast.promise(
      callApiUpdateCard(reqData)
        .then(() => toast.success('Upload complete.'))
        .finally(() => { event.target.value = '' }),
      { pending: 'Updating...' }
    )
  }

  const onDeleteCardCover = (cover) => {
    confirmDeleteCardCover({
      title: 'Remove card cover?',
      description: 'This action will permanently remove your card cover, are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
      confirmationButtonProps: { color: 'error' }
    }).then(() => {
      toast.promise(
        callApiUpdateCard({ coverToDelete: cover })
          .then(() => toast.success('Cover removed.')),
        { pending: 'Removing...' }
      )
    }).catch(() => { })
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription.trim() })
  }

  const onUpdateCardComment = async (action, comment) => {
    await callApiUpdateCard({ action, comment })
  }

  const onUpdateCardMembers = async (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }

  const onAddCardAttachments = (files, link) => {
    if (files) {
      const error = multipleFileValidator(files)
      if (error) {
        toast.error(error)
        return
      }

      const reqData = new FormData()
      files.forEach(file => reqData.append('cardAttachments', file))

      toast.promise(
        callApiUpdateCard(reqData)
          .then(() => toast.success('Upload complete.')),
        { pending: 'Updating...' }
      )
    }

    if (link) {
      callApiUpdateCard(link)
    }
  }

  const onUpdateCardAttachments = async (action, data) => {
    await callApiUpdateCard({ action, newAttachment: data })
  }

  const onDeleteCard = async () => {
    confirmDeleteCard({
      title: 'Delete card?',
      description: 'This action will permanently delete your card, are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
      confirmationButtonProps: { color: 'error' }
    }).then(() => {
      toast.promise(
        deleteCardDetailsAPI(activeCard?._id)
          .then((res) => {
            const newBoard = cloneDeep(board)
            const columnToUpdate = newBoard.columns.find(column => column._id === activeCard.columnId)
            if (columnToUpdate) {
              columnToUpdate.cards = columnToUpdate.cards.filter(card => card._id !== activeCard._id)
              columnToUpdate.cardOrderIds = columnToUpdate.cardOrderIds.filter(card => card._id !== activeCard._id)

              if (columnToUpdate.cards.length === 0) {
                columnToUpdate.cards = [generatePlaceholderCard(columnToUpdate)]
                columnToUpdate.cardOrderIds = [generatePlaceholderCard(columnToUpdate)._id]
              }
            }
            dispatch(updateCurrentActiveBoard(newBoard))
            socketIoInstance.emit('FE_DELETE_CARD_IN_BOARD', { boardId: newBoard._id, board: newBoard })
            toast.success(res.deleteResult)
            handleCloseModal()
          }),
        { pending: 'Deleting...' }
      )

    }).catch(() => { })
  }

  const onUpdateCardDate = async (data) => {
    await callApiUpdateCard({ dates: data })
  }

  useEffect(() => {
    if (isShowModalActiveCard === true) {
      if (!socketIoInstance) return

      const onReceiveNewCard = (newCard) => {
        if (newCard._id === activeCard._id) dispatch(updateCurrentActiveCard(newCard))
      }

      if (activeCard._id) socketIoInstance.emit('FE_JOIN_ACTIVE_CARD', activeCard._id)
      socketIoInstance.on('BE_UPDATE_ACTIVE_CARD', onReceiveNewCard)

      return () => {
        if (activeCard._id) socketIoInstance.emit('FE_LEAVE_ACTIVE_CARD', activeCard._id)
        socketIoInstance.off('BE_UPDATE_ACTIVE_CARD', onReceiveNewCard)
      }
    }
  }, [dispatch, activeCard?._id, isShowModalActiveCard])

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal}
    >
      <Box
        sx={{
          position: 'relative', width: 1080, minHeight: 'auto', maxHeight: 620, bgcolor: 'white',
          boxShadow: 24, border: 'none', outline: 0, margin: '50px auto', display: 'flex', flexDirection: 'column',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1E2A36' : '#fff'
        }}
      >
        <HeaderCover columnTitle={activeCard?.columnTitle} cover={activeCard?.cover} complete={activeCard?.complete}
          handleDeleteCardCover={onDeleteCardCover} handleDeleteCard={onDeleteCard} handleCloseModal={handleCloseModal}
          handleUpdateComplete={onUpdateComplete}
        />

        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          <Box
            sx={(theme) => ({
              flex: 7.3, padding: '10px 30px 30px 30px',
              overflowY: 'auto', minHeight: 0, ...getScrollbarStyles(theme)
            })}
          >
            <Title
              title={activeCard?.title}
              complete={activeCard?.complete}
              onUpdateCardTitle={onUpdateCardTitle}
              onUpdateComplete={onUpdateComplete}
            />

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {
                activeCard?.memberIds?.includes(currentUser._id)
                  ?
                  <SidebarItem
                    className='active'
                    onClick={() => onUpdateCardMembers({ userId: currentUser._id, action: CARD_MEMBER_ACTIONS.REMOVE })}
                  >
                    <LogoutIcon fontSize="small" />
                    Left
                  </SidebarItem>
                  :
                  <SidebarItem
                    className='active'
                    onClick={() => onUpdateCardMembers({ userId: currentUser._id, action: CARD_MEMBER_ACTIONS.ADD })}
                  >
                    <PersonOutlinedIcon fontSize="small" />
                    Join
                  </SidebarItem>
              }

              <SidebarItem className='active' component="label">
                <ImageOutlinedIcon fontSize="small" /> Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              {!activeCard?.dates?.dueDate &&
                <SidebarItem className='active' onClick={editDatePopover.openPopover}>
                  <WatchLaterOutlinedIcon fontSize="small" /> Dates
                </SidebarItem>
              }

              {activeCard?.attachments?.length === 0 &&
                <SidebarItem className='active' component="label" onClick={addAttachmentPopover.openPopover}>
                  <AttachmentIcon fontSize="small" /> Attachment
                </SidebarItem>
              }
            </Stack>

            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box>
                <Typography sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Members</Typography>
                <UserGroup
                  cardMemberIds={activeCard?.memberIds}
                  onUpdateCardMembers={onUpdateCardMembers}
                />
              </Box>

              {activeCard?.dates?.dueDate && (
                <Box>
                  <Typography sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Dates</Typography>
                  <DateInfo
                    dates={activeCard?.dates}
                    complete={activeCard?.complete}
                    onClick={editDatePopover.openPopover}
                  />
                </Box>
              )}
            </Box>

            <Box sx={{ mt: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '18px' }}>Description</Typography>
              </Box>
              <DescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            {activeCard?.attachments?.length > 0 &&
              <Box sx={{ mt: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AttachmentIcon />
                    <Typography variant="span" sx={{ fontWeight: '600', fontSize: '18px' }}>Attachment</Typography>
                  </Box>
                  <Button
                    onClick={addAttachmentPopover.openPopover}
                    type="button"
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
                <ListAttachment
                  ListAttachments={activeCard?.attachments}
                  handleUpdateCardAttachments={onUpdateCardAttachments}
                />
              </Box>
            }
          </Box>

          <Box
            sx={(theme) => ({
              flex: 4.7,
              padding: '12px 20px 20px 20px',
              overflowY: 'auto',
              minHeight: 0,
              bgcolor: theme => theme.palette.mode === 'dark' ? '#151a1f' : 'grey.200',
              ...getScrollbarStyles(theme)
            })}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Comments</Typography>
              </Box>
              <Comment
                cardComments={activeCard?.comments}
                handleUpdateCardComment={onUpdateCardComment}
              />
            </Box>
          </Box>
        </Box>

        <AddAttachment
          open={addAttachmentPopover.isOpen}
          anchorEl={addAttachmentPopover.anchorEl}
          onClose={addAttachmentPopover.closePopover}
          handleAddCardAttachment={onAddCardAttachments}
        />
        <EditDate
          dates={activeCard?.dates}
          open={editDatePopover.isOpen}
          anchorEl={editDatePopover.anchorEl}
          onClose={editDatePopover.closePopover}
          handleEditCardDate={onUpdateCardDate}
        />
      </Box>
    </Modal>
  )
}

export default ActiveCard
