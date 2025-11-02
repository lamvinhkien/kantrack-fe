import { useColorScheme } from '@mui/material/styles'
import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Popover,
  TextField,
  Typography,
  IconButton
} from '@mui/material'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { getScrollbarStyles } from '~/utils/formatters'

const EditDate = ({ dates, open, anchorEl, onClose, handleEditCardDate }) => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()
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
    if (!open) {
      reset({
        startDate: dates?.startDate ? moment(dates.startDate) : null,
        dueDate: dates?.dueDate ? moment(dates.dueDate) : moment(),
        dueTime: dates?.dueTime ? moment(dates.dueTime, 'HH:mm') : moment(),
        reminder: dates?.reminder?.enabled
          ? mapMinutesToString(dates.reminder.timeBefore)
          : 'None'
      })
      setHasStartDate(!!dates?.startDate)
    }
  }, [open, dates, reset])

  const mapStringToMinutes = (value) => {
    const map = {
      '1h': 60,
      '2h': 120,
      '1d': 1440,
      '2d': 2880
    }
    return map[value] || 0
  }

  function mapMinutesToString(minutes) {
    if (minutes === 0) return 'AtTime'

    const map = {
      60: '1h',
      120: '2h',
      1440: '1d',
      2880: '2d'
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

    const dueDateTime = moment(
      `${dueDate.format('YYYY-MM-DD')} ${dueTime.format('HH:mm')}`,
      'YYYY-MM-DD HH:mm'
    )

    if (value === 'AtTime') {
      return {
        enabled: true,
        timeBefore: 0,
        type: 'email',
        scheduledAt: dueDateTime.toDate(),
        sent: false
      }
    }

    const timeBefore = mapStringToMinutes(value)
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
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            mb: 1,
            pb: 1
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {t('setDates')}
          </Typography>

          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: -8,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Start Date */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('startDate')}
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
              render={({ field, fieldState: { error } }) => (
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
              )}
            />
          </Box>
        </Box>

        {/* Due Date & Time */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('dueDate')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Controller
                name="dueTime"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    value={field.value}
                    onChange={(newValue) => {
                      const rounded = moment(newValue).minutes(0).seconds(0)
                      field.onChange(rounded)
                    }}
                    ampm={false}
                    views={['hours']}
                    format="HH"
                    slots={{
                      actionBar: () => null
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message
                      },
                      popper: {
                        sx: theme => ({
                          '& .MuiList-root': {
                            ...getScrollbarStyles(theme),
                            overflowY: 'auto',
                            width: 84,
                            pl: 1.2
                          }
                        })
                      }
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ flex: 2.4 }}>
              <Controller
                name="dueDate"
                control={control}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('setDueDateReminder')}
          </Typography>

          <Controller
            name="reminder"
            control={control}
            render={({ field }) => (
              <TextField {...field} select size="small" fullWidth>
                <MenuItem value="None">{t('none')}</MenuItem>
                <MenuItem value="AtTime">{t('at_time_due_date')}</MenuItem>
                <MenuItem value="1h">1 {t('hour_before')}</MenuItem>
                <MenuItem value="2h">2 {t('hours_before')}</MenuItem>
                <MenuItem value="1d">1 {t('day_before')}</MenuItem>
                <MenuItem value="2d">2 {t('days_before')}</MenuItem>
              </TextField>
            )}
          />

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('emailReminderInfo')}
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit(onSubmit)}>
            {t('save')}
          </Button>
          {dates?.dueDate && (
            <Button variant="contained" color="error" fullWidth onClick={handleRemove}>
              {t('remove')}
            </Button>
          )}
        </Box>
      </Box>
    </Popover>
  )
}

export default EditDate
