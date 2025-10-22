import { useState, useEffect } from 'react'
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
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Close as CloseIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
  Dashboard as DashboardIcon,
  ViewColumn as ViewColumnIcon,
  CreditCard as CreditCardIcon,
  InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material'
import { useColorScheme } from '@mui/material'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useSelector } from 'react-redux'
import { getScrollbarStyles } from '~/utils/formatters'

const BoardPermission = ({ ownerIds = [], boardPermission = {}, handleUpdatePermission }) => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [permissions, setPermissions] = useState(boardPermission)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    setPermissions(boardPermission)
  }, [boardPermission])

  const open = Boolean(anchorEl)
  const popoverId = open ? 'board-permission-popover' : undefined

  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

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

  const renderPermissionGroup = (title, icon, keys, disabled = false, divider = true) => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pt: 1.5, pb: 0.5 }}>
        {icon}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, opacity: 0.8 }}>
          {title}
        </Typography>
      </Box>

      <List disablePadding>
        {keys.map((key) => (
          <ListItem
            key={key}
            onClick={() => !disabled && handleTogglePermission(key)}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
              '&:hover': disabled ? {} : { bgcolor: 'rgba(0,0,0,0.04)' },
              opacity: disabled ? 0.9 : 1,
              userSelect: 'none'
            }}
          >
            <ListItemText
              primary={t(key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`))}
              primaryTypographyProps={{ fontSize: 14 }}
            />
            <Checkbox
              checked={permissions[key] || false}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                !disabled && handleTogglePermission(key)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              color="primary"
              size="small"
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              sx={{
                p: 0.3,
                '& .MuiSvgIcon-root': { fontSize: 20 },
                '&.Mui-disabled.Mui-checked': {
                  color: (theme) => theme.palette.primary.main
                },
                '&.Mui-disabled': {
                  opacity: 0.9
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      {divider && <Divider sx={{ my: 0.5 }} />}
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

      <BoardPermissionGate
        customCheck={() => ownerIds?.includes(currentUser._id)}
        fallback={
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
                minWidth: 300,
                maxWidth: 400,
                maxHeight: 500,
                backgroundColor: 'background.paper',
                display: 'flex',
                flexDirection: 'column'
              },
              onClick: (e) => e.stopPropagation()
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
              <Typography variant="subtitle2" sx={{ flex: 1, textAlign: 'center' }}>
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

            <Box
              sx={theme => ({
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(500px - 56px - 50px)',
                pb: 0.5,
                ...getScrollbarStyles(theme)
              })}
            >
              {renderPermissionGroup(t('board'), <DashboardIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.board, true)}
              {renderPermissionGroup(t('column'), <ViewColumnIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.column, true)}
              {renderPermissionGroup(t('card'), <CreditCardIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.card, true, false)}
            </Box>

            <Box
              sx={{
                p: 2,
                borderTop: mode === 'dark'
                  ? '1px solid rgba(255,255,255,0.12)'
                  : '1px solid rgba(0,0,0,0.12)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                color: 'warning.main'
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
              <Typography variant="body2">{t('admin_only')}</Typography>
            </Box>
          </Popover>
        }
      >
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
              minWidth: 300,
              maxWidth: 400,
              maxHeight: 500,
              backgroundColor: 'background.paper',
              display: 'flex',
              flexDirection: 'column'
            },
            onClick: (e) => e.stopPropagation()
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
            <Typography variant="subtitle2" sx={{ flex: 1, textAlign: 'center' }}>
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

          <Box
            sx={theme => ({
              overflowY: 'auto',
              flex: 1,
              maxHeight: 'calc(500px - 56px)',
              pb: 0.5,
              ...getScrollbarStyles(theme)
            })}
          >
            {renderPermissionGroup(t('board'), <DashboardIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.board)}
            {renderPermissionGroup(t('column'), <ViewColumnIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.column)}
            {renderPermissionGroup(t('card'), <CreditCardIcon sx={{ fontSize: 18, opacity: 0.8 }} />, groupedPermissions.card, false, false)}
          </Box>
        </Popover>
      </BoardPermissionGate>
    </>
  )
}

export default BoardPermission
