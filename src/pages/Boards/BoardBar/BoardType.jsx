import { useState } from 'react'
import { Box, Tooltip, Menu, MenuItem, Typography, ListItemIcon, ListItemText, Divider } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import { capitalizeFirstLetter } from '~/utils/formatters'

const BoardType = ({ boardType, onChangeBoardType }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (type) => {
    if (type !== boardType) {
      onChangeBoardType?.(type)
    }
    handleClose()
  }

  const isPublic = boardType === 'public'

  return (
    <>
      <Tooltip title={isPublic ? 'This board is public' : 'This board is private'}>
        <Box
          onClick={handleClick}
          sx={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.12)'
            }
          }}
        >
          {isPublic ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />}
          <Typography variant="body2" fontWeight={500}>
            {capitalizeFirstLetter(boardType)}
          </Typography>
        </Box>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            Change visibility
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => handleSelect('public')}>
          <ListItemIcon>
            <PublicIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Public"
            secondary="Anyone on the internet can see this board."
          />
        </MenuItem>
        <MenuItem onClick={() => handleSelect('private')}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Private"
            secondary="Only board members can see this board."
          />
        </MenuItem>
      </Menu>
    </>
  )
}

export default BoardType
