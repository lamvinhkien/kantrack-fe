import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import i18next from 'i18next'
const t = i18next.t.bind(i18next)

let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

let authorizedAxiosInstance = axios.create()
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use((config) => {
  interceptorLoadingElements(true)
  return config
}, (error) => {
  return Promise.reject(error)
})

let refreshTokenPromise = null
authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElements(false)
  return response
}, (error) => {
  interceptorLoadingElements(false)

  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI())
  }

  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => data?.accessToken)
        .catch((_error) => {
          axiosReduxStore.dispatch(logoutUserAPI())
          return Promise.reject(_error)
        })
        .finally(() => refreshTokenPromise = null)
    }

    return refreshTokenPromise.then(() => authorizedAxiosInstance(originalRequests))
  }

  let errorMessage = error?.message
  if (error.response?.data?.message) errorMessage = error.response.data.message

  const silentMessages = new Set([
    'You do not have permission to view this board.'
  ])

  const toastMessages = {
    'Board not found.': t('board_not_found'),
    'Column not found.': t('column_not_found'),
    'Card not found.': t('card_not_found'),
    'Invitee not found.': t('invitee_not_found'),
    'Invitee is already a member of this board.': t('exist_invitee'),
    'Email already exist.': t('exist_email'),
    'Your email or password is incorrect.': t('email_password_incorrect'),
    'Your account is not active, please verify email.': t('account_is_not_active'),
    'Invalid code.': t('invalid_code'),
    'OTP expired. Please request a new one.': t('expired_otp'),
    'Please wait 1 minute before resending the code or logging in again.': t('resend_code_or_login_again'),
    'Reminder schedule time cannot be in the past.': t('reminder_in_the_past'),
    'This board has reached its email reminder limit.': t('limit_reminder'),
    'You’ve joined or created more boards than allowed.': t('limit_join_create_board'),
    'Something went wrong while sending your verification email. Please try again.': t('failed_send_mail')
  }

  if (silentMessages.has(errorMessage)) {
    // None
  } else if (toastMessages[errorMessage]) {
    toast.error(toastMessages[errorMessage])
  } else if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance
