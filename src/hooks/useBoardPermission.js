import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'

export function useBoardPermission() {
  const user = useSelector(selectCurrentUser)
  const board = useSelector(selectCurrentActiveBoard)

  if (!user || !board) {
    return {
      isOwner: false,
      isMember: false,
      can: () => false
    }
  }

  const userId = user._id
  const ownerIds = board.ownerIds || []
  const memberIds = board.memberIds || []
  const perms = board.memberPermissions || {}

  const isOwner = ownerIds.includes(userId)
  const isMember = memberIds.includes(userId)

  const can = (action) => {
    if (isOwner) return true
    if (isMember && perms[action]) return true
    return false
  }

  return { isOwner, isMember, can }
}
