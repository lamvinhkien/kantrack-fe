import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import SendIcon from '@mui/icons-material/Send'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { renderTime } from '~/utils/formatters'
import { CARD_COMMENT_ACTIONS } from '~/utils/constants'
import { useTranslation } from 'react-i18next'

const Comment = ({ cardComments = [], handleUpdateCardComment }) => {
  const { t, i18n } = useTranslation()
  const currentUser = useSelector(selectCurrentUser)
  const board = useSelector(selectCurrentActiveBoard)
  const [commentInput, setCommentInput] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const [loadingEditId, setLoadingEditId] = useState(null)
  const [loadingDeleteId, setLoadingDeleteId] = useState(null)

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedComment, setSelectedComment] = useState(null)

  const handleSendComment = async () => {
    const content = commentInput.trim()
    if (!content) {
      return
    }

    const commentToAdd = {
      userId: currentUser?._id,
      content
    }

    try {
      setIsPosting(true)
      await handleUpdateCardComment(CARD_COMMENT_ACTIONS.ADD, commentToAdd)
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

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.commentId)
    setEditContent(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent('')
  }

  const handleSaveEdit = async (comment) => {
    const newContent = editContent.trim()
    if (!newContent) {
      return
    }

    try {
      setLoadingEditId(comment.commentId)
      await handleUpdateCardComment(CARD_COMMENT_ACTIONS.EDIT, {
        ...comment,
        content: newContent
      })
      handleCancelEdit()
    } finally {
      setLoadingEditId(null)
    }
  }

  const handleDeleteClick = (event, comment) => {
    setAnchorEl(event.currentTarget)
    setSelectedComment(comment)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
    setSelectedComment(null)
  }

  const handleConfirmDelete = async () => {
    if (!selectedComment) return

    const commentToDelete = selectedComment

    handleClosePopover()
    setLoadingDeleteId(commentToDelete.commentId)

    try {
      await handleUpdateCardComment(CARD_COMMENT_ACTIONS.REMOVE, commentToDelete)
    } finally {
      setLoadingDeleteId(null)
    }
  }

  const inputEditRef = useRef(null)
  useEffect(() => {
    if (editingCommentId && inputEditRef.current) {
      const length = inputEditRef.current.value.length
      inputEditRef.current.setSelectionRange(length, length)
      inputEditRef.current.focus()
    }
  }, [editingCommentId])


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
          placeholder={t('write_a_comment')}
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
          {t('no_comment_found')}
        </Typography>
      )}

      {renderComments.map((comment) => {
        const isOwner = comment.userId === currentUser?._id
        const isEditing = editingCommentId === comment.commentId
        const isEditLoading = loadingEditId === comment.commentId

        return (
          <Box
            sx={{ display: 'flex', gap: 1, width: '100%', mt: 2 }}
            key={comment.commentId}
          >
            <Tooltip title={comment.userDisplayName}>
              <Avatar
                sx={{ width: 30, height: 30, cursor: 'pointer' }}
                alt={comment.userDisplayName}
                src={comment.userAvatar}
              />
            </Tooltip>

            <Box sx={{ width: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, height: '24px' }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    color: (theme) =>
                      theme.palette.mode === 'dark' ? 'grey.500' : 'grey.700'
                  }}
                >
                  {comment.userDisplayName}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    mt: '0.6px',
                    color: (theme) =>
                      theme.palette.mode === 'dark' ? 'grey.500' : 'grey.700'
                  }}
                >
                  {renderTime(comment.commentedAt, { locale: i18n.language })}
                </Typography>

                {isOwner && !isEditing && (
                  <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(comment)}
                      disabled={loadingDeleteId === comment.commentId}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>

                    {loadingDeleteId === comment.commentId ? (
                      <CircularProgress size={16} sx={{ ml: 0.5 }} />
                    ) : (
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteClick(e, comment)}
                        disabled={loadingDeleteId === comment.commentId}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Box>

              {isEditing ? (
                <Box sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    autoFocus
                    inputRef={inputEditRef}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    size="small"
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                    <Button
                      size="small"
                      color="inherit"
                      onClick={handleCancelEdit}
                      disabled={isEditLoading}
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleSaveEdit(comment)}
                      disabled={isEditLoading || !editContent.trim()}
                    >
                      {isEditLoading ? <CircularProgress size={16} color="inherit" /> : t('save')}
                    </Button>
                  </Box>
                </Box>
              ) : (
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
              )}
            </Box>
          </Box>
        )
      })}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, width: 220 }}>
          <Typography sx={{ fontSize: '14px', mb: 2 }}>
            {t('delete_this_comment_question')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button size="small" color="inherit" onClick={handleClosePopover}>
              {t('cancel')}
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              disabled={loadingDeleteId === selectedComment?.commentId}
            >
              {loadingDeleteId === selectedComment?.commentId ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                t('delete')
              )}
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}

export default Comment
