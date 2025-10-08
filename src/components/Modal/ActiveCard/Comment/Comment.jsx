import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'
import { renderTime } from '~/utils/formatters'

const Comment = ({ cardComments = [], onAddCardComment }) => {
  const currentUser = useSelector(selectCurrentUser)
  const board = useSelector(selectCurrentActiveBoard)
  const [commentInput, setCommentInput] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const handleSendComment = async () => {
    const content = commentInput.trim()
    if (!content || isPosting) return

    const commentToAdd = {
      userId: currentUser?._id,
      content
    }

    try {
      setIsPosting(true)
      await onAddCardComment(commentToAdd)
      setCommentInput('')
    } finally {
      setIsPosting(false)
    }
  }

  const handleAddCardComment = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendComment()
    }
  }

  const renderComments = cardComments.map((comment) => {
    const user = board?.FE_allUsers?.find((u) => u._id === comment.userId)
    return {
      ...comment,
      userDisplayName: user?.displayName || 'Unknown User',
      userAvatar: user?.avatar?.url || ''
    }
  })

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar
          sx={{ width: 30, height: 30, cursor: 'pointer' }}
          alt={currentUser?.displayName}
          src={currentUser?.avatar?.url}
        />

        <TextField
          fullWidth
          placeholder="Write a comment..."
          type="text"
          variant="outlined"
          multiline
          onKeyDown={handleAddCardComment}
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36
                }}
              >
                {isPosting ? (
                  <CircularProgress size={18} sx={{ color: (theme) => theme.palette.primary.main }} />
                ) : (
                  <IconButton
                    onClick={handleSendComment}
                    size="small"
                    disabled={!commentInput.trim()}
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                      opacity: !commentInput.trim() ? 0.4 : 1,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '14px',
              pr: '6px',
              py: '2px'
            }
          }}
        />
      </Box>

      {renderComments.length === 0 && (
        <Typography
          sx={{
            pl: '45px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#b1b1b1'
          }}
        >
          No comment found!
        </Typography>
      )}

      {renderComments.map((comment, index) => (
        <Box
          sx={{ display: 'flex', gap: 1, width: '100%', mt: 2 }}
          key={index}
        >
          <Tooltip title={comment.userDisplayName}>
            <Avatar
              sx={{ width: 30, height: 30, cursor: 'pointer' }}
              alt={comment.userDisplayName}
              src={comment.userAvatar}
            />
          </Tooltip>

          <Box sx={{ width: 'inherit' }}>
            <Typography
              component="span"
              sx={{
                fontWeight: 'bold',
                mr: 1,
                color: theme => theme.palette.mode === 'dark' ? 'grey.500' : 'grey.700'
              }}
            >
              {comment.userDisplayName}
            </Typography>

            <Typography
              variant='caption'
              sx={{
                color: theme => theme.palette.mode === 'dark' ? 'grey.500' : 'grey.700'
              }}
            >
              {renderTime(comment.commentedAt)}
            </Typography>

            <Box
              sx={{
                display: 'block',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark' ? '#1e242aff' : 'white',
                p: '8px 12px',
                mt: '4px',
                borderRadius: 1,
                wordBreak: 'break-word',
                boxShadow: '0 0 1px rgba(0, 0, 0, 0.2)',
                fontSize: '14px'
              }}
            >
              {comment.content}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Comment
