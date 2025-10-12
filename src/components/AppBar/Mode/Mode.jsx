import { useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import { useTranslation } from 'react-i18next'

const ModeMenu = () => {
  const { t } = useTranslation()
  const { mode, setMode } = useColorScheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const [hover, setHover] = useState(false)
  const [disableUntil, setDisableUntil] = useState(0)

  const menuOpen = Boolean(anchorEl)
  const now = Date.now()
  const tooltipAllowed = now > disableUntil
  const tooltipOpen = hover && !menuOpen && tooltipAllowed

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget)
    setDisableUntil(Date.now() + 1000)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    setDisableUntil(Date.now() + 600)
    setHover(false)
  }

  const handleChange = (newMode) => {
    setMode(newMode)
    closeMenu()
  }

  const renderIcon = (m) => {
    switch (m) {
    case 'light': return <LightModeIcon fontSize="medium" />
    case 'dark': return <DarkModeOutlinedIcon fontSize="medium" />
    default: return null
    }
  }

  return (
    <Tooltip
      title={t('change_theme')}
      arrow
      placement="bottom"
      open={tooltipOpen}
    >
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ mr: -0.5 }}
      >
        <IconButton
          color="inherit"
          onClick={openMenu}
          sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
        >
          {renderIcon(mode)}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MenuItem selected={mode === 'light'} onClick={() => handleChange('light')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LightModeIcon fontSize="small" />
              <Box>{t('light_mode')}</Box>
            </Box>
          </MenuItem>

          <MenuItem selected={mode === 'dark'} onClick={() => handleChange('dark')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DarkModeOutlinedIcon fontSize="small" />
              <Box>{t('dark_mode')}</Box>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    </Tooltip>
  )
}

export default ModeMenu
