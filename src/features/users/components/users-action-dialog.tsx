'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { userTypes } from '../data/data'
import { User } from '../data/schema'
import { toast } from 'sonner'
import { usePostUser, useUpdateUser } from '../services/user.hook'

/* ------------------- Schema ------------------- */
const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required.' }),
    phone: z.string().min(1, { message: 'Phone number is required.' }),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Email is invalid.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    role: z.string().optional(),
    bio: z.string().optional(),
    dateOfBirth: z.string().optional(),
    status: z.string().min(1, { message: 'Status is required.' }),
    userType: z.string().min(1, { message: 'User Type is required.' }),
    isEdit: z.boolean(),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    if (!isEdit || (isEdit && password !== '')) {
      if (password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        })
      }

      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters long.',
          path: ['password'],
        })
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one lowercase letter.',
          path: ['password'],
        })
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number.',
          path: ['password'],
        })
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ['confirmPassword'],
        })
      }
    }
  })

type UserForm = z.infer<typeof formSchema>

/* ------------------- Component ------------------- */
interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: currentRow?.name || '',
          email: currentRow?.email || '',
          phone: currentRow?.phone || '',
          password: '',
          confirmPassword: '',
          role: currentRow?.role || '',
          bio: currentRow?.bio || '',
          dateOfBirth: currentRow?.dateOfBirth || '',
          status: String(currentRow?.status || 1),
          userType: String(currentRow?.userType || 1),
          isEdit,
        }
      : {
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: '',
          bio: '',
          dateOfBirth: '',
          status: '1',
          userType: '1',
          isEdit,
        },
  })

  const { mutate: createUser, isPending: creating } = usePostUser()
  const { mutate: updateUser, isPending: updating } = useUpdateUser()

  const onSubmit = (values: UserForm) => {
    if (isEdit && currentRow) {
      updateUser(
        { id: currentRow.id, ...values },
        {
          onSuccess: () => {
            toast.success('User updated successfully!')
            form.reset()
            onOpenChange(false)
          },
          onError: (error: any) => {
            toast.error(error?.message || 'Failed to update user')
          },
        }
      )
    } else {
      createUser(values, {
        onSuccess: () => {
          toast.success('User created successfully!')
          form.reset()
          onOpenChange(false)
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to create user')
        },
      })
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the user details below.'
              : 'Fill in the details to create a new user.'}
          </DialogDescription>
        </DialogHeader>

        <div className="-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 p-0.5"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+91 9876543210"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* User Type */}
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">User Type</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select a user type"
                      className="col-span-4"
                      items={userTypes.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="e.g., S3cur3P@ssw0rd"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder="Confirm password"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write something about the user"
                        className="col-span-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="col-span-4">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="2">Inactive</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                form="user-form"
                disabled={creating || updating}
                className="w-full"
              >
                {creating || updating
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : isEdit
                  ? 'Update User'
                  : 'Create User'}
              </Button>
            </form>
          </Form>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
