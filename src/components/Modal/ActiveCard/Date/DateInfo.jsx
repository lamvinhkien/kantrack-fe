import { Box, Typography, CircularProgress } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { ExpandMore } from '@mui/icons-material'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { BOARD_MEMBER_ACTIONS } from '~/utils/constants'

const DateInfo = ({ dates, complete, onClick, loading = false }) => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()

  if (loading) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 36
        }}
      >
        <CircularProgress size={22} />
      </Box>
    )
  }

  const startDate = dates?.startDate ? moment(dates.startDate) : null
  const dueDate = dates?.dueDate ? moment(dates.dueDate) : null
  const dueTime = dates?.dueTime ? moment(dates.dueTime, 'HH:mm') : null
  const now = moment()

  const dueDateTime =
    dueDate && dueTime
      ? moment(
        `${dueDate.format('YYYY-MM-DD')} ${dueTime.format('HH:mm')}`,
        'YYYY-MM-DD HH:mm'
      )
      : dueDate

  let statusLabel = ''
  let statusBg = ''

  if (complete) {
    statusLabel = t('complete')
    statusBg = '#b3e863ff'
  } else if (dueDateTime && dueDateTime.isBefore(now)) {
    statusLabel = t('overdue')
    statusBg = '#f87168'
  } else if (dueDateTime && dueDateTime.diff(now, 'hours') <= 24) {
    statusLabel = t('due_soon')
    statusBg = '#fbc828'
  }

  let formattedDate = t('no_date')
  if (dueDate) {
    const formattedStart = startDate ? startDate.format('DD/MM') : null
    const formattedDue = dueDate.format('DD/MM')
    formattedDate = formattedStart
      ? `${formattedStart} - ${formattedDue}`
      : formattedDue
  }

  const formattedTime = dueTime ? `, ${dueTime.format('HH:mm')}` : ''

  return (
    <BoardPermissionGate
      action={BOARD_MEMBER_ACTIONS.editCardDate}
      fallback={
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: 2,
            border: 1,
            borderColor:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.15)',
            height: 36,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: mode === 'dark' ? 'grey.100' : 'grey.900'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {formattedDate}
            {formattedTime}
          </Typography>

          {statusLabel && (
            <Box
              sx={{
                px: 1,
                py: 0.1,
                borderRadius: 1,
                backgroundColor: statusBg
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'black',
                  fontWeight: 500
                }}
              >
                {statusLabel}
              </Typography>
            </Box>
          )}
        </Box>
      }
    >
      <Box
        onClick={onClick}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          border: 1,
          borderColor:
            mode === 'dark'
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(0, 0, 0, 0.15)',
          height: 36,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: mode === 'dark' ? 'grey.100' : 'grey.900',
          '&:hover': {
            borderColor:
              mode === 'dark'
                ? 'rgba(255, 255, 255, 0.4)'
                : 'rgba(0, 0, 0, 0.4)'
          }
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {formattedDate}
          {formattedTime}
        </Typography>

        {statusLabel && (
          <Box
            sx={{
              px: 1,
              py: 0.1,
              borderRadius: 1,
              backgroundColor: statusBg
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'black',
                fontWeight: 500
              }}
            >
              {statusLabel}
            </Typography>
          </Box>
        )}

        <ExpandMore
          sx={{
            fontSize: 18,
            opacity: 0.6,
            ml: 0.5,
            transition: 'transform 0.2s ease',
            '&:hover': { opacity: 1 }
          }}
        />
      </Box>
    </BoardPermissionGate>
  )
}

export default DateInfo
