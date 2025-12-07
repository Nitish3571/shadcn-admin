import ContentSection from '../components/content-section'
import ProfileForm from './profile-form'
import { useTranslation } from 'react-i18next'

export default function SettingsProfile() {
  const { t } = useTranslation()
  
  return (
    <ContentSection
      title={t('profile')}
      desc={t('profile_description')}
    >
      <ProfileForm />
    </ContentSection>
  )
}
