import { Separator } from '@/components/ui/separator'
import { ChangePasswordForm } from './components/change-password-form'
import PageLayout from '@/components/shared/layout/page-layout'

export default function ChangePassword() {
  return (
    <PageLayout>
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Change Password</h3>
        <p className='text-muted-foreground text-sm'>
          Update your password to keep your account secure.
        </p>
      </div>
      <Separator />
      <ChangePasswordForm />
    </div>
    </PageLayout>
  )
}
