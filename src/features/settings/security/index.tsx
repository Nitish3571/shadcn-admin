import ContentSection from '../components/content-section'
import { ChangePasswordForm } from '../change-password/components/change-password-form'

export default function SettingsSecurity() {
  return (
    <ContentSection
      title='Change Password'
      desc='Update your password regularly to keep your account secure.'
    >
      <ChangePasswordForm />
    </ContentSection>
  )
}
