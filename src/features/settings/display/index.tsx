import ContentSection from '../components/content-section'
import { DisplayForm } from './display-form'
import { useTranslation } from 'react-i18next'

export default function SettingsDisplay() {
  const { t } = useTranslation()
  
  return (
    <ContentSection
      title={t('display')}
      desc={t('display_description')}
    >
      <DisplayForm />
    </ContentSection>
  )
}
