import { useBoardPermission } from '~/hooks/useBoardPermission'

export const BoardPermissionGate = ({
  action,
  actions = [],
  customCheck,
  children,
  fallback = null
}) => {
  const { can, board } = useBoardPermission()

  let isAllowed = false

  if (typeof customCheck === 'function') {
    isAllowed = customCheck(board)
  } else if (action) {
    isAllowed = can(action)
  } else if (Array.isArray(actions) && actions.length > 0) {
    isAllowed = actions.some(act => can(act))
  }

  if (!isAllowed) return fallback
  return children
}
