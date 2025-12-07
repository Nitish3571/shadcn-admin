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

type ChangePasswordFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
  .object({
    current_password: z
      .string()
      .min(1, { message: 'Please enter your current password' }),
    password: z
      .string()
      .min(1, { message: 'Please enter your new password' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match.",
    path: ['password_confirmation'],
  })
  .refine((data) => data.current_password !== data.password, {
    message: "New password must be different from current password.",
    path: ['password'],
  })

export function ChangePasswordForm({ className, ...props }: ChangePasswordFormProps) {
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
      toast.success('Password changed successfully!')
      form.reset()
    },
    onError: (error: any) => {
      setIsLoading(false)
      const errorMsg = 
        error?.response?.data?.message || 
        error?.response?.data?.errors?.current_password?.[0] ||
        'Failed to change password. Please try again.'
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
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Enter current password' {...field} />
              </FormControl>
              <FormDescription>
                Enter your current password to verify your identity
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
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Enter new password' {...field} />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long and different from your current password
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
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='Confirm new password' {...field} />
              </FormControl>
              <FormDescription>
                Re-enter your new password to confirm
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-3 pt-4'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
