import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material'

const AttachmentPreview = ({ file, onClose }) => {
  if (!file) return null

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url)
  const isPdf = /\.pdf$/i.test(file.url)

  return (
    <Dialog open={!!file} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{file.name || 'Preview'}</DialogTitle>
      <DialogContent dividers>
        {isImage && (
          <img
            src={file.url}
            alt="preview"
            style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }}
          />
        )}
        {isPdf && (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(file.url)}&embedded=true`}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            title="PDF Preview"
          />
        )}
        {!isImage && !isPdf && (
          <Button
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
          >
            Download file
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AttachmentPreview
