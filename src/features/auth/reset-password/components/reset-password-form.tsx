import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/password-input'
import { useResetPassword } from '../services/reset-password.hooks'
import { toast } from 'sonner'

type ResetPasswordFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: 'Please enter your password' })
      .min(8, { message: 'Password must be at least 8 characters long' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match.",
    path: ['password_confirmation'],
  })

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
  const navigate = useNavigate()
  const search = useSearch({ from: '/(auth)/reset-password' })
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  })

  const { mutate: resetPassword } = useResetPassword({
    onSuccess: () => {
      setIsLoading(false)
      toast.success('Password reset successfully! Please login with your new password.')
      setTimeout(() => {
        navigate({ to: '/sign-in', replace: true })
      }, 2000)
    },
    onError: (error: any) => {
      setIsLoading(false)
      const errorMsg = 
        error?.response?.data?.message || 
        error?.response?.data?.errors?.token?.[0] ||
        'Password reset failed. The link may be expired or invalid.'
      toast.error(errorMsg)
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    const token = (search as any)?.token
    const email = (search as any)?.email

    if (!token || !email) {
      toast.error('Invalid reset link. Missing token or email.')
      return
    }

    setIsLoading(true)
    resetPassword({
      email,
      token,
      password: data.password,
      password_confirmation: data.password_confirmation,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password_confirmation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={() => navigate({ to: '/sign-in' })}
          disabled={isLoading}
        >
          Back to Login
        </Button>
      </form>
    </Form>
  )
}
