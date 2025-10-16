import { Box, Checkbox, Tooltip } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import ToggleFocusInput from '~/components/form/ToggleFocusInput'
import { useTranslation } from 'react-i18next'

const Title = ({ title, complete, onUpdateCardTitle, onUpdateComplete }) => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()

  const handleCheckboxChange = (event) => {
    onUpdateComplete(event.target.checked)
  }

  const checkColor = mode === 'dark' ? '#b3e863ff' : '#47ad4eff'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip
        title={complete ? t('mark_incomplete') : t('mark_complete')}
        arrow
        placement="top"
      >
        <Checkbox
          checked={complete}
          onChange={handleCheckboxChange}
          icon={<RadioButtonUncheckedIcon sx={{ fontSize: 22 }} />}
          checkedIcon={<CheckCircleIcon sx={{ fontSize: 22 }} />}
          sx={{
            p: 0.1,
            transition: 'all 0.2s ease-in-out',
            '&.Mui-checked': {
              color: checkColor,
              transform: 'scale(1.1)'
            },
            '&:hover': {
              transform: 'scale(1.2)'
            }
          }}
        />
      </Tooltip>

      <ToggleFocusInput
        inputFontSize="22px"
        value={title}
        onChangedValue={onUpdateCardTitle}
      />
    </Box>
  )
}

export default Title
