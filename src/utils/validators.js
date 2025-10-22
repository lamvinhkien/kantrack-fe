import i18next from 'i18next'
const t = i18next.t.bind(i18next)

export const FIELD_REQUIRED_MESSAGE = 'field_required'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'email_invalid'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'password_invalid'
export const PASSWORD_CONFIRMATION_MESSAGE = 'password_mismatch'

export const LIMIT_COMMON_FILE_SIZE = 9437184
export const ALLOW_COMMON_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

export const imageFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return t('file_blank')
  }

  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return t('file_size_exceeded')
  }

  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return t('file_type_invalid')
  }
  return null
}

export const multipleFileValidator = (files) => {
  if (!files || files.length === 0) {
    return t('file_blank')
  }

  if (files.length > 10) {
    return t('file_too_many')
  }

  for (const file of files) {
    if (!file || !file.name || !file.size || !file.type) {
      return t('file_blank')
    }
    if (file.size > LIMIT_COMMON_FILE_SIZE) {
      return t('file_size_exceeded')
    }
  }

  return null
}
