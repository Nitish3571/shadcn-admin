import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'
import { useTranslation } from 'react-i18next'

export default function SettingsAppearance() {
  const { t } = useTranslation()
  
  return (
    <ContentSection
      title={t('appearance')}
      desc={t('appearance_description')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}
