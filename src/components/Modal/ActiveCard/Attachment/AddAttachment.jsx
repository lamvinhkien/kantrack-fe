import { useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import { TextField } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import { useForm } from 'react-hook-form'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { useTranslation } from 'react-i18next'

const AddAttachment = ({ open, anchorEl, onClose, handleAddCardAttachment }) => {
  const { t } = useTranslation()
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
          width: 350,
          maxWidth: 350,
          bgcolor: mode === 'dark' ? 'grey.900' : 'background.paper',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            mb: 1,
            pb: 1
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {t('addAttachment')}
          </Typography>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: -8,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <InsertDriveFileOutlinedIcon fontSize='small' />
          <Typography variant="span">{t('file')}</Typography>
        </Box>

        <Button component='label' variant='contained' sx={{ mb: 2.5 }}>
          {t('chooseFile')}
          <VisuallyHiddenInput type="file" multiple onChange={handleAddFile} />
        </Button>

        <form onSubmit={handleSubmit(handleAddLink)}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LinkIcon fontSize='small' />
            <Typography variant="span">{t('link')}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label={t('pasteLink')}
              size="small"
              multiline
              fullWidth
              error={!!errors['link']}
              {...register('link', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i,
                  message: t('enterValidUrl')
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'link'} />
          </Box>

          <TextField
            label={t('textToDisplay')}
            size='small'
            multiline
            fullWidth
            sx={{ mb: 2 }}
            {...register('displayText')}
          />

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button variant="text" color='inherit' onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button variant="contained" type='submit'>
              {t('add')}
            </Button>
          </Box>
        </form>
      </Box>
    </Popover>
  )
}

export default AddAttachment
