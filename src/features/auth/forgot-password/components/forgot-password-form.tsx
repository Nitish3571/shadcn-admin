import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
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
import { Input } from '@/components/ui/input'
import { useForgotPassword } from '../services/forgot-password.hooks'
import { toast } from 'sonner'
import { IconCheck } from '@tabler/icons-react'

type ForgotPasswordFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
})

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const { mutate: forgotPassword } = useForgotPassword({
    onSuccess: () => {
      setIsLoading(false)
      setEmailSent(true)
      toast.success('Password reset link sent to your email!')
    },
    onError: (error: any) => {
      setIsLoading(false)
      const errorMsg = 
        error?.response?.data?.message || 
        error?.response?.data?.errors?.email?.[0] ||
        'Failed to send reset link. Please try again.'
      toast.error(errorMsg)
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    forgotPassword(data)
  }

  if (emailSent) {
    return (
      <div className='space-y-4 text-center'>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
          <IconCheck className='h-8 w-8 text-green-600' />
        </div>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>Check your email</h3>
          <p className='text-muted-foreground text-sm'>
            We've sent a password reset link to <strong>{form.getValues('email')}</strong>
          </p>
          <p className='text-muted-foreground text-sm'>
            The link will expire in 60 minutes.
          </p>
        </div>
        <div className='space-y-2'>
          <Button
            variant='outline'
            onClick={() => navigate({ to: '/sign-in' })}
            className='w-full'
          >
            Back to Login
          </Button>
          <Button
            variant='ghost'
            onClick={() => setEmailSent(false)}
            className='w-full'
          >
            Try another email
          </Button>
        </div>
      </div>
    )
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
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
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
