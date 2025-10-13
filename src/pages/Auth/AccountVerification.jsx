import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const AccountVerification = () => {
  const { t } = useTranslation()
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
        setVerified(true)
        toast.success(t('account_verified'))
      })
    }
  }, [email, t, token])

  if (!email || !token) return <Navigate to='/404' />

  if (!verified) return <PageLoadingSpinner caption={t('verifying_account')} />

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
