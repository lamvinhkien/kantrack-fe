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
import { socketIoInstance } from '~/socketio/socketClient'
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
import usePopover from '~/hooks/usePopover'
import EditDate from './Date/EditDate'
import DateInfo from './Date/DateInfo'
import Title from './Title/Title'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import { useTranslation } from 'react-i18next'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { BOARD_MEMBER_ACTIONS } from '~/utils/constants'
import { getScrollbarStyles } from '~/utils/formatters'

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

const ActiveCard = () => {
  const { t } = useTranslation()
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
        .then(() => toast.success(t('upload_complete')))
        .finally(() => { event.target.value = '' }),
      { pending: t('updating') }
    )
  }

  const onDeleteCardCover = (cover) => {
    confirmDeleteCardCover({
      title: t('remove_cover'),
      description: t('confirm_remove_cover'),
      confirmationText: t('confirm'),
      cancellationText: t('cancel'),
      confirmationButtonProps: { color: 'error' }
    }).then(() => {
      toast.promise(
        callApiUpdateCard({ coverToDelete: cover })
          .then(() => toast.success(t('cover_removed'))),
        { pending: t('removing') }
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
    await callApiUpdateCard({ incomingMemberInfo })
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
          .then(() => toast.success(t('upload_complete'))),
        { pending: t('updating') }
      )
    }

    if (link) {
      callApiUpdateCard(link)
    }
  }

  const onUpdateCardAttachments = async (action, data) => {
    await callApiUpdateCard({ action, newAttachment: data })
  }

  const onUpdateCardDate = async (data) => {
    await callApiUpdateCard({ dates: data })
  }

  const onDeleteCard = async () => {
    confirmDeleteCard({
      title: t('delete_card'),
      description: t('confirm_delete_card'),
      confirmationText: t('confirm'),
      cancellationText: t('cancel'),
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
        { pending: t('deleting') }
      )

    }).catch(() => { })
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
          position: 'relative',
          width: { xs: '95%', sm: 720, md: 920, lg: 1080 },
          maxWidth: '1100px',
          minHeight: 'auto',
          maxHeight: { xs: 'calc(100vh - 48px)', sm: 680, md: 620 },
          bgcolor: 'white',
          boxShadow: 24,
          border: 'none',
          outline: 0,
          margin: { xs: '24px auto', sm: '32px auto', md: '50px auto' },
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#1E2A36' : '#fff',
          overflow: 'hidden'
        }}
      >
        <HeaderCover columnTitle={activeCard?.columnTitle} cover={activeCard?.cover} complete={activeCard?.complete}
          handleDeleteCardCover={onDeleteCardCover} handleDeleteCard={onDeleteCard} handleCloseModal={handleCloseModal}
          handleUpdateComplete={onUpdateComplete}
        />

        <Box sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden'
        }}>
          <Box
            sx={(theme) => ({
              flex: { xs: 'unset', md: 7.3 },
              width: { xs: '100%', md: 'calc(65% - 20px)' },
              padding: { xs: '12px 16px', md: '10px 30px 30px 30px' },
              overflowY: 'auto',
              minHeight: 0,
              borderBottom: { xs: 1, md: 'none' },
              ...getScrollbarStyles(theme)
            })}
          >
            <Title
              title={activeCard?.title}
              complete={activeCard?.complete}
              onUpdateCardTitle={onUpdateCardTitle}
              onUpdateComplete={onUpdateComplete}
            />

            <BoardPermissionGate
              actions={[
                BOARD_MEMBER_ACTIONS.editCardMember,
                BOARD_MEMBER_ACTIONS.editCardCover,
                BOARD_MEMBER_ACTIONS.editCardDate,
                BOARD_MEMBER_ACTIONS.editCardAttachment
              ]}
              fallback={<Box sx={{ mt: -2 }}></Box>}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
                <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.editCardMember}>
                  {
                    activeCard?.memberIds?.includes(currentUser._id)
                      ?
                      <SidebarItem
                        className='active'
                        onClick={() => onUpdateCardMembers({ userId: currentUser._id, action: CARD_MEMBER_ACTIONS.REMOVE })}
                      >
                        <LogoutIcon fontSize="small" />
                        {t('left')}
                      </SidebarItem>
                      :
                      <SidebarItem
                        className='active'
                        onClick={() => onUpdateCardMembers({ userId: currentUser._id, action: CARD_MEMBER_ACTIONS.ADD })}
                      >
                        <PersonOutlinedIcon fontSize="small" />
                        {t('join')}
                      </SidebarItem>
                  }
                </BoardPermissionGate>

                <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.editCardCover}>
                  <SidebarItem className='active' component="label">
                    <ImageOutlinedIcon fontSize="small" /> {t('cover')}
                    <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
                  </SidebarItem>
                </BoardPermissionGate>

                <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.editCardDate}>
                  <SidebarItem className='active' onClick={editDatePopover.openPopover}>
                    <WatchLaterOutlinedIcon fontSize="small" /> {t('dates')}
                  </SidebarItem>
                </BoardPermissionGate>

                <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.editCardAttachment}>
                  <SidebarItem className='active' component="label" onClick={addAttachmentPopover.openPopover}>
                    <AttachmentIcon fontSize="small" /> {t('attachment')}
                  </SidebarItem>
                </BoardPermissionGate>
              </Stack>
            </BoardPermissionGate>

            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <GroupOutlinedIcon fontSize='small' />
                  <Typography sx={{ fontWeight: 'bold' }}>{t('member')}</Typography>
                </Box>
                <UserGroup
                  cardMemberIds={activeCard?.memberIds}
                  onUpdateCardMembers={onUpdateCardMembers}
                />
              </Box>

              {activeCard?.dates?.dueDate && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <AccessAlarmIcon fontSize='small' />
                    <Typography sx={{ fontWeight: 'bold' }}>{t('dates')}</Typography>
                  </Box>
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
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '18px' }}>{t('description')}</Typography>
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
                    <Typography variant="span" sx={{ fontWeight: '600', fontSize: '18px' }}>{t('attachment')}</Typography>
                  </Box>
                  <BoardPermissionGate action={BOARD_MEMBER_ACTIONS.editCardAttachment}>
                    <Button
                      onClick={addAttachmentPopover.openPopover}
                      type="button"
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<AddIcon />}
                    >
                      {t('add')}
                    </Button>
                  </BoardPermissionGate>
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
              flex: { xs: 'unset', md: 4.7 },
              width: { xs: '100%', md: 'calc(35% - 20px)' },
              padding: { xs: '12px 16px', md: '12px 20px 20px 20px' },
              overflowY: 'auto',
              minHeight: 0,
              bgcolor: theme.palette.mode === 'dark' ? '#151a1f' : 'grey.200',
              ...getScrollbarStyles(theme),
              borderTop: { xs: 1, md: 'none' }
            })}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>{t('comment')}</Typography>
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
