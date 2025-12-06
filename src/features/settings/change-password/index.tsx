import PageLayout from '@/components/shared/layout/page-layout'
import { PageHeader } from '@/components/shared/layout/page-header'
import { ChangePasswordForm } from './components/change-password-form'

export default function ChangePassword() {
  return (
    <PageLayout>
      <PageHeader
        title='Change Password'
        description='Update your password to keep your account secure.'
      />
      <div className='mt-6 max-w-2xl'>
        <ChangePasswordForm />
      </div>
    </PageLayout>
  )
}
