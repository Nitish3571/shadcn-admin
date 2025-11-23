import { z } from 'zod';

export const roleFormSchema = z.object({
  name: z.string().min(2, { message: 'Role name must be at least 2 characters.' }),
  permissions: z.array(z.string()).min(1, { message: 'At least one permission must be selected.' }),
  isEdit: z.boolean().default(false),
});

export type RoleFormSchema = z.infer<typeof roleFormSchema>;
