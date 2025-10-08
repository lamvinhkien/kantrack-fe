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
import { useState, useEffect } from 'react'
import moment from 'moment'

const EditDate = ({ dates, open, anchorEl, onClose, handleEditCardDate }) => {
  const { mode } = useColorScheme()
  const popoverId = open ? 'card-edit-date-popover' : undefined

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      startDate: dates?.startDate ? moment(dates.startDate) : null,
      dueDate: dates?.dueDate ? moment(dates.dueDate) : moment(),
      dueTime: dates?.dueTime ? moment(dates.dueTime, 'HH:mm') : moment(),
      reminder: dates?.reminder?.enabled
        ? mapMinutesToString(dates.reminder.timeBefore)
        : 'None'
    }
  })

  const [hasStartDate, setHasStartDate] = useState(!!dates?.startDate)

  useEffect(() => {
    reset({
      startDate: dates?.startDate ? moment(dates.startDate) : null,
      dueDate: dates?.dueDate ? moment(dates.dueDate) : moment(),
      dueTime: dates?.dueTime ? moment(dates.dueTime, 'HH:mm') : moment(),
      reminder: dates?.reminder?.enabled
        ? mapMinutesToString(dates.reminder.timeBefore)
        : 'None'
    })
    setHasStartDate(!!dates?.startDate)
  }, [dates, reset])

  const mapStringToMinutes = (value) => {
    const map = {
      '5m': 5,
      '10m': 10,
      '30m': 30,
      '1h': 60,
      '1d': 1440
    }
    return map[value] || 0
  }

  function mapMinutesToString(minutes) {
    const map = {
      5: '5m',
      10: '10m',
      30: '30m',
      60: '1h',
      1440: '1d'
    }
    return map[minutes] || 'None'
  }

  const parseReminder = (value, dueDate, dueTime) => {
    if (!value || value === 'None') {
      return {
        enabled: false,
        timeBefore: 0,
        type: 'email',
        scheduledAt: null,
        sent: false
      }
    }

    const timeBefore = mapStringToMinutes(value)
    const dueDateTime = moment(
      `${dueDate.format('YYYY-MM-DD')} ${dueTime.format('HH:mm')}`,
      'YYYY-MM-DD HH:mm'
    )
    const scheduledAt = moment(dueDateTime).subtract(timeBefore, 'minutes')

    return {
      enabled: true,
      timeBefore,
      type: 'email',
      scheduledAt: scheduledAt.toDate(),
      sent: false
    }
  }

  const onSubmit = (data) => {
    const payload = {
      startDate: hasStartDate ? data.startDate?.toDate() : null,
      dueDate: data.dueDate?.toDate(),
      dueTime: data.dueTime?.format('HH:mm'),
      reminder: parseReminder(data.reminder, data.dueDate, data.dueTime)
    }

    handleEditCardDate(payload)
    onClose()
    reset()
  }

  const handleRemove = () => {
    handleEditCardDate({
      startDate: null,
      dueDate: null,
      dueTime: null,
      reminder: {
        enabled: false,
        timeBefore: 0,
        type: 'email',
        scheduledAt: null,
        sent: false
      }
    })
    reset()
    onClose()
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
        {/* Start Date */}
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

            {/* Start Date */}
            <Controller
              name="startDate"
              control={control}
              rules={{
                validate: (value) => {
                  if (hasStartDate && !value) return 'Required.'
                  if (hasStartDate && !moment(value, true).isValid()) return 'Invalid.'
                  return true
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    format="DD-MM-YYYY"
                    disabled={!hasStartDate}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message
                      }
                    }}
                    maxDate={watch('dueDate')}
                  />
                </>
              )}
            />
          </Box>
        </Box>

        {/* Due Date & Time */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Due date
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              {/* Due Time */}
              <Controller
                name="dueTime"
                control={control}
                rules={{
                  required: 'Required.',
                  validate: (value) => {
                    if (!value) return 'Required.'
                    if (!moment(value, 'HH:mm', true).isValid()) return 'Invalid.'
                    return true
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                    ampm={false}
                    format="HH:mm"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message
                      }
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: 1.5 }}>
              {/* Due Date */}
              <Controller
                name="dueDate"
                control={control}
                rules={{
                  required: 'Required.',
                  validate: (value) => {
                    if (!value) return 'Required.'
                    if (!moment(value, true).isValid()) return 'Invalid.'
                    if (hasStartDate && watch('startDate') && moment(value).isBefore(watch('startDate')))
                      return 'Due date cannot be before start date.'
                    return true
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    format="DD-MM-YYYY"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message
                      }
                    }}
                    minDate={hasStartDate ? watch('startDate') : undefined}
                  />
                )}
              />
            </Box>
          </Box>
        </Box>

        {/* Reminder */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Set due date reminder
          </Typography>

          <Controller
            name="reminder"
            control={control}
            render={({ field }) => (
              <TextField {...field} select size="small" fullWidth>
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

        {/* Actions */}
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
            variant="contained"
            color="error"
            fullWidth
            onClick={handleRemove}
          >
            Remove
          </Button>
        </Box>
      </Box>
    </Popover>
  )
}

export default EditDate
