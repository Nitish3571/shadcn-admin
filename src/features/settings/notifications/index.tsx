import ContentSection from '../components/content-section'
import { NotificationsForm } from './notifications-form'
import { useTranslation } from 'react-i18next'

export default function SettingsNotifications() {
  const { t } = useTranslation()
  
  return (
    <ContentSection
      title={t('notifications')}
      desc={t('notifications_description')}
    >
      <NotificationsForm />
    </ContentSection>
  )
}
