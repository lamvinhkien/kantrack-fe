import CancelIcon from '@mui/icons-material/Cancel'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import PreviewAttachment from '../Attachment/PreviewAttachment'

const HeaderCover = ({ columnTitle, cover, handleDeleteCardCover, handleDeleteCard, handleCloseModal }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [previewFile, setPreviewFile] = useState(null)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: '14px',
          right: '20px',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          gap: 2
        }}
      >
        <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
          <MoreHorizIcon
            sx={{
              fontSize: 28,
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.400' : 'grey.800',
              '&:hover': { color: 'grey.600' }
            }}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {cover?.attachment && cover?.publicId && (
            <MenuItem
              onClick={() => {
                handleDeleteCardCover(cover)
                handleCloseMenu()
              }}
              sx={{ fontSize: 14 }}
            >
              <ImageNotSupportedIcon fontSize="small" sx={{ mr: 1 }} />
              Remove cover
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              handleDeleteCard()
              handleCloseMenu()
            }}
            sx={{ fontSize: 14 }}
          >
            <DeleteForeverIcon fontSize="small" sx={{ mr: 1 }} />
            Delete card
          </MenuItem>
        </Menu>

        <IconButton onClick={handleCloseModal} sx={{ p: 0 }}>
          <CancelIcon
            sx={{
              fontSize: 28,
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.400' : 'grey.800',
              '&:hover': { color: 'grey.600' }
            }}
          />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '14px',
          left: '30px',
          zIndex: 10
        }}
      >
        <Box sx={{
          bgcolor: 'grey.800',
          padding: '2px 8px 2px 8px', borderRadius: 2
        }}
        >
          <Typography variant='span' sx={{ fontWeight: 500, color: 'white', fontSize: '14px' }}>
            {columnTitle}
          </Typography>
        </Box>
      </Box>

      {cover?.attachment && cover?.publicId
        ?
        <>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              position: 'relative',
              width: '100%',
              height: '150px',
              minHeight: '150px',
              maxHeight: '150px',
              overflow: 'hidden',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#151a1f' : 'grey.100'
            }}
          >
            <Box
              component="img"
              onClick={() => setPreviewFile(cover)}
              src={cover?.attachment}
              alt="card-cover"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                '&:hover': { opacity: 0.7 }
              }}
            />
          </Box>
          <PreviewAttachment att={previewFile} onClose={() => setPreviewFile(null)} />
        </>
        :
        <Box sx={{
          minHeight: 56,
          maxHeight: 56,
          width: '100%',
          borderBottom: 1,
          borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? '#151a1f' : 'grey.100'
        }}>
        </Box>
      }
    </>
  )
}

export default HeaderCover
