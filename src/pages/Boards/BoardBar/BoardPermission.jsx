import { useState } from 'react'
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Popover,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import CloseIcon from '@mui/icons-material/Close'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import { useColorScheme } from '@mui/material'

const BoardPermission = ({ boardPermission = {}, handleUpdatePermission }) => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [permissions, setPermissions] = useState(boardPermission)

  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)
  const popoverId = open ? 'board-permission-popover' : undefined

  const handleTogglePermission = (key) => {
    const newPermissions = { ...permissions, [key]: !permissions[key] }
    setPermissions(newPermissions)
    handleUpdatePermission(newPermissions)
  }

  const groupedPermissions = {
    board: Object.keys(permissions).filter((k) => k.toLowerCase().includes('board')),
    column: Object.keys(permissions).filter((k) => k.toLowerCase().includes('column')),
    card: Object.keys(permissions).filter((k) => k.toLowerCase().includes('card'))
  }

  const renderPermissionGroup = (title, icon, keys) => (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          pt: 1.5,
          pb: 0.5
        }}
      >
        {icon}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            opacity: 0.8
          }}
        >
          {title}
        </Typography>
      </Box>

      <List disablePadding>
        {keys.map((key) => (
          <ListItem
            key={key}
            onClick={() => handleTogglePermission(key)}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 0.5,
              cursor: 'pointer',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)'
              },
              transition: 'background-color 0.2s ease'
            }}
          >
            <ListItemText
              primary={t(key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`))}
              primaryTypographyProps={{ fontSize: 14 }}
            />
            <Checkbox
              checked={permissions[key] || false}
              onChange={() => handleTogglePermission(key)}
              color="primary"
              size="small"
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              onClick={(e) => e.stopPropagation()}
              sx={{
                p: 0.3,
                '& .MuiSvgIcon-root': { fontSize: 20 }
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 0.5 }} />
    </>
  )

  return (
    <>
      <Tooltip arrow title={t('manage_permissions')}>
        <Box
          onClick={handleOpen}
          sx={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            textWrap: 'nowrap',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' }
          }}
        >
          <AdminPanelSettingsIcon />
          <Typography variant="body2" fontWeight={500}>
            {t('permission')}
          </Typography>
        </Box>
      </Tooltip>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: 3,
            width: 'auto',
            minWidth: 320,
            maxWidth: 400,
            maxHeight: 400,
            overflowY: 'auto',
            backgroundColor: 'background.paper'
          }
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: mode === 'dark' ? '#2f2f2f' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            borderBottom:
              mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              flex: 1,
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >
            {t('manage_permissions')}
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 14, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {renderPermissionGroup(t('board'), <DashboardIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.board)}
        {renderPermissionGroup(t('column'), <ViewColumnIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.column)}
        {renderPermissionGroup(t('card'), <CreditCardIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.card)}
      </Popover>
    </>
  )
}

export default BoardPermission
