import { Dialog, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { slugify } from 'transliteration'

const getDownloadUrl = (url, filename) => {
  if (!url) return url

  let baseName = filename
    ? filename.replace(/\.[^/.]+$/, '')
    : url.split('/').pop().split('.')[0] || 'download'

  const safeBase = slugify(baseName, { separator: '_', lowercase: false }) || 'file'

  if (url.includes('fl_attachment')) return url

  return url.replace('/upload', `/upload/fl_attachment:${safeBase}`)
}

const AttachmentPreview = ({ file, onClose }) => {
  if (!file) return null

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url)
  const isPdf = /\.pdf$/i.test(file.url)

  return (
    <Dialog
      open={!!file}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.82)'
        }
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          color: 'white'
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        dividers={false}
        sx={{
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pt: 2,
          px: 7,
          pb: 0
        }}
      >
        {isImage && (
          <img
            src={file.url}
            alt="preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        )}

        {isPdf && (
          <iframe
            key={file.url}
            src={file.url}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="PDF Preview"
          />
        )}

        {!isImage && !isPdf && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
              There is no preview available for this attachment.
            </Typography>
            <Button
              sx={{ mt: 2, gap: 1 }}
              href={getDownloadUrl(file.url, file.name)}
              download
              variant="contained"
            >
              <FileDownloadIcon fontSize="small" />
              Download file
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogTitle
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 500,
          pt: 1,
          pb: 2,
          gap: 1
        }}
      >
        <Typography
          variant='span'
          sx={{
            fontWeight: 600,
            maxWidth: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'center'
          }}
          title={file.name}
        >
          {file.name || 'Preview'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component="a"
            href={getDownloadUrl(file.url, file.name)}
            download
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.08)'
              }
            }}
            startIcon={<FileDownloadIcon />}
          >
            Download
          </Button>

          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.08)'
              }
            }}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Box>
      </DialogTitle>
    </Dialog>
  )
}

export default AttachmentPreview
