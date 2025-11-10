import { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Divider
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import CloseIcon from '@mui/icons-material/Close'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { getScrollbarStyles } from '~/utils/formatters'

const StatisticsBoard = ({ listColumn, members = [], owners = [] }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const stats = useMemo(() => {
    if (!Array.isArray(listColumn) || listColumn.length === 0) return null

    const allCards = listColumn.flatMap(col =>
      Array.isArray(col.cards) ? col.cards.filter(c => !c.FE_PlaceholderCard) : []
    )
    if (allCards.length === 0) return null

    const completed = allCards.filter(c => c.complete).length
    const incomplete = allCards.length - completed
    const completionRate = (completed / allCards.length) * 100

    const now = new Date()
    let overdue = 0
    let upcoming = 0
    let noDeadline = 0
    allCards.forEach(c => {
      if (!c.complete && c.dates?.dueDate) {
        const due = new Date(c.dates.dueDate)
        if (due < now) overdue += 1
        else if (due - now <= 3 * 24 * 60 * 60 * 1000) upcoming += 1
      } else if (!c.dates?.dueDate) {
        noDeadline += 1
      }
    })

    const memberStatsMap = {}
    allCards.forEach(c => {
      if (Array.isArray(c.memberIds) && c.memberIds.length > 0) {
        c.memberIds.forEach(id => {
          memberStatsMap[id] = memberStatsMap[id] || { total: 0, completed: 0 }
          memberStatsMap[id].total += 1
          if (c.complete) memberStatsMap[id].completed += 1
        })
      }
    })

    const allUsers = [...owners, ...members]
    const memberChartData = Object.entries(memberStatsMap).map(([id, data]) => {
      const user = allUsers.find(u => u._id === id)
      const isOwner = owners.some(o => o._id === id)
      return {
        id,
        name: user?.displayName || '',
        email: user?.email || '',
        avatar: user?.avatar?.url || null,
        completed: data.completed,
        incomplete: data.total - data.completed,
        isOwner
      }
    })

    return {
      total: allCards.length,
      completed,
      incomplete,
      completionRate,
      deadline: { overdue, upcoming, noDeadline },
      memberChartData
    }
  }, [listColumn, members, owners])

  if (!stats) return null

  const COLORS_COMPLETION = [theme.palette.success.light, theme.palette.error.light]
  const COLORS_DEADLINE = [theme.palette.error.light, theme.palette.warning.light, theme.palette.primary.main]

  const pieCompletion = [
    { name: t('completed'), value: stats.completed },
    { name: t('incomplete'), value: stats.incomplete }
  ]
  const pieDeadline = [
    { name: t('overdue'), value: stats.deadline.overdue },
    { name: t('upcoming'), value: stats.deadline.upcoming },
    { name: t('no_deadline'), value: stats.deadline.noDeadline }
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 2,
            outline: 'none !important',
            boxShadow: theme.shadows[5],
            '&:focus': { outline: 'none !important' },
            '& *:focus': { outline: 'none !important' },
            '& .MuiDialogContent-root:focus': { outline: 'none !important' },
            '& [tabindex="-1"]:focus': { outline: 'none !important' },
            ...getScrollbarStyles(theme)
          })
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1, borderColor: 'grey.400'
          }}
        >
          <Typography component='span' variant="inherit" fontWeight={600} sx={{ fontSize: 22 }}>
            {t('statistics')}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 0.4, pt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {t('board_progress')}
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    minHeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieCompletion}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        dataKey="value"
                        animationDuration={800}
                      >
                        {pieCompletion.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS_COMPLETION[index % COLORS_COMPLETION.length]}
                            strokeWidth={0}
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
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>

                  <Box
                    sx={{
                      position: 'absolute',
                      top: '42%',
                      left: '50%',
                      transform: 'translate(-50%, -42%)',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h4" fontWeight={700} color={theme.palette.success.main}>
                      {Number.isInteger(stats.completionRate)
                        ? stats.completionRate
                        : stats.completionRate.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('completion')}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  borderColor: 'grey.500',
                  alignSelf: 'stretch'
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {t('card_deadline')}
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    minHeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieDeadline}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        dataKey="value"
                        nameKey="name"
                        animationDuration={800}
                      >
                        {pieDeadline.map((entry, index) => (
                          <Cell
                            key={`cell-deadline-${index}`}
                            fill={COLORS_DEADLINE[index % COLORS_DEADLINE.length]}
                            strokeWidth={0}
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
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Box>

            {stats.memberChartData.length > 0 &&
              <>
                <Divider
                  sx={{
                    borderColor: 'grey.500',
                    alignSelf: 'stretch'
                  }}
                />

                <Box>
                  <Typography variant="h6" gutterBottom>
                    {t('member_progress')}
                  </Typography>

                  {(() => {
                    const sortedMemberData = [...stats.memberChartData].sort(
                      (a, b) => (b.completed + b.incomplete) - (a.completed + a.incomplete)
                    )
                    const barHeight = 60
                    const chartHeight = sortedMemberData.length * barHeight + 60

                    return (
                      <Box sx={{ width: '100%', height: chartHeight }}>
                        <ResponsiveContainer width="100%" height={chartHeight}>
                          <BarChart
                            layout="vertical"
                            data={sortedMemberData}
                            margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                            barSize={35}
                          >
                            <CartesianGrid strokeDasharray="3 3" />

                            <YAxis
                              dataKey="name"
                              type="category"
                              tick={({ x, y, payload }) => {
                                const user = sortedMemberData.find(u => u.name === payload.value)
                                return (
                                  <foreignObject x={x - 50} y={y - 20} width={40} height={50}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        badgeContent={
                                          user?.isOwner ? (
                                            <EmojiEventsIcon sx={{ fontSize: 16, color: '#FFC107' }} />
                                          ) : null
                                        }
                                      >
                                        <Avatar
                                          src={user?.avatar}
                                          alt={user?.username}
                                          sx={{
                                            width: 40,
                                            height: 40,
                                            border: user?.isOwner ? '2px solid #FFC107' : 'none'
                                          }}
                                        />
                                      </Badge>
                                    </Box>
                                  </foreignObject>
                                )
                              }}
                              tickLine={false}
                              axisLine={false}
                            />

                            <XAxis type="number" allowDecimals={false} />

                            <ReTooltip
                              content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null
                                const user = sortedMemberData.find(u => u.name === label)
                                return (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 1,
                                      background: 'white',
                                      borderRadius: 2,
                                      border: `1px solid ${theme.palette.divider}`,
                                      p: 1.5,
                                      boxShadow: theme.shadows[2]
                                    }}
                                  >
                                    <Typography component="span" variant="body2" fontWeight={500} color="black">
                                      {user?.name}
                                    </Typography>
                                    <Typography component="span" variant="caption" fontWeight={500} color="grey">
                                      {user?.email}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                                      {t('completed')}: {user?.completed || 0}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.warning.main }}>
                                      {t('incomplete')}: {user?.incomplete || 0}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.info.main }}>
                                      {t('total')}: {(user?.completed || 0) + (user?.incomplete || 0)}
                                    </Typography>
                                  </Box>
                                )
                              }}
                            />
                            <Bar dataKey="completed" stackId="a" fill={theme.palette.success.light} />
                            <Bar dataKey="incomplete" stackId="a" fill={theme.palette.error.light} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    )
                  })()}
                </Box>
              </>
            }
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default StatisticsBoard
