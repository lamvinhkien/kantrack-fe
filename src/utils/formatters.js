import { slugify } from 'transliteration'
import moment from 'moment'
import 'moment/locale/vi'
import 'moment/locale/en-gb'

export const renderTime = (time, options = {}) => {
  const {
    showExactAfterDays = 2,
    locale = moment.locale(),
    showSeconds = false
  } = options

  if (!time) return ''

  const now = moment()
  const target = moment(time).locale(locale)

  const diffSeconds = now.diff(target, 'seconds')
  const diffMinutes = now.diff(target, 'minutes')
  const diffHours = now.diff(target, 'hours')
  const diffDaysFloat = now.diff(target, 'hours') / 24
  const diffDays = Math.round(diffDaysFloat)

  if (diffSeconds < 60) {
    if (showSeconds)
      return locale === 'vi'
        ? `${diffSeconds} giây trước`
        : `${diffSeconds} second${diffSeconds !== 1 ? 's' : ''} ago`
    return locale === 'vi' ? 'Vừa xong' : 'Just now'
  }

  if (diffMinutes < 60)
    return locale === 'vi'
      ? `${diffMinutes} phút trước`
      : `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`

  if (diffHours < 24)
    return locale === 'vi'
      ? `${diffHours} giờ trước`
      : target.fromNow()

  if (diffDays < showExactAfterDays)
    return locale === 'vi'
      ? `${diffDays} ngày trước`
      : target.fromNow()

  const format = target.year() === now.year()
    ? 'DD/MM, HH:mm'
    : 'DD/MM/YYYY, HH:mm'

  return target.format(format)
}

export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

export const interceptorLoadingElements = (calling) => {
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}

export const isImageUrl = (url) => {
  if (!url) return false
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(url.split('?')[0])
}

export const isPdfUrl = (url) => {
  if (!url) return false
  return /\.pdf$/i.test(url.split('?')[0])
}

export const isVideoUrl = (url) => {
  if (!url) return false
  return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url.split('?')[0])
}

export const getFileExtension = (url) => {
  const parts = url.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : ''
}

export const getDownloadUrl = (url, filename) => {
  if (!url) return url

  let baseName = filename
    ? filename.replace(/\.[^/.]+$/, '')
    : url.split('/').pop().split('.')[0] || 'download'

  const safeBase = slugify(baseName, { separator: '_', lowercase: false }) || 'file'

  if (url.includes('fl_attachment')) return url

  return url.replace('/upload', `/upload/fl_attachment:${safeBase}`)
}

export const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB'
}

export const getScrollbarStyles = (theme) => ({
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#b0b0b0',
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#777' : '#8c8c8c'
  },
  '&::-webkit-scrollbar-thumb:active': {
    backgroundColor: theme.palette.mode === 'dark' ? '#999' : '#666'
  },

  scrollbarWidth: 'thin',
  scrollbarColor:
    theme.palette.mode === 'dark'
      ? '#555 #1e1e1e'
      : '#b0b0b0 #f5f5f5'
})
