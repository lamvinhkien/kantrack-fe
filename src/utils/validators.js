export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Passwords do not match.'

export const LIMIT_COMMON_FILE_SIZE = 31457280
export const ALLOW_COMMON_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
]

export const imageFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (30MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept image type.'
  }
  return null
}

export const multipleFileValidator = (files) => {
  if (!files || files.length === 0) {
    return ['File cannot be blank.']
  }

  const errors = []

  for (const file of files) {
    if (!file || !file.name || !file.size || !file.type) {
      errors.push('File cannot be blank.')
      continue
    }
    if (file.size > LIMIT_COMMON_FILE_SIZE) {
      return 'Maximum file size exceeded. (30MB)'
    }
  }

  return null
}
