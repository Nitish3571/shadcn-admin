import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'
import { useTranslation } from 'react-i18next'

export default function SettingsAccount() {
  const { t } = useTranslation()
  
  return (
    <ContentSection
      title={t('account')}
      desc={t('account_description')}
    >
      <AccountForm />
    </ContentSection>
  )
}
