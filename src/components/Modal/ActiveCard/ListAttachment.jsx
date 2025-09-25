import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import LinkIcon from '@mui/icons-material/Link'
import { Link as MuiLink } from '@mui/material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
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

const isImageUrl = (url) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

const ListAttachment = ({ ListAttachments, handleUpdateCardAttachments }) => {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [selectedAttachment, setSelectedAttachment] = useState(null)
  const [modePopover, setModePopover] = useState('main') // main | edit | remove

  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-list-attachments-popover' : undefined

  const { register, handleSubmit, formState: { errors } } = useForm()

  const files = ListAttachments?.filter(att => att.type === 'file') || []
  const links = ListAttachments?.filter(att => att.type === 'link') || []

  const handleOpenPopover = (event, att) => {
    setAnchorPopoverElement(event.currentTarget)
    setSelectedAttachment(att)
    setModePopover('main')
  }

  const handleClosePopover = () => {
    setAnchorPopoverElement(null)
    setSelectedAttachment(null)
    setModePopover('main')
  }

  const handleEditDisplayText = (action, data) => {
    const { newDisplayText } = data
    handleUpdateCardAttachments(action, { ...selectedAttachment, displayText: newDisplayText.trim() })
    setAnchorPopoverElement(null)
    setSelectedAttachment(null)
  }

  const handleRemoveAttachment = (action) => {
    handleUpdateCardAttachments(action, selectedAttachment)
    setAnchorPopoverElement(null)
    setSelectedAttachment(null)
  }

  return (
    <Box>
      {/* Files */}
      {files.length > 0 && (
        <List sx={{ mt: 1 }}>
          <Typography sx={{ fontWeight: '500' }}>Files</Typography>
          {files.map((att, idx) => (
            <ListItem key={`file-${idx}`} disablePadding sx={{ mt: 1.2 }}>
              {isImageUrl(att.attachment) ? (
                <Box
                  component="img"
                  src={att.attachment}
                  alt={att.displayText || `File ${idx + 1}`}
                  sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                />
              ) : (
                <Box
                  sx={{
                    width: 50, height: 50, borderRadius: 1, mr: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <InsertDriveFileIcon fontSize='large' color='disabled' />
                </Box>
              )}
              <MuiLink href={att.attachment} target="_blank" rel="noopener noreferrer" underline="none">
                <ListItemText
                  primary={att.displayText || `File ${idx + 1}`}
                  secondary={att.uploadedAt ? moment(att.uploadedAt).format('lll') : null}
                />
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
      )}

      {/* Links */}
      {links.length > 0 && (
        <List sx={{ mt: 1 }}>
          <Typography sx={{ fontWeight: '500' }}>Links</Typography>
          {links.map((att, idx) => (
            <ListItem key={`link-${idx}`} disablePadding sx={{ mt: 1.2 }}>
              <Box
                sx={{
                  width: 50, height: 50, borderRadius: 1, mr: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <LinkIcon fontSize='large' color='disabled' />
              </Box>
              <MuiLink href={att.attachment} target="_blank" rel="noopener noreferrer" underline="none">
                <ListItemText
                  primary={att.displayText || `Link ${idx + 1}`}
                  secondary={att.uploadedAt ? moment(att.uploadedAt).format('lll') : null}
                />
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
      )}

      {/* Popover */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {/* Main menu */}
        {modePopover === 'main' && (
          <MenuList>
            <MenuItem onClick={() => setModePopover('edit')}>
              <Typography>Edit</Typography>
            </MenuItem>
            {selectedAttachment?.type === 'file' && (
              <MenuItem component="a" href={selectedAttachment?.attachment} download>
                <Typography>Download</Typography>
              </MenuItem>
            )}
            <MenuItem onClick={() => setModePopover('remove')}>
              <Typography color="error.light">Remove</Typography>
            </MenuItem>
          </MenuList>
        )}

        {/* Edit menu */}
        {modePopover === 'edit' && (
          <Box sx={{ p: 2, width: 260 }}>
            <form onSubmit={handleSubmit((data) => handleEditDisplayText(CARD_ATTACHMENT_ACTIONS.EDIT, data))}>
              <TextField
                defaultValue={selectedAttachment?.displayText}
                fullWidth
                size="small"
                label="File name"
                error={!!errors['newDisplayText']}
                {...register('newDisplayText', {
                  required: FIELD_REQUIRED_MESSAGE
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'newDisplayText'} />
              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                <Button size="small" color='inherit' onClick={() => setModePopover('main')}>Cancel</Button>
                <Button size="small" variant="contained" type='submit'>Save</Button>
              </Stack>
            </form>
          </Box>
        )}

        {/* Remove confirm */}
        {modePopover === 'remove' && (
          <Box sx={{ p: 2, width: 260 }}>
            <Typography sx={{ mb: 2 }}>Remove this attachment?</Typography>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" color='inherit' onClick={() => setModePopover('main')}>Cancel</Button>
              <Button size="small" variant="contained" color="error" onClick={() => handleRemoveAttachment(CARD_ATTACHMENT_ACTIONS.REMOVE)}>Remove</Button>
            </Stack>
          </Box>
        )}
      </Popover>
    </Box>
  )
}

export default ListAttachment
