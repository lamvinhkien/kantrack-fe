import { useColorScheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined'
import Box from '@mui/material/Box'

const ModeSelect = () => {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    setMode(event.target.value)
  }

  return (
    <Select
      value={mode}
      onChange={handleChange}
      displayEmpty
      variant="standard"
      IconComponent={() => null}
      renderValue={(selected) => {
        switch (selected) {
        case 'light':
          return <LightModeIcon />
        case 'dark':
          return <DarkModeOutlinedIcon />
        case 'system':
          return <SettingsBrightnessOutlinedIcon />
        default:
          return null
        }
      }}
      sx={{
        marginTop: '1px',
        color: 'white',
        border: 'none',
        '& .MuiSelect-select': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          textAlign: 'center'
        },
        '& .MuiSelect-standard': {
          paddingRight: '0px !important'
        },
        '&::before, &::after': { display: 'none' },
        '.MuiSvgIcon-root': { color: 'white' }
      }}
    >
      <MenuItem value='light'>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightModeIcon />
          <Box>Light</Box>
        </Box>
      </MenuItem>
      <MenuItem value='dark'>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DarkModeOutlinedIcon />
          <Box>Dark</Box>
        </Box>
      </MenuItem>
      <MenuItem value='system'>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsBrightnessOutlinedIcon />
          <Box>System</Box>
        </Box>
      </MenuItem>
    </Select>
  )
}

export default ModeSelect
