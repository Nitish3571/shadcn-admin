import { z } from 'zod';
import i18n from '@/i18n';

export const roleFormSchema = z.object({
  name: z.string().min(2, { message: i18n.t('role_name_min_2_chars') }),
  permissions: z.array(z.string()).min(1, { message: i18n.t('at_least_one_permission') }),
  isEdit: z.boolean().default(false),
});

export type RoleFormSchema = z.infer<typeof roleFormSchema>;
