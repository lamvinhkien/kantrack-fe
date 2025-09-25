export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Passwords do not match.'

export const LIMIT_COMMON_FILE_SIZE = 10485760
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg and png'
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
      errors.push(`${file.name}: Maximum file size exceeded. (10MB)`)
    }
  }

  return errors.length > 0 ? errors : null
}
