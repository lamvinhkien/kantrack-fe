import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

const Language = () => {
  const { i18n, t } = useTranslation()
  const currentLang = i18n.language || 'vi'

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

  const changeLanguage = (lang) => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang)
      localStorage.setItem('language', lang)
    }
    closeMenu()
  }

  const renderShort = (lang) => (lang === 'vi' ? 'VI' : 'EN')

  return (
    <Tooltip
      title={t('change_language')}
      arrow
      placement="bottom"
      open={tooltipOpen}
    >
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ mr: 0.5 }}
      >
        <IconButton
          color="inherit"
          onClick={openMenu}
          sx={{
            color: 'white', fontWeight: 600, fontSize: 16,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          {renderShort(currentLang)}
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MenuItem
            selected={currentLang === 'vi'}
            onClick={() => changeLanguage('vi')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ fontWeight: 600 }}>VI</Box>
              <Box>{t('vi_language')}</Box>
            </Box>
          </MenuItem>

          <MenuItem
            selected={currentLang === 'en'}
            onClick={() => changeLanguage('en')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ fontWeight: 600 }}>EN</Box>
              <Box>{t('en_language')}</Box>
            </Box>
          </MenuItem>
        </Menu>
      </Box>
    </Tooltip>
  )
}

export default Language
