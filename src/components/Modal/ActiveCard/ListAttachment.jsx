import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import { Link as MuiLink } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import moment from 'moment'
import TextField from '@mui/material/TextField'
import { CARD_ATTACHMENT_ACTIONS } from '~/utils/constants'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import AttachmentPreview from './AttachmentPreview'
import { useColorScheme } from '@mui/material/styles'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { getDownloadUrl, isImageUrl, isVideoUrl, getFileExtension } from '~/utils/formatters'
import { toast } from 'react-toastify'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

const ListAttachment = ({ ListAttachments, handleUpdateCardAttachments, handleAddCardAttachment }) => {
  const { mode } = useColorScheme()
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [selectedAttachment, setSelectedAttachment] = useState(null)
  const [modePopover, setModePopover] = useState('main')
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-list-attachments-popover' : undefined

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const [previewFile, setPreviewFile] = useState(null)

  const files = ListAttachments?.filter(att => att.type === 'file') || []
  const links = ListAttachments?.filter(att => att.type === 'link') || []

  const handleOpenPopover = (event, att) => {
    setAnchorPopoverElement(event.currentTarget)
    setSelectedAttachment(att)
    setModePopover('main')
    reset({ newLink: att.attachment, newDisplayText: att.displayText })
  }

  const handleClosePopover = () => {
    setAnchorPopoverElement(null)
    setSelectedAttachment(null)
    setModePopover('main')
  }

  const handleEditDisplayText = (action, data) => {
    const { newDisplayText, newLink } = data
    if (newLink) {
      handleUpdateCardAttachments(action, { ...selectedAttachment, newLink: newLink.trim(), displayText: newDisplayText.trim() })
    } else {
      handleUpdateCardAttachments(action, { ...selectedAttachment, displayText: newDisplayText.trim() })
    }
    setAnchorPopoverElement(null)
    setSelectedAttachment(null)
  }

  const handleRemoveAttachment = (action) => {
    toast.promise(
      handleUpdateCardAttachments(action, selectedAttachment),
      { pending: 'Removing...' }
    )
    setAnchorPopoverElement(null)
    setSelectedAttachment(null)
  }

  const handleAddFile = (e) => {
    if (e) handleAddCardAttachment([...e.target.files], null)
    e.target.value = ''
    setAnchorPopoverElement(null)
  }

  return (
    <Box>
      {
        ListAttachments && ListAttachments.length > 0
          ?
          <>
            {files.length > 0 && (
              <>
                <List sx={{ mt: 1 }}>
                  <Typography sx={{ fontWeight: '500' }}>Files</Typography>
                  {files.map((att, idx) => (
                    <ListItem
                      key={`file-${idx}`}
                      disablePadding
                      sx={{ mt: 1.5, gap: 2, pr: 1, display: 'flex', alignItems: 'center' }}
                    >
                      {isImageUrl(att.attachment) ? (
                        <Box
                          component="img"
                          src={att.attachment}
                          alt={att.displayText || `File ${idx + 1}`}
                          sx={{
                            width: 45,
                            height: 45,
                            objectFit: 'cover',
                            borderRadius: 1,
                            cursor: 'pointer'
                          }}
                          onClick={() => setPreviewFile(att)}
                        />
                      ) : isVideoUrl(att.attachment) ? (
                        <Box
                          onClick={() => setPreviewFile(att)}
                          sx={{
                            width: 45,
                            height: 45,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: mode === 'dark' ? 'grey.800' : 'grey.200',
                            cursor: 'pointer'
                          }}
                        >
                          <PlayCircleIcon sx={{ fontSize: 24, color: mode === 'dark' ? 'white' : '#555' }} />
                        </Box>
                      ) : (
                        <Box
                          onClick={() => setPreviewFile(att)}
                          sx={{
                            width: 45,
                            height: 45,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: mode === 'dark' ? 'grey.800' : 'grey.200',
                            fontWeight: 'bold',
                            fontSize: 10,
                            color: mode === 'dark' ? 'white' : '#555',
                            cursor: 'pointer'
                          }}
                        >
                          {getFileExtension(att.attachment)}
                        </Box>
                      )}
                      <MuiLink
                        sx={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
                        component="span"
                        underline="none"
                        onClick={() => setPreviewFile(att)}
                      >
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: mode === 'dark' ? 'grey.300' : 'grey.700',
                            wordBreak: 'break-word',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {att.displayText || att.attachment}
                        </Typography>
                        {att.uploadedAt && (
                          <Typography sx={{ color: mode === 'dark' ? 'grey.500' : 'grey.600' }}>
                            {moment(att.uploadedAt).format('lll')}
                          </Typography>
                        )}
                      </MuiLink>
                      <Button
                        sx={{ ml: 'auto', minWidth: 'unset', width: 25, height: 25 }}
                        onClick={(e) => handleOpenPopover(e, att)}
                        variant="outlined"
                        color="primary"
                        size="small"
                      >
                        <MoreHorizIcon fontSize="small" />
                      </Button>
                    </ListItem>
                  ))}
                </List>
                <AttachmentPreview att={previewFile} onClose={() => setPreviewFile(null)} />
              </>
            )}

            {links.length > 0 && (
              <List sx={{ mt: files.length > 0 ? 0 : 1 }}>
                <Typography sx={{ fontWeight: '500' }}>Links</Typography>
                {links.map((att, idx) => (
                  <ListItem
                    key={`link-${idx}`}
                    disablePadding
                    sx={{
                      mt: 1,
                      gap: 2,
                      bgcolor: mode === 'dark' ? '#151a1f' : 'grey.200',
                      p: 1,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                      <Box
                        component="img"
                        src={`https://www.google.com/s2/favicons?sz=64&domain_url=${att.attachment}`}
                        alt="favicon"
                        sx={{ width: 22, height: 22 }}
                      />
                      <MuiLink
                        href={att.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}
                      >
                        <ListItemText
                          primary={att.displayText || att.attachment}
                          primaryTypographyProps={{
                            noWrap: true,
                            sx: {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }
                          }}
                        />
                      </MuiLink>
                    </Box>
                    <Button
                      sx={{ ml: 1, minWidth: 'unset', width: 25, height: 25 }}
                      onClick={(e) => handleOpenPopover(e, att)}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      <MoreHorizIcon fontSize="small" />
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}

            <Popover
              id={popoverId}
              open={isOpenPopover}
              anchorEl={anchorPopoverElement}
              onClose={handleClosePopover}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              {modePopover === 'main' && (
                <MenuList>
                  <MenuItem onClick={() => setModePopover('edit')}>
                    <Typography>Edit</Typography>
                  </MenuItem>
                  {selectedAttachment?.type === 'file' && (
                    <MenuItem component="a" download
                      href={getDownloadUrl(selectedAttachment?.attachment, selectedAttachment?.displayText)}
                    >
                      <Typography>Download</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => setModePopover('remove')}>
                    <Typography color="error.light">Remove</Typography>
                  </MenuItem>
                </MenuList>
              )}

              {modePopover === 'edit' && (
                <Box sx={{ p: 2, width: 350 }}>
                  <form onSubmit={handleSubmit((data) => handleEditDisplayText(CARD_ATTACHMENT_ACTIONS.EDIT, data))}>
                    {selectedAttachment?.type === 'link'
                      ?
                      <>
                        <TextField fullWidth size="medium" label="Link"
                          error={!!errors['newLink']}
                          {...register('newLink', {
                            required: FIELD_REQUIRED_MESSAGE,
                            pattern: {
                              value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                              message: 'Please enter a valid URL'
                            }
                          })}
                        />
                        <FieldErrorAlert errors={errors} fieldName={'newLink'} />
                        <TextField label='Display text' size='medium' fullWidth sx={{ mt: 2 }} {...register('newDisplayText')} />
                      </>
                      :
                      <TextField
                        fullWidth size="medium"
                        label='File name'
                        error={!!errors['newDisplayText']}
                        {...register('newDisplayText', {
                          required: FIELD_REQUIRED_MESSAGE
                        })}
                      />
                    }
                    <FieldErrorAlert errors={errors} fieldName={'newDisplayText'} />
                    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                      <Button size="small" color='inherit' onClick={() => setModePopover('main')}>Cancel</Button>
                      <Button size="small" variant="contained" type='submit'>Save</Button>
                    </Stack>
                  </form>
                </Box>
              )}

              {modePopover === 'remove' && (
                <Box sx={{ p: 2, width: 220 }}>
                  <Typography sx={{ mb: 2 }}>Remove this attachment?</Typography>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" color='inherit' onClick={() => setModePopover('main')}>Cancel</Button>
                    <Button size="small" variant="contained" color="error" onClick={() => handleRemoveAttachment(CARD_ATTACHMENT_ACTIONS.REMOVE)}>Remove</Button>
                  </Stack>
                </Box>
              )}
            </Popover>
          </>
          :
          <Box
            component='label'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              mt: 2,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: mode === 'dark' ? '#151a1f' : 'grey.100',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <UploadFileIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2" color="text.secondary">Attach a file from your computer</Typography>
            <VisuallyHiddenInput type="file" multiple onChange={handleAddFile} />
          </Box>
      }
    </Box>
  )
}

export default ListAttachment
