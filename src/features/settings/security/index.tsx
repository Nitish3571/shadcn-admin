import ContentSection from '../components/content-section'
import { ChangePasswordForm } from '../change-password/components/change-password-form'
import { useTranslation } from 'react-i18next'

export default function SettingsSecurity() {
  const { t } = useTranslation()
  
  return (
    <ContentSection
      title={t('change_password')}
      desc={t('update_password_secure')}
    >
      <ChangePasswordForm />
    </ContentSection>
  )
}
