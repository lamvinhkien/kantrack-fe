import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { EMAIL_RULE, FIELD_REQUIRED_MESSAGE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { inviteUserToBoardAPI } from '~/apis'
import { socketIoInstance } from '~/socketio/socketClient'
import { useTranslation } from 'react-i18next'
import { Divider } from '@mui/material'

const InviteBoardUser = ({ boardId }) => {
  const { t } = useTranslation()
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const submitInviteUserToBoard = (data) => {
    const { inviteeEmail } = data
    inviteUserToBoardAPI({ inviteeEmail, boardId }).then(invitation => {
      setValue('inviteeEmail', null)
      setAnchorPopoverElement(null)
      socketIoInstance.emit('FE_USER_INVITED_TO_BOARD', invitation)
    })
  }

  return (
    <Box>
      <Tooltip title={t('invite_user')}>
        <Box
          onClick={handleTogglePopover}
          sx={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.12)'
            }
          }}
        >
          <PersonAddIcon />
          <Typography variant="body2" fontWeight={500}>
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
          style={{ width: 320 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 1.5
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {t('invite_user')}
            </Typography>
          </Box>

          <Divider sx={{ width: '100%', borderBottomWidth: 1 }} />

          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <TextField
                size="small"
                autoFocus
                multiline
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
              <Button variant="text" color="inherit" onClick={handleTogglePopover}>
                {t('cancel')}
              </Button>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="info"
              >
                {t('invite')}
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser
