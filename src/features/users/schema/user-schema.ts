import { z } from 'zod';

export const userFormSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Please enter a valid email address.' }),
    phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    bio: z.string().optional(),
    date_of_birth: z.string().optional(),
    user_type: z.coerce.number().positive({ message: 'User type is required.' }),
    status: z.coerce.number().positive({ message: 'Status is required.' }),
    roles: z.array(z.string()).optional().default([]),
    permissions: z.array(z.string()).optional(),
    avatar: z.any().optional(),
    isEdit: z.boolean().default(false),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    if (!isEdit || (isEdit && password && password !== '')) {
      if (!password || password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        });
        return;
      }
      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters long.',
          path: ['password'],
        });
      }
      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one lowercase letter.',
          path: ['password'],
        });
      }
      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number.',
          path: ['password'],
        });
      }
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ['confirmPassword'],
        });
      }
    }
  });

export type UserFormSchema = z.infer<typeof userFormSchema>;
