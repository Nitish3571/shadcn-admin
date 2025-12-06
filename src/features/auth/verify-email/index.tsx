import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconCheck, IconX, IconLoader2 } from '@tabler/icons-react'
import AuthLayout from '../auth-layout'
import { useVerifyEmail, useResendVerification } from './services/verify-email.hooks'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/(auth)/verify-email' })
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  const { mutate: verifyEmail } = useVerifyEmail({
    onSuccess: () => {
      setStatus('success')
      setTimeout(() => {
        navigate({ to: '/sign-in', replace: true })
      }, 3000)
    },
    onError: (error: any) => {
      setStatus('error')
      setErrorMessage(
        error?.response?.data?.message || 
        error?.response?.data?.errors?.token?.[0] ||
        'Verification failed. The link may be expired or invalid.'
      )
    },
  })

  const { mutate: resendVerification, isPending: isResending } = useResendVerification({
    onSuccess: () => {
      setErrorMessage('Verification email sent! Please check your inbox.')
    },
  })

  useEffect(() => {
    const token = (search as any)?.token
    const email = (search as any)?.email

    if (token && email) {
      verifyEmail({ token, email })
    } else {
      setStatus('error')
      setErrorMessage('Invalid verification link. Missing token or email.')
    }
  }, [search])

  const handleResend = () => {
    const email = (search as any)?.email
    if (email) {
      resendVerification({ email })
    }
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
            {status === 'verifying' && (
              <IconLoader2 className='h-8 w-8 animate-spin text-primary' />
            )}
            {status === 'success' && (
              <IconCheck className='h-8 w-8 text-green-600' />
            )}
            {status === 'error' && (
              <IconX className='h-8 w-8 text-red-600' />
            )}
          </div>
          <CardTitle className='text-lg tracking-tight'>
            {status === 'verifying' && 'Verifying Your Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'verifying' && 'Please wait while we verify your email address...'}
            {status === 'success' && 'Your email has been successfully verified. Redirecting to login...'}
            {status === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>
        {status === 'error' && (
          <CardContent className='space-y-3'>
            <Button
              onClick={handleResend}
              disabled={isResending}
              className='w-full'
            >
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <Button
              variant='outline'
              onClick={() => navigate({ to: '/sign-in' })}
              className='w-full'
            >
              Back to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </AuthLayout>
  )
}
