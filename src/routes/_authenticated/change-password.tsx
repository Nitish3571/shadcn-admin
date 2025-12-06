import { createFileRoute } from '@tanstack/react-router'
import ChangePassword from '@/features/settings/change-password'

export const Route = createFileRoute('/_authenticated/change-password')({
  component: ChangePassword,
})
