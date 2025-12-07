import { z } from 'zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'
import { useUpdateProfile } from './services/profile.services'
import { toast } from 'sonner'
import { IconUpload, IconX } from '@tabler/icons-react'

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(255, { message: 'Name must not be longer than 255 characters.' }),
  phone: z.string().max(20, { message: 'Phone must not exceed 20 characters.' }).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  bio: z.string().max(500, { message: 'Bio must not exceed 500 characters.' }).optional().nullable(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const { userInfo, refreshUserInfo } = useAuthStore()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userInfo?.name || '',
      phone: userInfo?.phone || '',
      date_of_birth: userInfo?.date_of_birth || '',
      bio: userInfo?.bio ? JSON.stringify(userInfo.bio) : '',
    },
  })

  // Update form when userInfo changes
  useEffect(() => {
    if (userInfo) {
      form.reset({
        name: userInfo.name || '',
        phone: userInfo.phone || '',
        date_of_birth: userInfo.date_of_birth || '',
        bio: userInfo.bio ? JSON.stringify(userInfo.bio) : '',
      })
    }
  }, [userInfo, form])

  const { mutate: updateProfile } = useUpdateProfile({
    onSuccess: () => {
      setIsLoading(false)
      toast.success('Profile updated successfully!')
      refreshUserInfo()
      setAvatarFile(null)
      setAvatarPreview(null)
    },
    onError: (error: any) => {
      setIsLoading(false)
      const errorMsg = error?.response?.data?.message || 'Failed to update profile'
      toast.error(errorMsg)
    },
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2048 * 1024) {
        toast.error('Avatar size must not exceed 2MB')
        return
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        toast.error('Avatar must be an image (jpeg, jpg, png, gif)')
        return
      }
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const removeAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const onSubmit = (data: ProfileFormValues) => {
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.phone) formData.append('phone', data.phone)
    if (data.date_of_birth) formData.append('date_of_birth', data.date_of_birth)
    if (data.bio) {
      try {
        const bioObj = JSON.parse(data.bio)
        formData.append('bio', JSON.stringify(bioObj))
      } catch {
        formData.append('bio', JSON.stringify({ about: data.bio }))
      }
    }
    if (avatarFile) formData.append('avatar', avatarFile)

    updateProfile(formData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Avatar Upload */}
        <div className='space-y-2'>
          <FormLabel>Profile Picture</FormLabel>
          <div className='flex items-start gap-6'>
            <Avatar className='h-24 w-24 border-2'>
              <AvatarImage src={avatarPreview || (userInfo as any)?.avatar_url} />
              <AvatarFallback className='text-lg'>
                {userInfo?.name?.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 space-y-3'>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <IconUpload className='mr-2 h-4 w-4' />
                  {avatarFile ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {(avatarPreview || (userInfo as any)?.avatar_url) && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={removeAvatar}
                  >
                    <IconX className='mr-2 h-4 w-4' />
                    Remove
                  </Button>
                )}
              </div>
              <p className='text-muted-foreground text-xs'>
                JPG, PNG or GIF. Max size 2MB. Recommended size 400x400px.
              </p>
              <input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your full name' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It will be visible to other users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid gap-6 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder='+1 (555) 000-0000' {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Optional
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='date_of_birth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type='date' {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>
                  Optional
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Write a short introduction about yourself...'
                  className='resize-none min-h-[100px]'
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile. Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex gap-3 pt-4'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
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
