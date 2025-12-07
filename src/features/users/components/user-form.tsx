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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PermissionsManager } from './PermissionsManager';

import { userFormSchema, UserFormSchema } from '../schema/user-schema';
import { useGetRoles, useGetPermissions, useGetUserById, usePostUser } from '../services/users.services';
import { useUserStore } from '../store/user-store';
import { DEFAULT_USER_TYPE, getUserStatusOptions } from '@/types/enums';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/useTranslation';

const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

/** ---------- Type helpers ---------- */
type ApiPermission = { id: number; name: string; description?: string };
type PermissionModule = { module: { id: number | null; name: string; slug?: string | null }; permissions: ApiPermission[] };
type ApiRole = { id: number; name: string; permissions?: ApiPermission[] };

const normalizePermissionName = (name: string) => {
  // Just lowercase, don't convert underscores
  // Permissions can have underscores (like activity_logs.view)
  if (!name) return name;
  return name.toLowerCase();
};

export function UserForm() {
  const { t } = useTranslation();
  const { open, setOpen, currentRow } = useUserStore();
  const userInfo = useAuthStore((state) => state.userInfo);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const refreshUserInfo = useAuthStore((state) => state.refreshUserInfo);
  const isEdit = open === 'edit';
  const isView = open === 'view';
  const userId = currentRow?.id;
  
  // Check if user has permission to view/manage roles (from Role Management module)
  const canManageRoles = hasPermission(['roles.view', 'roles.assign', 'roles.create', 'roles.edit']);

  // Only fetch roles/permissions if user has permission to manage them
  const { data: rolesResponse, isLoading: rolesLoading } = useGetRoles({ 
    enabled: canManageRoles 
  });
  const { data: permissionsResponse, isLoading: permissionsLoading } = useGetPermissions({ 
    enabled: canManageRoles 
  });
  const { data: userData, isLoading: userLoading } = useGetUserById(userId!);
  const { mutate: saveUser, isPending: saving } = usePostUser();

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [roleDerivedPermissions, setRoleDerivedPermissions] = useState<string[]>([]);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      bio: '',
      date_of_birth: '',
      status: 1,
      user_type: DEFAULT_USER_TYPE,
      roles: [],
      permissions: [],
      isEdit: false,
    },
  });

  // Process roles and permissions safe types
  const roles: ApiRole[] = Array.isArray(rolesResponse) ? rolesResponse : [];
  const permissionModules: PermissionModule[] = Array.isArray(permissionsResponse?.permissions)
    ? permissionsResponse.permissions
    : Array.isArray(permissionsResponse)
    ? (permissionsResponse as any)
    : [];

  const normalizedModules = useMemo(() => {
    return permissionModules.map((m) => {
      const moduleName = m.module?.name || 'No Module';
      const perms = Array.isArray(m.permissions)
        ? m.permissions.map((p) => ({
            id: p.id,
            rawName: p.name,
            name: normalizePermissionName(p.name),
            description: p.description,
          }))
        : [];
      return {
        moduleName,
        moduleSlug: m.module?.slug || null,
        permissions: perms,
      };
    });
  }, [permissionModules]);

  // Helper: Given a permission name, find the module item
  const findModuleForPermission = (permissionName: string) => {
    return normalizedModules.find((mod) => mod.permissions.some((p) => p.name === permissionName));
  };

  // Compute role-derived permissions when selectedRoles change
  useEffect(() => {
    if (!canManageRoles) return; // Skip if user can't manage roles
    
    const selectedRoleObjs = roles.filter((r) => selectedRoles.includes(r.name));
    const derived = new Set<string>();
    selectedRoleObjs.forEach((r) => {
      (r.permissions || []).forEach((p) => {
        derived.add(normalizePermissionName(p.name));
      });
    });
    const derivedArr = Array.from(derived);
    
    // Update both states together to avoid multiple renders
    setRoleDerivedPermissions(derivedArr);
    
    // Merge with current manual permissions using functional update
    setSelectedPermissions((prevSelected) => {
      // Get manual permissions (those not from the NEW derived list)
      const manualPerms = prevSelected.filter(p => !derivedArr.includes(p));
      return Array.from(new Set([...derivedArr, ...manualPerms]));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoles, roles, canManageRoles]);

  // When loading user for edit/view, populate states
  useEffect(() => {
    if (userData && (isEdit || isView)) {
      const user = userData.data;
      const roleNames = user.roles?.map((r: any) => r.name) || [];

      // role permissions set
      const rolePermissionNames = new Set<string>();
      user.roles?.forEach((role: any) => {
        role.permissions?.forEach((perm: any) => {
          rolePermissionNames.add(normalizePermissionName(perm.name));
        });
      });

      // Direct permissions are those not coming from roles
      const directPermissionNames =
        user.permissions
          ?.map((p: any) => normalizePermissionName(p.name))
          .filter((p: string) => !rolePermissionNames.has(p)) || [];

      // set states
      setSelectedRoles(roleNames);
      setRoleDerivedPermissions(Array.from(rolePermissionNames));
      setSelectedPermissions(Array.from(new Set([...Array.from(rolePermissionNames), ...directPermissionNames])));
      setAvatarPreview(user.avatar_url || '');

      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        date_of_birth: formatDateForInput(user.date_of_birth),
        status: user.status || 1,
        user_type: user.user_type || DEFAULT_USER_TYPE,
        roles: roleNames,
        permissions: Array.from(new Set([...Array.from(rolePermissionNames), ...directPermissionNames])),
        password: '',
        confirmPassword: '',
        isEdit: true,
      });
    } else if (open === 'add') {
      setSelectedRoles([]);
      setSelectedPermissions([]);
      setRoleDerivedPermissions([]);
      setAvatarFile(null);
      setAvatarPreview('');
      form.reset({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        bio: '',
        date_of_birth: '',
        status: 1,
        user_type: DEFAULT_USER_TYPE,
        roles: [],
        permissions: [],
        isEdit: false,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, isEdit, isView, open]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: UserFormSchema) => {
    if (isView) return;

    const formData = new FormData();
    if (isEdit && userId) formData.append('id', userId.toString());

    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('phone', values.phone);
    // user_type is handled by backend with default value 2
    formData.append('status', values.status.toString());

    if (values.password && values.password !== '') {
      formData.append('password', values.password);
    }
    if (values.bio) formData.append('bio', values.bio);
    if (values.date_of_birth) formData.append('date_of_birth', values.date_of_birth);

    // Only append roles/permissions if user has permission to manage them
    if (canManageRoles) {
      // Append roles
      values.roles.forEach((role) => formData.append('roles[]', role));

      // Append direct permissions
      selectedPermissions.forEach((permission) => formData.append('permissions[]', permission));
    }

    // Append avatar if selected
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    saveUser(formData, {
      onSuccess: async (data: any) => {
        toast.success(isEdit ? t('user_updated_successfully') : t('user_created_successfully'));
        
        // If editing current user, refresh their permissions instantly
        const updatedUserId = data?.data?.data?.[0]?.id || currentRow?.id;
        if (updatedUserId === userInfo?.id) {
          await refreshUserInfo();
          toast.info(t('permissions_updated'));
        }
        
        setOpen(null);
        form.reset();
        setAvatarFile(null);
        setAvatarPreview('');
        setSelectedPermissions([]);
        setRoleDerivedPermissions([]);
        setSelectedRoles([]);
      },
      onError: (error: any) => {
        toast.error(error?.message || (isEdit ? t('failed_to_update_user') : t('failed_to_create_user')));
      },
    });
  };

  /** ---------- Permission toggle handlers ---------- */

  // Toggle Role selection
  const handleRoleToggle = (roleName: string) => {
    const newRoles = selectedRoles.includes(roleName)
      ? selectedRoles.filter((r) => r !== roleName)
      : [...selectedRoles, roleName];

    setSelectedRoles(newRoles);
    form.setValue('roles', newRoles);
    // roleDerivedPermissions will be recalculated by effect
  };

  // Toggle a single permission (manual user toggle)
  const handlePermissionToggle = (permissionName: string) => {
    const normalized = normalizePermissionName(permissionName);
    const currentlySelected = new Set(selectedPermissions);

    if (currentlySelected.has(normalized)) {
      // Unchecking permission
      // If it's a view permission -> uncheck others in module (except those from selected roles)
      const isView = normalized.endsWith('.view');
      if (isView) {
        // remove all module perms except those coming from roles
        const module = findModuleForPermission(normalized);
        if (module) {
          const roleSet = new Set(roleDerivedPermissions);
          module.permissions.forEach((p) => {
            if (!roleSet.has(p.name)) {
              currentlySelected.delete(p.name);
            }
          });
        }
      } else {
        currentlySelected.delete(normalized);
      }
    } else {
      // Checking permission
      // If not a view permission ensure view is checked
      const parts = normalized.split('.');
      const isView = normalized.endsWith('.view');

      if (!isView) {
        const viewName = `${parts[0]}.view`;
        currentlySelected.add(viewName);
      }
      currentlySelected.add(normalized);
    }

    const final = Array.from(currentlySelected);
    setSelectedPermissions(final);
  };

  // Toggle a module (check/uncheck all)
  const handleModuleToggle = (moduleItem: (typeof normalizedModules)[0]) => {
    const modulePermNames = moduleItem.permissions.map((p) => p.name);
    const selectionSet = new Set(selectedPermissions);
    const isAllChecked = modulePermNames.every((n) => selectionSet.has(n));

    if (isAllChecked) {
      // Uncheck all that are not required by roles
      const roleSet = new Set(roleDerivedPermissions);
      modulePermNames.forEach((n) => {
        if (!roleSet.has(n)) {
          selectionSet.delete(n);
        }
      });
    } else {
      // Check all (add to selection)
      modulePermNames.forEach((n) => selectionSet.add(n));
    }

    setSelectedPermissions(Array.from(selectionSet));
  };

  const isLoading = rolesLoading || permissionsLoading || (isEdit && userLoading);
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

  const dialogTitle = isView ? t('view_user') : isEdit ? t('edit_user') : t('add_new_user');

  return (
    <Dialog
      open={!!open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset();
          setOpen(null);
          setAvatarFile(null);
          setAvatarPreview('');
          setSelectedPermissions([]);
          setRoleDerivedPermissions([]);
          setSelectedRoles([]);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {isView
              ? t('view_user_details')
              : isEdit
              ? t('update_user_details')
              : t('fill_details_create_user')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">{t('basic_info')}</TabsTrigger>
                {canManageRoles && <TabsTrigger value="rights">{t('rights')}</TabsTrigger>}
              </TabsList>

              {/* ----------------- BASIC INFO TAB ----------------- */}
              <TabsContent value="basic" className="p-0">
                {/* Avatar Upload */}
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="text-sm font-medium text-gray-700">{t('profile_picture')}</h3>
                  <div className="flex items-center gap-4">
                    {avatarPreview && (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                        <img src={avatarPreview} alt={t('avatar_preview')} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {!isView && (
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          onChange={handleAvatarChange}
                          disabled={isDisabled}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">{t('max_size_formats')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="text-sm font-medium text-gray-700">{t('user_information')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('full_name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('john_doe')} disabled={isDisabled} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('john_example_email')} disabled={isDisabled} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('phone')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('phone_placeholder')} disabled={isDisabled} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('status')}</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={String(field.value)}
                            disabled={isDisabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('select_status')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getUserStatusOptions().map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('date_of_birth')}</FormLabel>
                          <FormControl>
                            <Input type="date" disabled={isDisabled} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('bio')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('write_about_user')} disabled={isDisabled} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Section */}
                {!isView && (
                  <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="text-sm font-medium text-gray-700">{isEdit ? t('change_password_optional') : t('password')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('password')}</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={isEdit ? t('leave_blank_keep_current') : t('enter_password')}
                                disabled={isDisabled}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('confirm_password')}</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder={t('confirm_password')} disabled={isDisabled} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* ----------------- RIGHTS TAB ----------------- */}
              {canManageRoles && (
              <TabsContent value="rights" className="p-0">
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="text-sm font-medium text-gray-700">{t('roles')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roles.length === 0 ? (
                      <p className="text-sm text-gray-500">{t('no_roles_available')}</p>
                    ) : (
                      roles.map((role) => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={selectedRoles.includes(role.name)}
                            onCheckedChange={() => handleRoleToggle(role.name)}
                            disabled={isDisabled}
                          />
                          <label htmlFor={`role-${role.id}`} className="text-sm font-medium leading-none cursor-pointer">
                            {role.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">{t('permissions')}</h3>
                    </div>
                  </div>
                  <PermissionsManager
                    modules={normalizedModules as any}
                    selectedPermissions={selectedPermissions}
                    onPermissionToggle={handlePermissionToggle}
                    onModuleToggle={handleModuleToggle as any}
                    onGlobalToggle={() => {}}
                    disabled={isDisabled}
                  />
              
                </div>
              </TabsContent>
              )}
            </Tabs>

            <input type="hidden" {...form.register('roles')} value={selectedRoles.join(',')} />
            <input type="hidden" {...form.register('permissions')} value={selectedPermissions.join(',')} />
          </form>
        </Form>

        {!isView && (
          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(null)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={saving} form="user-form">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? t('update_user') : t('create_user')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}


