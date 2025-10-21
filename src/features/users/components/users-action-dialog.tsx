'use client'

import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

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

import { useUsers } from '../context/users-context'
// Assuming you are using tanstack/react-query or a similar data fetching library
import { usePostUser, useGetUsersById } from '../services/user.hook' 
import { userTypes } from '../data/data'

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
    date_of_birth: z.string().optional(),
    status: z.string().min(1, { message: 'Status is required.' }),
    user_type: z.string().min(1, { message: 'User Type is required.' }),
    isEdit: z.boolean(),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    // 💡 Only run full password validation if NOT in edit mode OR if a new password was entered
    if (!isEdit || (isEdit && password !== '')) { 
      if (password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        })
        return; // Stop further password checks if empty and required
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

const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

/* ------------------- Component ------------------- */
export function UsersActionDialog() {
  const { open, setOpen, currentRow } = useUsers()
  const isEdit = open === 'edit'

  const userId = currentRow?.id
  const { data: userData, isLoading } = useGetUsersById(userId!, { enabled: !!userId && isEdit }) 

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: '',
      bio: '',
      date_of_birth: '',
      status: '1',
      user_type: '1',
      isEdit,
    },
  })

  const { mutate: createUser, isPending: creating } = usePostUser()

  // 🔹 When user data is fetched, update form
  useEffect(() => {
    // Ensure form.setValue only runs after data is available AND we are in edit mode
    if (userData && isEdit) {
      const res = userData?.data
      
      form.reset({
        name: res.name || '',
        email: res.email || '',
        phone: res.phone || '',
        role: res.role || '',
        bio: res.bio || '',
        date_of_birth: formatDateForInput(res.date_of_birth), 
        status: String(res.status || '1'),
        user_type: String(res.user_type || '3'),
        password: '',
        confirmPassword: '',
        isEdit: true,
      })
    } else if (open === 'add') {
      form.reset({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        bio: '',
        date_of_birth: '',
        status: '1',
        user_type: '3',
        isEdit: false, 
      });
    }
  }, [userData, isEdit, form, open])

  const onSubmit = (values: UserForm) => {
    const userId = currentRow?.id ?? null;

      createUser(
        { id: userId, ...values },
        {
          onSuccess: () => {
            toast.success(isEdit ? 'User updated successfully!' : 'User created successfully!')
            setOpen(null) 
            form.reset() 
          },
          onError: (error: any) =>
            toast.error(error?.message || (isEdit ? 'Failed to update user' : 'Failed to create user')),
        }
      )
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  if (isEdit && isLoading) {
    return (
      <Dialog open={true} onOpenChange={() => setOpen(null)}>
        <DialogContent className="sm:max-w-lg flex justify-center items-center h-40">
          <p>Loading user data...</p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open === 'add' || open === 'edit'}
      onOpenChange={(state) => {
        if (!state) {
          form.reset() 
          setOpen(null)
        }
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
              {/* All form fields remain the same */}
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
                    <FormLabel className="col-span-2 text-right">Phone</FormLabel>
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
                name="user_type"
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
                        placeholder={isEdit ? 'Leave blank to keep existing' : 'e.g., S3cur3P@ssw0rd'}
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
                        // Disabled only if in edit mode and password field is not touched
                        disabled={isEdit && !isPasswordTouched} 
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
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">Date of Birth</FormLabel>
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
                        // Use field.value for controlled component logic
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

              <Button type="submit" className="w-full" disabled={creating}>
                {creating
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