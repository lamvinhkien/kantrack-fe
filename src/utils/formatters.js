import { slugify } from 'transliteration'

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
