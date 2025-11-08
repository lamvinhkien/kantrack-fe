import { useState, useMemo } from 'react'
import {
  Box,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import CloseIcon from '@mui/icons-material/Close'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { useTranslation } from 'react-i18next'

const StatisticsBoard = ({ listColumn }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const stats = useMemo(() => {
    if (!Array.isArray(listColumn) || listColumn.length === 0) return null

    const allCards = listColumn.flatMap(col =>
      Array.isArray(col.cards)
        ? col.cards.filter(c => !c.FE_PlaceholderCard)
        : []
    )

    if (allCards.length === 0) return null

    const completed = allCards.filter(c => c.complete === true).length
    const incomplete = allCards.length - completed
    const completionRate = (completed / allCards.length) * 100

    return {
      total: allCards.length,
      completed,
      incomplete,
      completionRate
    }
  }, [listColumn])

  const COLORS = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.grey[400]
  ]

  const pieData = [
    { name: t('completed_cards'), value: stats?.completed || 0 },
    { name: t('incomplete_cards'), value: stats?.incomplete || 0 }
  ]

  return (
    <>
      <Tooltip arrow title={t('view_statistics')}>
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
            textWrap: 'nowrap',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' }
          }}
        >
          <LeaderboardIcon fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            {t('statistics')}
          </Typography>
        </Box>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            outline: 'none !important',
            boxShadow: theme => theme.shadows[5],
            '&:focus': { outline: 'none !important' },
            '& *:focus': { outline: 'none !important' },
            '& .MuiDialogContent-root:focus': { outline: 'none !important' },
            '& [tabindex="-1"]:focus': { outline: 'none !important' }
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="span" fontWeight={600}>
            {t('statistics')}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {!stats ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                opacity: 0.5
              }}
            >
              <LeaderboardIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2">{t('no_data')}</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                '& path:focus': { outline: 'none' },
                '& g:focus': { outline: 'none' }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    cornerRadius={6}
                    dataKey="value"
                    animationDuration={800}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      background: 'white',
                      borderRadius: 8,
                      border: `1px solid ${theme.palette.divider}`
                    }}
                    wrapperStyle={{
                      zIndex: 9999,
                      pointerEvents: 'none'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 13
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <Box
                sx={{
                  position: 'absolute',
                  top: '43%',
                  left: '50%',
                  transform: 'translate(-50%, -43%)',
                  textAlign: 'center'
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color={theme.palette.success.main}
                >
                  {Number.isInteger(stats.completionRate)
                    ? stats.completionRate
                    : stats.completionRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('completion')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StatisticsBoard
