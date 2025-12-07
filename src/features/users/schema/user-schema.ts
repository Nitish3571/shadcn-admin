import { z } from 'zod';
import i18n from '@/i18n';

export const userFormSchema = z
  .object({
    name: z.string().min(2, { message: i18n.t('name_min_2_chars') }),
    email: z
      .string()
      .min(1, { message: i18n.t('email_required') })
      .email({ message: i18n.t('valid_email_required') }),
    phone: z.string().min(10, { message: i18n.t('valid_phone_required') }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    bio: z.string().optional(),
    date_of_birth: z.string().optional(),
    user_type: z.coerce.number().positive({ message: i18n.t('user_type_required') }),
    status: z.coerce.number().positive({ message: i18n.t('status_required') }),
    roles: z.array(z.string()).default([]),
    permissions: z.array(z.string()).default([]),
    avatar: z.any().optional(),
    isEdit: z.boolean().default(false),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    if (!isEdit || (isEdit && password && password !== '')) {
      if (!password || password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('password_required'),
          path: ['password'],
        });
        return;
      }
      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('password_min_8_chars'),
          path: ['password'],
        });
      }
      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('password_lowercase_required'),
          path: ['password'],
        });
      }
      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('password_number_required'),
          path: ['password'],
        });
      }
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('passwords_dont_match'),
          path: ['confirmPassword'],
        });
      }
    }
  });

export type UserFormSchema = z.infer<typeof userFormSchema>;
