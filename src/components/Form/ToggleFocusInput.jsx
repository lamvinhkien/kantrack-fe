import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'

const ToggleFocusInput = ({
  value,
  onChangedValue,
  inputFontSize = '16px',
  colorDarkMode = 'white',
  colorWhiteMode = '#212121',
  bgDarkMode = '#33485D',
  bgWhiteMode = 'white',
  forcusBorderColor = 'primary.main',
  ...props }) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const triggerBlur = () => {
    setInputValue(inputValue.trim())

    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }
    onChangedValue(inputValue)
  }

  return (
    <TextField
      id="toggle-focus-input-controlled"
      fullWidth
      variant='outlined'
      size="small"
      value={inputValue}
      onChange={(event) => { setInputValue(event.target.value) }}
      onBlur={triggerBlur}
      {...props}
      sx={{
        '& label': {},
        '& input': {
          fontSize: inputFontSize, fontWeight: 'bold',
          color: (theme) => theme.palette.mode === 'dark' ? colorDarkMode : colorWhiteMode
        },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root:hover': {
          borderColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? bgDarkMode : bgWhiteMode,
          '& fieldset': { borderColor: forcusBorderColor }
        },
        '& .MuiOutlinedInput-input': {
          px: '6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }}
    />
  )
}

export default ToggleFocusInput
