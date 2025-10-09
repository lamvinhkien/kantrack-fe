import { Card as MuiCard, CardContent, Typography, Button, Box } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { showModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { useColorScheme } from '@mui/material/styles'
import moment from 'moment'

const Card = ({ card }) => {
  const { mode } = useColorScheme()
  const dispatch = useDispatch()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyles = {
    touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #1976d2' : undefined
  }

  const handleOpenCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showModalActiveCard())
  }

  const dueDate = card?.dates?.dueDate ? moment(card.dates.dueDate) : null
  const dueTime = card?.dates?.dueTime || null
  const today = moment()

  let dueDateTime = dueDate
  if (dueDate && dueTime) {
    dueDateTime = moment(`${dueDate.format('YYYY-MM-DD')} ${dueTime}`, 'YYYY-MM-DD HH:mm')
  }

  let statusColor = ''

  if (card?.complete) {
    statusColor = '#b3e863ff'
  } else if (dueDateTime && dueDateTime.isBefore(today)) {
    statusColor = '#f87168'
  } else if (dueDateTime && dueDateTime.diff(today, 'hours') <= 24) {
    statusColor = '#fbc828'
  }

  const shouldShowCardActions =
    !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length

  const checkColor = mode === 'dark' ? '#b3e863ff' : '#47ad4eff'

  return (
    <MuiCard
      onClick={handleOpenCard}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: theme => theme.palette.primary.main },
        borderRadius: 1
      }}
    >
      {card?.cover?.url && (
        <Box
          component="img"
          src={card.cover.url}
          alt="card cover"
          sx={{
            width: '100%',
            height: 150,
            objectFit: 'cover',
            borderRadius: '4px 4px 0 0',
            mb: -0.5
          }}
        />
      )}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: 0.7,
            width: '100%'
          }}
        >
          {card?.complete && (
            <CheckCircleIcon
              sx={{
                color: checkColor,
                fontSize: 20,
                flexShrink: 0,
                mt: '0.2px'
              }}
            />
          )}

          <Typography
            sx={{
              fontWeight: 500,
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              flex: 1
            }}
          >
            {card?.title}
          </Typography>
        </Box>

        {(card?.dates?.startDate || card?.dates?.dueDate || card?.memberIds?.length > 0 ||
          card?.comments?.length > 0 || card?.attachments?.length > 0) &&
          (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1
              }}
            >
              {(card?.dates?.startDate || card?.dates?.dueDate) && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: statusColor ? 1 : 0,
                    py: statusColor ? 0.2 : 0,
                    borderRadius: 1.5,
                    backgroundColor: statusColor,
                    gap: 0.5,
                    minWidth: 80,
                    color: statusColor ? 'grey.900' : 'primary.main',
                    flexShrink: 0
                  }}
                >
                  {statusColor
                    ? <AccessTimeIcon sx={{ fontSize: 16 }} />
                    : <AccessTimeFilledIcon sx={{ fontSize: 16 }} />
                  }
                  <Typography
                    variant="body2"
                    sx={{
                      color: card.complete ? 'black' : 'inherit',
                      fontWeight: 500,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {dueDate.format('DD/MM')}
                  </Typography>
                </Box>
              )}

              {shouldShowCardActions && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {!!card?.memberIds?.length && (
                    <Button size="small" startIcon={<GroupIcon />}
                      sx={{
                        minWidth: 0,
                        p: '2px 6px',
                        '&:hover': { background: 'none' }
                      }}
                    >
                      {card.memberIds.length}
                    </Button>
                  )}
                  {!!card?.comments?.length && (
                    <Button size="small" startIcon={<CommentIcon />}
                      sx={{
                        minWidth: 0,
                        p: '2px 6px',
                        '&:hover': { background: 'none' }
                      }}
                    >
                      {card.comments.length}
                    </Button>
                  )}
                  {!!card?.attachments?.length && (
                    <Button size="small" startIcon={<AttachmentIcon />}
                      sx={{
                        minWidth: 0,
                        p: '2px 6px',
                        '&:hover': { background: 'none' }
                      }}
                    >
                      {card.attachments.length}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          )
        }
      </CardContent>
    </MuiCard>
  )
}

export default Card
