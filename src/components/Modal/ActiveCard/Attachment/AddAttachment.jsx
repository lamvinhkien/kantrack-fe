import { useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Popover from '@mui/material/Popover'
import { TextField } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import { useForm } from 'react-hook-form'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

const AddAttachment = ({ open, anchorEl, onClose, handleAddCardAttachment }) => {
  const { mode } = useColorScheme()
  const popoverId = open ? 'card-add-attachments-popover' : undefined

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const handleAddFile = (e) => {
    if (e) handleAddCardAttachment([...e.target.files], null)
    e.target.value = ''
    onClose?.()
  }

  const handleAddLink = (data) => {
    const { link, displayText } = data
    handleAddCardAttachment(null, { link, displayText })
    reset()
    onClose?.()
  }

  return (
    <Popover
      id={popoverId}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
    >
      <Box
        sx={{
          p: 2,
          width: 300,
          bgcolor: mode === 'dark' ? 'grey.900' : 'background.paper',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <AttachFileOutlinedIcon fontSize='small' />
          <Typography variant="span">Attach</Typography>
        </Box>

        <Button component='label' variant='contained'>
          Choose a file
          <VisuallyHiddenInput type="file" multiple onChange={handleAddFile} />
        </Button>

        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit(handleAddLink)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
            <LinkIcon fontSize='small' />
            <Typography variant="span">Link</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Paste a link"
              size="medium"
              fullWidth
              error={!!errors['link']}
              {...register('link', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                  message: 'Please enter a valid URL'
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'link'} />
          </Box>

          <TextField
            label='Text to display'
            size='medium'
            fullWidth
            sx={{ mb: 2 }}
            {...register('displayText')}
          />

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="text" color='inherit' onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" type='submit'>
              Add
            </Button>
          </Box>
        </form>
      </Box>
    </Popover>
  )
}

export default AddAttachment
