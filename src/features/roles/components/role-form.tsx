'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PermissionsManager } from './permissions-list';
import { roleFormSchema, RoleFormSchema } from '../schema/role-schema';
import { useGetPermissions, useGetRoleById, usePostRole } from '../services/roles.services';
import { useRoleStore } from '../store/role-store';

type ApiPermission = { id: number; name: string; description?: string };
type PermissionModule = { module: { id: number | null; name: string; slug?: string | null }; permissions: ApiPermission[] };

const normalizePermissionName = (name: string) => name.toLowerCase().replace(/_/g, '.');

export function RoleForm() {
  const { open, setOpen, currentRow } = useRoleStore();
  const isEdit = open === 'edit';
  const isView = open === 'view';
  const roleId = currentRow?.id;

  const { data: permissionsResponse, isLoading: permissionsLoading } = useGetPermissions();
  const { data: roleData, isLoading: roleLoading } = useGetRoleById(roleId!);
  const { mutate: saveRole, isPending: saving } = usePostRole();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const form = useForm<RoleFormSchema>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: { name: '', permissions: [], isEdit: false },
  });

    const permissionModules: PermissionModule[] = Array.isArray(permissionsResponse?.permissions)
  ? permissionsResponse.permissions
  : [];

  const normalizedModules = useMemo(() => {
    return permissionModules.map((m) => {
      const moduleName = m.module?.name || 'No Module';
      const perms = Array.isArray(m.permissions)
        ? m.permissions.map((p) => ({
            id: p.id,
            rawName: p.name,
            name: normalizePermissionName(p.name),
            description: p.description || '',
          }))
        : [];
      return { moduleName, moduleSlug: m.module?.slug || null, permissions: perms };
    });
  }, [permissionModules]);

  // Flatten permissions for lookup
  const allPermissionNames = useMemo(() => {
    const set = new Set<string>();
    normalizedModules.forEach((mod) => mod.permissions.forEach((p) => set.add(p.name)));
    return Array.from(set);
  }, [normalizedModules]);

  // Populate form for edit/view
  useEffect(() => {
    if (roleData && (isEdit || isView)) {
      const role = roleData.data;
      const perms = role.permissions?.map((p: any) => normalizePermissionName(p.name)) || [];
      setSelectedPermissions(perms);
      form.reset({ name: role.name, permissions: perms, isEdit: true });
    } else if (open === 'add') {
      setSelectedPermissions([]);
      form.reset({ name: '', permissions: [], isEdit: false });
    }
  }, [roleData, isEdit, isView, open]);

  // Keep form.permissions in sync
  useEffect(() => {
    form.setValue('permissions', selectedPermissions);
  }, [selectedPermissions, form]);

  // Submit
  const onSubmit = (values: RoleFormSchema) => {
    if (isView) return;

    const formData = new FormData();
    if (isEdit && roleId) formData.append('id', roleId.toString());
    formData.append('name', values.name);
    selectedPermissions.forEach((p) => formData.append('permissions[]', p));

    saveRole(formData, {
      onSuccess: () => {
        toast.success(isEdit ? 'Role updated successfully!' : 'Role created successfully!');
        setOpen(null);
        form.reset();
        setSelectedPermissions([]);
      },
      onError: (error: any) => {
        toast.error(error?.message || (isEdit ? 'Failed to update role' : 'Failed to create role'));
      },
    });
  };

  const handlePermissionToggle = (permName: string) => {
    const set = new Set(selectedPermissions);
    if (set.has(permName)) set.delete(permName);
    else set.add(permName);
    setSelectedPermissions(Array.from(set));
  };

  const handleModuleToggle = (module: typeof normalizedModules[0]) => {
    const set = new Set(selectedPermissions);
    const allChecked = module.permissions.every((p) => set.has(p.name));
    if (allChecked) module.permissions.forEach((p) => set.delete(p.name));
    else module.permissions.forEach((p) => set.add(p.name));
    setSelectedPermissions(Array.from(set));
  };

  const isLoading = permissionsLoading || (isEdit && roleLoading);
  const isDisabled = isView || saving;

  if (isLoading) {
    return (
      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="sm:max-w-2xl flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </DialogContent>
      </Dialog>
    );
  }

  const dialogTitle = isView ? 'View Role' : isEdit ? 'Edit Role' : 'Add New Role';

  return (
    <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {isView ? 'View role details below.' : isEdit ? 'Update the role details below.' : 'Fill in the details to create a new role.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="role-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-md">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role name" disabled={isDisabled} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="text-sm font-medium text-gray-700">Permissions</h3>
              <PermissionsManager
                modules={normalizedModules}
                selectedPermissions={selectedPermissions}
                onPermissionToggle={handlePermissionToggle}
                onModuleToggle={handleModuleToggle}
                disabled={isDisabled}
                onGlobalToggle={() => {}}
              />
            </div>

            <input type="hidden" {...form.register('permissions')} value={selectedPermissions.join(',')} />
          </form>
        </Form>

        {!isView && (
          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} form="role-form">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
