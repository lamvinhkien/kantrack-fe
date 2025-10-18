import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import { useForm } from 'react-hook-form'
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { inviteUserToBoardAPI } from '~/apis'
import { socketIoInstance } from '~/socketio/socketClient'
import { useTranslation } from 'react-i18next'
import { Divider } from '@mui/material'
import { toast } from 'react-toastify'

const InviteBoardUser = ({ boardId }) => {
  const { t } = useTranslation()
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const [loading, setLoading] = useState(false)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const submitInviteUserToBoard = async (data) => {
    const { inviteeEmail } = data
    try {
      setLoading(true)
      const invitation = await inviteUserToBoardAPI({ inviteeEmail, boardId })
      setValue('inviteeEmail', null)
      setAnchorPopoverElement(null)
      toast.success(t('user_invited'))
      socketIoInstance.emit('FE_USER_INVITED_TO_BOARD', invitation)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Tooltip arrow title={t('invite_user')}>
        <Box
          onClick={handleTogglePopover}
          sx={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            textWrap: 'nowrap',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.12)'
            }
          }}
        >
          <PersonAddIcon />
          <Typography variant="subtitle2">
            {t('invite')}
          </Typography>
        </Box>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <form
          onSubmit={handleSubmit(submitInviteUserToBoard)}
          style={{ width: 300 }}
        >
          <Box sx={{ textAlign: 'center', p: 1.5 }}>
            <Typography variant="subtitle2">
              {t('invite_user')}
            </Typography>
          </Box>

          <Divider sx={{ width: '100%', borderBottomWidth: 1 }} />

          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <TextField
                size="small"
                autoFocus
                fullWidth
                label={t('enter_email')}
                type="text"
                variant="outlined"
                {...register('inviteeEmail', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
                error={!!errors['inviteeEmail']}
              />
              <FieldErrorAlert errors={errors} fieldName={'inviteeEmail'} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="text"
                color="inherit"
                onClick={handleTogglePopover}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="info"
                disabled={loading}
              >
                {loading ? <CircularProgress size={18} color="inherit" /> : t('invite')}
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser
