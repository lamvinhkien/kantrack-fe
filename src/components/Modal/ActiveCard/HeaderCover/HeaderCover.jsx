import CloseIcon from '@mui/icons-material/Close'
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
          left: '30px',
          zIndex: 10
        }}
      >
        <Box sx={{
          bgcolor: 'grey.800',
          padding: '3px 10px 3px 10px', borderRadius: 2
        }}
        >
          <Typography variant='span' sx={{ fontWeight: 500, color: 'white', fontSize: '14px' }}>
            {columnTitle}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '14px',
          right: '20px',
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          gap: 1.5
        }}
      >
        <IconButton
          onClick={handleOpenMenu}
          sx={{
            p: 0.5,
            bgcolor: 'grey.800',
            color: 'white',
            '&:hover': {
              bgcolor: 'grey.700'
            }
          }}
        >
          <MoreHorizIcon sx={{ fontSize: 24 }} />
        </IconButton>

        <IconButton
          onClick={handleCloseModal}
          sx={{
            p: 0.5,
            bgcolor: 'grey.800',
            color: 'white',
            '&:hover': {
              bgcolor: 'grey.700'
            }
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {cover?.url && cover?.publicId && (
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
            sx={{
              fontSize: 14,
              mt: 1,
              '&:hover': { color: 'error.main', '& .delete-forever-icon': { color: 'error.main' } }
            }}
          >
            <DeleteForeverIcon fontSize="small" sx={{ mr: 1 }} />
            Delete card
          </MenuItem>
        </Menu>
      </Box>

      {cover?.url && cover?.publicId
        ?
        <>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 150,
              minHeight: 150,
              maxHeight: 150,
              overflow: 'hidden',
              borderBottom: 1,
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#151a1f' : 'grey.100'
            }}
          >
            {cover?.url && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${cover.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(15px) brightness(0.6)',
                  transform: 'scale(1.2)',
                  transition: 'filter 0.3s ease'
                }}
              />
            )}

            {cover?.url && (
              <Box
                component="img"
                onClick={() => setPreviewFile(cover)}
                src={cover.url}
                alt="card-cover"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease',
                  '&:hover': { opacity: 0.7 }
                }}
              />
            )}
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
