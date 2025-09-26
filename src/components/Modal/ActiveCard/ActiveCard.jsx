import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { singleFileValidator, multipleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectIsShowModalActiveCard,
  selectCurrentActiveCard,
  updateCurrentActiveCard,
  clearAndHideCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { updateCardDetailsAPI } from '~/apis'
import { styled } from '@mui/material/styles'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { useEffect } from 'react'
import { socketIoInstance } from '~/socketClient'
import AddAttachment from './AddAttachment'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import ListAttachment from './ListAttachment'

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
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)

  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
  }

  const callApiUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)
    dispatch(updateCurrentActiveCard(updatedCard))
    dispatch(updateCardInBoard(updatedCard))
    socketIoInstance.emit('FE_UPDATE_CARD', { cardId: activeCard._id, card: updatedCard })
  }

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUploadCardCover = (event) => {
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    toast.promise(
      callApiUpdateCard(reqData).finally(() => { event.target.value = '' }),
      { pending: 'Updating...' }
    )
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription.trim() })
  }

  const onAddCardComment = async (commentToAdd) => {
    await callApiUpdateCard({ commentToAdd })
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
        callApiUpdateCard(reqData),
        { pending: 'Updating...' }
      )
    }

    if (link) callApiUpdateCard(link)
  }

  const onUpdateCardAttachments = (action, data) => {
    callApiUpdateCard({ action, newAttachment: data })
  }

  useEffect(() => {
    if (isShowModalActiveCard === true) {
      if (!socketIoInstance) return

      const onReceiveNewCard = (newCard) => {
        if (newCard._id === activeCard._id) dispatch(updateCurrentActiveCard(newCard))
      }

      if (activeCard._id) socketIoInstance.emit('FE_JOIN_CARD', activeCard._id)
      socketIoInstance.on('BE_UPDATE_CARD', onReceiveNewCard)

      return () => {
        if (activeCard._id) socketIoInstance.emit('FE_LEAVE_CARD', activeCard._id)
        socketIoInstance.off('BE_UPDATE_CARD', onReceiveNewCard)
      }
    }
  }, [dispatch, activeCard?._id, isShowModalActiveCard])

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal}
    >
      <Box sx={{
        position: 'relative',
        width: 1050,
        minheight: 510,
        maxHeight: 610,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '20px 30px 20px 30px',
        margin: '50px auto',
        overflowY: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '8px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover &&
          <Box>
            <img
              style={{ width: '100%', height: '200px', objectFit: 'contain' }}
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        }

        <Grid container spacing={2}>
          <Grid xs={12} sm={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCardIcon />
              <ToggleFocusInput
                inputFontSize='22px'
                value={activeCard?.title}
                onChangedValue={onUpdateCardTitle}
              />
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
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

              <SidebarItem className='active'>
                <WatchLaterOutlinedIcon fontSize="small" /> Deadline
              </SidebarItem>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AttachFileOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Attachment</Typography>
              </Box>
              <AddAttachment handleAddCardAttachment={onAddCardAttachments} />
              <ListAttachment ListAttachments={activeCard?.attachments} handleUpdateCardAttachments={onUpdateCardAttachments} />
            </Box>
          </Grid>
          <Grid xs={12} sm={5}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Comments</Typography>
              </Box>
              <CardActivitySection
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
