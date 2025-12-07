import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { useChangePassword } from '../services/change-password.hooks'
import { toast } from 'sonner'
import i18n from '@/i18n'
import { useTranslation } from 'react-i18next'

type ChangePasswordFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: i18n.t('current_password_required') }),
    password: z
      .string()
      .min(1, { message: i18n.t('new_password_required') })
      .min(8, { message: i18n.t('password_min_8_chars') }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: i18n.t('passwords_dont_match'),
    path: ['password_confirmation'],
  })
  .refine((data) => data.current_password !== data.password, {
    message: i18n.t('new_password_must_differ'),
    path: ['password'],
  })

export function ChangePasswordForm({ className, ...props }: ChangePasswordFormProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  })

  const { mutate: changePassword } = useChangePassword({
    onSuccess: () => {
      setIsLoading(false)
      toast.success(t('password_changed_successfully'))
      form.reset()
    },
    onError: (error: any) => {
      setIsLoading(false)
      const errorMsg = 
        error?.response?.data?.message || 
        error?.response?.data?.errors?.current_password?.[0] ||
        t('failed_to_change_password')
      toast.error(errorMsg)
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    changePassword(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='current_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('current_password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={t('enter_current_password')} {...field} />
              </FormControl>
              <FormDescription>
                {t('enter_current_password_verify')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('new_password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={t('enter_new_password')} {...field} />
              </FormControl>
              <FormDescription>
                {t('password_requirements')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password_confirmation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirm_new_password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder={t('confirm_new_password')} {...field} />
              </FormControl>
              <FormDescription>
                {t('reenter_new_password')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-3 pt-4'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? t('updating') : t('update_password')}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
