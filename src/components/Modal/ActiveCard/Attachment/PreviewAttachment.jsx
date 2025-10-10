import { Dialog, DialogContent, DialogTitle, Button, Typography, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { getDownloadUrl, formatFileSize, isImageUrl, isPdfUrl, isVideoUrl } from '~/utils/formatters'
import { renderTime } from '~/utils/formatters'
import { useTranslation } from 'react-i18next'

const PreviewAttachment = ({ att, onClose }) => {
  const { t } = useTranslation()

  if (!att) return null

  const isImage = isImageUrl(att.url)
  const isPdf = isPdfUrl(att.url)
  const isVideo = isVideoUrl(att.url)

  return (
    <Dialog
      open={!!att} onClose={onClose} fullScreen
      PaperProps={{
        sx: { backgroundColor: 'transparent', boxShadow: 'none' }
      }}
      BackdropProps={{
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
      }}
    >
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 4, right: 4, color: 'white' }}>
        <CloseIcon />
      </IconButton>

      <DialogContent
        dividers={false}
        sx={{
          overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center',
          pt: 2, px: 7, pb: 0
        }}
      >
        {isImage && (
          <img src={att.url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}

        {isPdf && (
          <iframe key={att.url} src={att.url}
            width="100%" height="100%" style={{ border: 'none' }} title={t('pdfPreview')} allowFullScreen
          />
        )}

        {isVideo && (
          <video key={att.url} src={att.url}
            width="100%" height="100%" style={{ maxHeight: '100%' }} controls autoPlay
          />
        )}

        {!isImage && !isPdf && !isVideo && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white', fontSize: '22px' }}>
              {t('noPreview')}
            </Typography>
            <Button sx={{ mt: 1, gap: 1 }} href={getDownloadUrl(att.url, att.displayText)}
              download variant="contained" component='a'
            >
              <FileDownloadIcon fontSize="small" />
              {t('downloadFile')}
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogTitle
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: 'white', pt: 2, pb: 2, gap: 1
        }}
      >
        <Typography
          variant='caption'
          sx={{
            fontWeight: 600, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', textAlign: 'center', fontSize: '22px'
          }}
          title={att.displayText || ''}
        >
          {att.displayText || ''}
        </Typography>

        <Typography
          variant='body1'
          sx={{
            maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap', textAlign: 'center'
          }}
        >
          {t('added')} {renderTime(att.uploadedAt)} • {formatFileSize(att.size)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component="a"
            href={getDownloadUrl(att.url, att.displayText)}
            download
            variant="outlined"
            sx={{
              color: 'white',
              border: 'none',
              textTransform: 'none',
              '&:hover': {
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.08)'
              }
            }}
            startIcon={<FileDownloadIcon />}
          >
            {t('download')}
          </Button>

          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: 'white',
              border: 'none',
              textTransform: 'none',
              '&:hover': {
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.08)'
              }
            }}
            startIcon={<CloseIcon />}
          >
            {t('close')}
          </Button>
        </Box>
      </DialogTitle>
    </Dialog>
  )
}

export default PreviewAttachment
