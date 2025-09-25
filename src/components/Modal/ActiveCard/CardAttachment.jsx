import { useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { TextField } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import ListSubheader from '@mui/material/ListSubheader'
import { Link as MuiLink } from '@mui/material'
import ListItemIcon from '@mui/material/ListItemIcon'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

const isImageUrl = (url) => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
}

const CardAttachment = ({ CardAttachmentsProp, handleUpdateCardAttachment }) => {
  const { mode } = useColorScheme()
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-attachments-popover' : undefined

  const files = CardAttachmentsProp?.filter(att => att.type === 'file') || []
  const links = CardAttachmentsProp?.filter(att => att.type === 'link') || []

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const handleAddFile = (e) => {
    if (e) handleUpdateCardAttachment([...e.target.files], null)
    e.target.value = ''
    setAnchorPopoverElement(null)
  }

  const handleAddLink = (data) => {
    const { link, displayText } = data
    handleUpdateCardAttachment(null, { link, displayText })
    reset()
    setAnchorPopoverElement(null)
  }

  return (
    <Box sx={{ mt: -4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          sx={{ alignSelf: 'flex-end' }}
          onClick={handleTogglePopover}
          type="button"
          variant="contained"
          color="info"
          size="small"
          startIcon={<AddIcon />}
        >
          Add
        </Button>

        <Popover
          id={popoverId}
          open={isOpenPopover}
          anchorEl={anchorPopoverElement}
          onClose={handleTogglePopover}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box sx={{ p: 2, width: 300, bgcolor: mode === 'dark' ? 'grey.900' : 'background.paper', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <AttachFileOutlinedIcon fontSize='small' />
              <Typography variant="span">Attach</Typography>
            </Box>
            <Button component='label' variant='outlined'>
              Choose a file
              <VisuallyHiddenInput type="file" multiple onChange={handleAddFile}
              />
            </Button>

            <Divider sx={{ my: 2 }} />

            <form onSubmit={handleSubmit(handleAddLink)}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                <LinkIcon fontSize='small' />
                <Typography variant="span">Link</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField label='Paste a link' size='small' fullWidth
                  error={!!errors['link']}
                  {...register('link', {
                    required: FIELD_REQUIRED_MESSAGE
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'link'} />
              </Box>

              <TextField label='Text to display' size='small' fullWidth sx={{ mb: 2 }} {...register('displayText')} />

              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="outlined" onClick={handleTogglePopover}>
                  Cancel
                </Button>
                <Button variant="contained" type='submit'>
                  Insert
                </Button>
              </Box>
            </form>
          </Box>
        </Popover>

        <Box data-color-mode={mode} >
          {/* Files Section */}
          {files.length > 0 && (
            <List
              dense
              subheader={<ListSubheader component="div">📎 Files</ListSubheader>}
            >
              {files.map((att, idx) => (
                <ListItem key={`file-${idx}`} alignItems="flex-start">
                  {isImageUrl(att.attachment) ? (
                    <Box
                      component="img"
                      src={att.attachment}
                      alt={att.displayText || `File ${idx + 1}`}
                      sx={{
                        maxWidth: 120,
                        maxHeight: 120,
                        objectFit: 'cover',
                        borderRadius: 1,
                        mr: 2
                      }}
                    />
                  ) : (
                    <ListItemIcon>
                      <InsertDriveFileIcon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <MuiLink
                    href={att.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ flexGrow: 1 }}
                  >
                    <ListItemText
                      primary={att.displayText || `File ${idx + 1}`}
                      secondary={att.uploadedAt ? new Date(att.uploadedAt).toLocaleString() : null}
                    />
                  </MuiLink>
                </ListItem>
              ))}
            </List>
          )}

          {/* Links Section */}
          {links.length > 0 && (
            <List
              dense
              subheader={<ListSubheader component="div">🔗 Links</ListSubheader>}
            >
              {links.map((att, idx) => (
                <ListItem key={`link-${idx}`}>
                  <ListItemIcon>
                    <LinkIcon fontSize="small" />
                  </ListItemIcon>
                  <MuiLink
                    href={att.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ flexGrow: 1 }}
                  >
                    <ListItemText
                      primary={att.displayText || `Link ${idx + 1}`}
                      secondary={att.uploadedAt ? new Date(att.uploadedAt).toLocaleString() : null}
                    />
                  </MuiLink>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default CardAttachment
