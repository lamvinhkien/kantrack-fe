import { useColorScheme } from '@mui/material/styles'
import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Popover,
  TextField,
  Typography
} from '@mui/material'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import moment from 'moment'

const EditDate = ({ open, anchorEl, onClose, handleEditDate }) => {
  const { mode } = useColorScheme()
  const popoverId = open ? 'card-edit-date-popover' : undefined

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      startDate: null,
      dueDate: moment(),
      dueTime: moment(),
      reminder: 'None'
    }
  })

  const [hasStartDate, setHasStartDate] = useState(false)

  const onSubmit = (data) => {
    const payload = {
      startDate: hasStartDate ? data.startDate?.format('DD-MM-YYYY') : null,
      dueDate: data.dueDate?.format('DD-MM-YYYY'),
      dueTime: data.dueTime?.format('HH:mm'),
      reminder: data.reminder
    }
    handleEditDate(payload)
    onClose()
    reset()
  }

  return (
    <Popover
      id={popoverId}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
    >
      <Box
        sx={{
          p: 2,
          width: 320,
          bgcolor: mode === 'dark' ? 'grey.900' : 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Start date
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox
              checked={hasStartDate}
              onChange={(e) => setHasStartDate(e.target.checked)}
              sx={{ p: 0.5 }}
            />

            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  format="DD-MM-YYYY"
                  disabled={!hasStartDate}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true
                    }
                  }}
                />
              )}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Due date
          </Typography>

          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                format="DD-MM-YYYY"
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            )}
          />

          <Controller
            name="dueTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                value={field.value}
                onChange={field.onChange}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Set due date reminder
          </Typography>

          <Controller
            name="reminder"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                fullWidth
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="5m">5 minutes before</MenuItem>
                <MenuItem value="10m">10 minutes before</MenuItem>
                <MenuItem value="30m">30 minutes before</MenuItem>
                <MenuItem value="1h">1 hour before</MenuItem>
                <MenuItem value="1d">1 day before</MenuItem>
              </TextField>
            )}
          />

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Email reminders will be sent to all members of this card.
          </Typography>

        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => {
              reset()
              onClose()
            }}
          >
            Remove
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}

export default EditDate
