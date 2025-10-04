import { useState } from 'react'

export default function usePopover() {
  const [anchorEl, setAnchorEl] = useState(null)

  const openPopover = (event) => setAnchorEl(event.currentTarget)
  const closePopover = () => setAnchorEl(null)

  const isOpen = Boolean(anchorEl)
  const popoverId = isOpen ? 'common-popover' : undefined

  return {
    anchorEl,
    isOpen,
    popoverId,
    openPopover,
    closePopover
  }
}
