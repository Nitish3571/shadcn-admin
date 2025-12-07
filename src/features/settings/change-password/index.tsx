import { Separator } from '@/components/ui/separator'
import { ChangePasswordForm } from './components/change-password-form'
import PageLayout from '@/components/shared/layout/page-layout'
import { useTranslation } from 'react-i18next'

export default function ChangePassword() {
  const { t } = useTranslation()
  
  return (
    <PageLayout>
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{t('change_password')}</h3>
        <p className='text-muted-foreground text-sm'>
          {t('update_password_secure')}
        </p>
      </div>
      <Separator />
      <ChangePasswordForm />
    </div>
    </PageLayout>
  )
}
