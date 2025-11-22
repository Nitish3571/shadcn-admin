// 'use client';

// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';
// import { Loader2 } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { userFormSchema, UserFormSchema } from '../schema/user-schema';
// import { useGetRoles, useGetPermissions, useGetUserById, usePostUser } from '../services/users.services';
// import { useUserStore } from '../store/user-store';

// const userTypes = [
//   { label: 'Admin', value: 1 },
//   { label: 'Manager', value: 2 },
//   { label: 'Regular User', value: 3 },
// ];

// const formatDateForInput = (dateString?: string): string => {
//   if (!dateString) return '';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return '';
//     return date.toISOString().split('T')[0];
//   } catch {
//     return '';
//   }
// };

// export function UserForm() {
//   const { open, setOpen, currentRow } = useUserStore();
//   const isEdit = open === 'edit';
//   const isView = open === 'view';
//   const userId = currentRow?.id;

//   const { data: rolesResponse, isLoading: rolesLoading } = useGetRoles();
//   const { data: permissionsResponse, isLoading: permissionsLoading } = useGetPermissions();
//   const { data: userData, isLoading: userLoading } = useGetUserById(userId!);
//   const { mutate: saveUser, isPending: saving } = usePostUser();

//   const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
//   const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState<string>('');

//   const form = useForm<UserFormSchema>({
//     resolver: zodResolver(userFormSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       phone: '',
//       password: '',
//       confirmPassword: '',
//       bio: '',
//       date_of_birth: '',
//       status: 1,
//       user_type: 3,
//       roles: [],
//       permissions: [],
//       isEdit: false,
//     },
//   });

//   // Extract roles and permissions from API response
//   const roles = Array.isArray(rolesResponse) ? rolesResponse : [];
  
//   // Handle permissions - could be flat array or grouped by module
//   let permissions: any[] = [];
//   if (Array.isArray(permissionsResponse)) {
//     // Check if grouped by module
//     if (permissionsResponse[0]?.permissions) {
//       permissions = permissionsResponse.flatMap((group: any) => group.permissions || []);
//     } else {
//       permissions = permissionsResponse;
//     }
//   }

//   console.log('=== USER FORM DEBUG ===');
//   console.log('Roles Response:', rolesResponse);
//   console.log('Permissions Response:', permissionsResponse);
//   console.log('Processed Roles:', roles);
//   console.log('Processed Permissions:', permissions);

//   useEffect(() => {
//     if (userData && (isEdit || isView)) {
//       const user = userData.data;
//       const roleNames = user.roles?.map((r) => r.name) || [];
      
//       // Get role permission names
//       const rolePermissionNames = new Set<string>();
//       user.roles?.forEach(role => {
//         role.permissions?.forEach(perm => {
//           rolePermissionNames.add(perm.name);
//         });
//       });

//       // Direct permissions are those NOT from roles
//       const directPermissionNames = user.permissions
//         ?.filter(p => !rolePermissionNames.has(p.name))
//         .map(p => p.name) || [];

//       setSelectedRoles(roleNames);
//       setSelectedPermissions(directPermissionNames);
//       setAvatarPreview(user.avatar_url || '');

//       form.reset({
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         bio: user.bio || '',
//         date_of_birth: formatDateForInput(user.date_of_birth),
//         status: user.status || 1,
//         user_type: user.user_type || 3,
//         roles: roleNames,
//         permissions: directPermissionNames,
//         password: '',
//         confirmPassword: '',
//         isEdit: true,
//       });
//     } else if (open === 'add') {
//       setSelectedRoles([]);
//       setSelectedPermissions([]);
//       setAvatarFile(null);
//       setAvatarPreview('');
//       form.reset({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         confirmPassword: '',
//         bio: '',
//         date_of_birth: '',
//         status: 1,
//         user_type: 3,
//         roles: [],
//         permissions: [],
//         isEdit: false,
//       });
//     }
//   }, [userData, isEdit, isView, form, open]);

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAvatarFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = (values: UserFormSchema) => {
//     if (isView) return;

//     const formData = new FormData();
//     if (isEdit && userId) formData.append('id', userId.toString());

//     formData.append('name', values.name);
//     formData.append('email', values.email);
//     formData.append('phone', values.phone);
//     formData.append('user_type', values.user_type.toString());
//     formData.append('status', values.status.toString());

//     if (values.password && values.password !== '') {
//       formData.append('password', values.password);
//     }
//     if (values.bio) formData.append('bio', values.bio);
//     if (values.date_of_birth) formData.append('date_of_birth', values.date_of_birth);

//     // Append roles
//     values.roles.forEach((role) => formData.append('roles[]', role));
    
//     // Append direct permissions (optional)
//     if (values.permissions && values.permissions.length > 0) {
//       values.permissions.forEach((permission) => formData.append('permissions[]', permission));
//     }

//     // Append avatar if selected
//     if (avatarFile) {
//       formData.append('avatar', avatarFile);
//     }

//     saveUser(formData, {
//       onSuccess: () => {
//         toast.success(isEdit ? 'User updated successfully!' : 'User created successfully!');
//         setOpen(null);
//         form.reset();
//         setAvatarFile(null);
//         setAvatarPreview('');
//       },
//       onError: (error: any) => {
//         toast.error(error?.message || (isEdit ? 'Failed to update user' : 'Failed to create user'));
//       },
//     });
//   };

//   const handleRoleToggle = (roleName: string) => {
//     const newRoles = selectedRoles.includes(roleName)
//       ? selectedRoles.filter((r) => r !== roleName)
//       : [...selectedRoles, roleName];
//     setSelectedRoles(newRoles);
//     form.setValue('roles', newRoles);
//   };

//   const handlePermissionToggle = (permissionName: string) => {
//     const newPermissions = selectedPermissions.includes(permissionName)
//       ? selectedPermissions.filter((p) => p !== permissionName)
//       : [...selectedPermissions, permissionName];
//     setSelectedPermissions(newPermissions);
//     form.setValue('permissions', newPermissions);
//   };

//   const isLoading = rolesLoading || permissionsLoading || (isEdit && userLoading);
//   const isDisabled = isView || saving;

//   if (isLoading) {
//     return (
//       <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
//         <DialogContent className="sm:max-w-2xl flex justify-center items-center h-40">
//           <Loader2 className="h-8 w-8 animate-spin" />
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   const dialogTitle = isView ? 'View User' : isEdit ? 'Edit User' : 'Add New User';

//   return (
//     <Dialog open={!!open} onOpenChange={(state) => { if (!state) { form.reset(); setOpen(null); setAvatarFile(null); setAvatarPreview(''); } }}>
//       <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader className="text-left">
//           <DialogTitle>{dialogTitle}</DialogTitle>
//           <DialogDescription>
//             {isView ? 'View user details below.' : isEdit ? 'Update the user details below.' : 'Fill in the details to create a new user.'}
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Avatar Upload */}
//             <div className="space-y-4 p-4 border rounded-md">
//               <h3 className="text-sm font-medium text-gray-700">Profile Picture</h3>
//               <div className="flex items-center gap-4">
//                 {avatarPreview && (
//                   <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
//                     <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
//                   </div>
//                 )}
//                 {!isView && (
//                   <div className="flex-1">
//                     <Input
//                       type="file"
//                       accept="image/jpeg,image/png,image/jpg,image/gif"
//                       onChange={handleAvatarChange}
//                       disabled={isDisabled}
//                       className="cursor-pointer"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">Max size: 2MB. Formats: JPEG, PNG, JPG, GIF</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* User Information */}
//             <div className="space-y-4 p-4 border rounded-md">
//               <h3 className="text-sm font-medium text-gray-700">User Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField control={form.control} name="name" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Full Name</FormLabel>
//                     <FormControl><Input placeholder="John Doe" disabled={isDisabled} {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />

//                 <FormField control={form.control} name="email" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl><Input type="email" placeholder="john@example.com" disabled={isDisabled} {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />

//                 <FormField control={form.control} name="phone" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Phone</FormLabel>
//                     <FormControl><Input placeholder="+1234567890" disabled={isDisabled} {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />

//                 <FormField control={form.control} name="user_type" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>User Type</FormLabel>
//                     <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled={isDisabled}>
//                       <FormControl><SelectTrigger><SelectValue placeholder="Select user type" /></SelectTrigger></FormControl>
//                       <SelectContent>
//                         {userTypes.map((type) => (
//                           <SelectItem key={type.value} value={String(type.value)}>{type.label}</SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )} />

//                 <FormField control={form.control} name="status" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Status</FormLabel>
//                     <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled={isDisabled}>
//                       <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
//                       <SelectContent>
//                         <SelectItem value="1">Active</SelectItem>
//                         <SelectItem value="2">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )} />

//                 <FormField control={form.control} name="date_of_birth" render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Date of Birth</FormLabel>
//                     <FormControl><Input type="date" disabled={isDisabled} {...field} /></FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )} />
//               </div>

//               <FormField control={form.control} name="bio" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Bio</FormLabel>
//                   <FormControl><Textarea placeholder="Write something about the user" disabled={isDisabled} {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>

//             {/* Password Section */}
//             {!isView && (
//               <div className="space-y-4 p-4 border rounded-md">
//                 <h3 className="text-sm font-medium text-gray-700">{isEdit ? 'Change Password (Optional)' : 'Password'}</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField control={form.control} name="password" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl><Input type="password" placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password'} disabled={isDisabled} {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />

//                   <FormField control={form.control} name="confirmPassword" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Confirm Password</FormLabel>
//                       <FormControl><Input type="password" placeholder="Confirm password" disabled={isDisabled} {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                 </div>
//               </div>
//             )}

//             {/* Roles Section */}
//             <div className="space-y-4 p-4 border rounded-md">
//               <h3 className="text-sm font-medium text-gray-700">Roles ({roles.length} available)</h3>
//               {roles.length === 0 ? (
//                 <p className="text-sm text-gray-500">No roles available. Loading...</p>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {roles.map((role: any) => (
//                     <div key={role.id} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`role-${role.id}`}
//                         checked={selectedRoles.includes(role.name)}
//                         onCheckedChange={() => handleRoleToggle(role.name)}
//                         disabled={isDisabled}
//                       />
//                       <label
//                         htmlFor={`role-${role.id}`}
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                       >
//                         {role.display_name || role.name}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <FormMessage>{form.formState.errors.roles?.message}</FormMessage>
//             </div>

//             {/* Permissions Section */}
//             <div className="space-y-4 p-4 border rounded-md">
//               <h3 className="text-sm font-medium text-gray-700">Additional Permissions ({permissions.length} available)</h3>
//               <p className="text-xs text-gray-500">These permissions are in addition to role permissions</p>
//               {permissions.length === 0 ? (
//                 <p className="text-sm text-gray-500">No permissions available. Loading...</p>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                   {permissions.map((permission: any) => (
//                     <div key={permission.id} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`permission-${permission.id}`}
//                         checked={selectedPermissions.includes(permission.name)}
//                         onCheckedChange={() => handlePermissionToggle(permission.name)}
//                         disabled={isDisabled}
//                       />
//                       <label
//                         htmlFor={`permission-${permission.id}`}
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                       >
//                         {permission.display_name || permission.name}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </form>
//         </Form>

//         {!isView && (
//           <DialogFooter>
//             <Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(null)}>Cancel</Button>
//             <Button type="submit" disabled={saving} form="user-form">
//               {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {isEdit ? 'Update User' : 'Create User'}
//             </Button>
//           </DialogFooter>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }


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

import { userFormSchema, UserFormSchema } from '../schema/user-schema';
import { useGetRoles, useGetPermissions, useGetUserById, usePostUser } from '../services/users.services';
import { useUserStore } from '../store/user-store';

const userTypes = [
  { label: 'Admin', value: 1 },
  { label: 'Manager', value: 2 },
  { label: 'Regular User', value: 3 },
];

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
  // convert underscore style to dot style, and ensure lower case
  if (!name) return name;
  if (name.includes('_')) {
    return name.replace(/_/g, '.').toLowerCase();
  }
  return name.toLowerCase();
};

export function UserForm() {
  const { open, setOpen, currentRow } = useUserStore();
  const isEdit = open === 'edit';
  const isView = open === 'view';
  const userId = currentRow?.id;

  const { data: rolesResponse, isLoading: rolesLoading } = useGetRoles();
  const { data: permissionsResponse, isLoading: permissionsLoading } = useGetPermissions();
  const { data: userData, isLoading: userLoading } = useGetUserById(userId!);
  const { mutate: saveUser, isPending: saving } = usePostUser();

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]); // single source of truth for checkboxes
  const [manualPermissions, setManualPermissions] = useState<string[]>([]); // user toggles
  const [roleDerivedPermissions, setRoleDerivedPermissions] = useState<string[]>([]); // derived from selected roles

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      bio: '',
      date_of_birth: '',
      status: 1,
      user_type: 3,
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

  /** Build normalized module-permissions structure:
   * For each module keep:
   * {
   *  moduleName,
   *  permissions: [{ id, name (normalized), rawName, description }]
   * }
   */
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
      return {
        moduleName,
        moduleSlug: m.module?.slug || null,
        permissions: perms,
      };
    });
  }, [permissionModules]);

  // Flatten all module permission names for quick lookup
  const allPermissionNames = useMemo(() => {
    const set = new Set<string>();
    normalizedModules.forEach((mod) => mod.permissions.forEach((p) => set.add(p.name)));
    return Array.from(set);
  }, [normalizedModules]);

  // Helper: Given a permission name, find the module item
  const findModuleForPermission = (permissionName: string) => {
    return normalizedModules.find((mod) => mod.permissions.some((p) => p.name === permissionName));
  };

  // Compute role-derived permissions when selectedRoles change
  useEffect(() => {
    const selectedRoleObjs = roles.filter((r) => selectedRoles.includes(r.name));
    const derived = new Set<string>();
    selectedRoleObjs.forEach((r) => {
      (r.permissions || []).forEach((p) => {
        derived.add(normalizePermissionName(p.name));
      });
    });
    const derivedArr = Array.from(derived);
    setRoleDerivedPermissions(derivedArr);

    // Merge with manualPermissions (manual should persist)
    const merged = Array.from(new Set([...derivedArr, ...manualPermissions]));
    setSelectedPermissions(merged);
    // sync form
    form.setValue('permissions', merged);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoles, roles]);

  // Keep form.permissions in sync when selectedPermissions changes
  useEffect(() => {
    form.setValue('permissions', selectedPermissions);
  }, [selectedPermissions, form]);

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
      setManualPermissions(directPermissionNames);
      setSelectedPermissions(Array.from(new Set([...Array.from(rolePermissionNames), ...directPermissionNames])));
      setAvatarPreview(user.avatar_url || '');

      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        date_of_birth: formatDateForInput(user.date_of_birth),
        status: user.status || 1,
        user_type: user.user_type || 3,
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
      setManualPermissions([]);
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
        user_type: 3,
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
    formData.append('user_type', values.user_type.toString());
    formData.append('status', values.status.toString());

    if (values.password && values.password !== '') {
      formData.append('password', values.password);
    }
    if (values.bio) formData.append('bio', values.bio);
    if (values.date_of_birth) formData.append('date_of_birth', values.date_of_birth);

    // Append roles
    (values.roles || []).forEach((role) => formData.append('roles[]', role));

    // Append direct permissions (we will send selectedPermissions - but you may want to send only manual ones)
    (selectedPermissions || []).forEach((permission) => formData.append('permissions[]', permission));

    // Append avatar if selected
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    saveUser(formData, {
      onSuccess: () => {
        toast.success(isEdit ? 'User updated successfully!' : 'User created successfully!');
        setOpen(null);
        form.reset();
        setAvatarFile(null);
        setAvatarPreview('');
        setSelectedPermissions([]);
        setManualPermissions([]);
        setRoleDerivedPermissions([]);
        setSelectedRoles([]);
      },
      onError: (error: any) => {
        toast.error(error?.message || (isEdit ? 'Failed to update user' : 'Failed to create user'));
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
              // remove from manualPermissions if present
              setManualPermissions((prev) => prev.filter((x) => x !== p.name));
            }
          });
        }
      } else {
        currentlySelected.delete(normalized);
        setManualPermissions((prev) => prev.filter((x) => x !== normalized));
      }
    } else {
      // Checking permission
      // If not a view permission ensure view is checked
      const parts = normalized.split('.');
      const isView = normalized.endsWith('.view');

      if (!isView) {
        const viewName = `${parts[0]}.view`;
        currentlySelected.add(viewName);
        // add viewName to manual permissions if not present and not role-derived
        if (!roleDerivedPermissions.includes(viewName)) {
          setManualPermissions((prev) => Array.from(new Set([...prev, viewName])));
        }
      }
      currentlySelected.add(normalized);
      // add normalized to manualPermissions (if not role-derived)
      if (!roleDerivedPermissions.includes(normalized)) {
        setManualPermissions((prev) => Array.from(new Set([...prev, normalized])));
      }
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
          setManualPermissions((prev) => prev.filter((x) => x !== n));
        }
      });
    } else {
      // Check all (add to selection). If view missing, add it automatically.
      modulePermNames.forEach((n) => selectionSet.add(n));
      modulePermNames.forEach((n) => {
        if (!roleDerivedPermissions.includes(n)) {
          setManualPermissions((prev) => Array.from(new Set([...prev, n])));
        }
      });
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

  const dialogTitle = isView ? 'View User' : isEdit ? 'Edit User' : 'Add New User';

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
          setManualPermissions([]);
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
              ? 'View user details below.'
              : isEdit
              ? 'Update the user details below.'
              : 'Fill in the details to create a new user.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="rights">Rights</TabsTrigger>
              </TabsList>

              {/* ----------------- BASIC INFO TAB ----------------- */}
              <TabsContent value="basic" className="p-0">
                {/* Avatar Upload */}
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="text-sm font-medium text-gray-700">Profile Picture</h3>
                  <div className="flex items-center gap-4">
                    {avatarPreview && (
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                        <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
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
                        <p className="text-xs text-gray-500 mt-1">Max size: 2MB. Formats: JPEG, PNG, JPG, GIF</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="text-sm font-medium text-gray-700">User Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" disabled={isDisabled} {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" disabled={isDisabled} {...field} />
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
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" disabled={isDisabled} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="user_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Type</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={String(field.value)}
                            disabled={isDisabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select user type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {userTypes.map((type) => (
                                <SelectItem key={type.value} value={String(type.value)}>
                                  {type.label}
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={String(field.value)}
                            disabled={isDisabled}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Active</SelectItem>
                              <SelectItem value="2">Inactive</SelectItem>
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
                          <FormLabel>Date of Birth</FormLabel>
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
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write something about the user" disabled={isDisabled} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Section */}
                {!isView && (
                  <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="text-sm font-medium text-gray-700">{isEdit ? 'Change Password (Optional)' : 'Password'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password'}
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
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm password" disabled={isDisabled} {...field} />
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
              <TabsContent value="rights" className="p-0">
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="text-sm font-medium text-gray-700">Roles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roles.length === 0 ? (
                      <p className="text-sm text-gray-500">No roles available. Loading...</p>
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
                  <h3 className="text-sm font-medium text-gray-700">Permissions</h3>
                  <p className="text-xs text-gray-500">Select module permissions. Checking the module will select all permissions in it.</p>

                  {normalizedModules.length === 0 ? (
                    <p className="text-sm text-gray-500">No permissions available. Loading...</p>
                  ) : (
                    <div className="space-y-4">
                      {normalizedModules.map((mod, idx) => {
                        // Map actions for display
                        const permMap = new Map<string, { id: number; rawName: string; name: string }>();
                        mod.permissions.forEach((p) => permMap.set(p.name, { id: p.id, rawName: p.rawName, name: p.name }));

                        const moduleAllChecked = mod.permissions.every((p) => selectedPermissions.includes(p.name));
                        const moduleAnyChecked = mod.permissions.some((p) => selectedPermissions.includes(p.name));

                        // For grid columns: view, create, edit, delete, more (others)
                        const viewPerm = mod.permissions.find((p) => p.name.endsWith('.view'));
                        const createPerm = mod.permissions.find((p) => p.name.endsWith('.create'));
                        const editPerm = mod.permissions.find((p) => p.name.endsWith('.edit'));
                        const deletePerm = mod.permissions.find((p) => p.name.endsWith('.delete'));
                        const morePerms = mod.permissions.filter(
                          (p) => !p.name.endsWith('.view') && !p.name.endsWith('.create') && !p.name.endsWith('.edit') && !p.name.endsWith('.delete')
                        );

                        return (
                          <div key={idx} className="border rounded p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`module-${idx}`}
                                  checked={moduleAllChecked}
                                  onCheckedChange={() => handleModuleToggle(mod)}
                                  disabled={isDisabled}
                                />
                                <div>
                                  <div className="text-sm font-medium">{mod.moduleName}</div>
                                  {mod.moduleSlug && <div className="text-xs text-gray-500">{mod.moduleSlug}</div>}
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">{moduleAnyChecked ? 'Some selected' : 'None'}</div>
                            </div>

                            <div className="mt-3 grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                              {/* Header labels for grid cells */}
                              <div className="text-xs font-medium">Module</div>

                              <div className="text-xs font-medium text-center">View</div>
                              <div className="text-xs font-medium text-center">Create</div>
                              <div className="text-xs font-medium text-center">Edit</div>
                              <div className="text-xs font-medium text-center">Delete</div>
                              <div className="text-xs font-medium text-center">More</div>

                              {/* Row */}
                              <div className="py-2 text-sm">{mod.moduleName}</div>

                              <div className="flex justify-center">
                                {viewPerm ? (
                                  <Checkbox
                                    id={`perm-${viewPerm.id}`}
                                    checked={selectedPermissions.includes(viewPerm.name)}
                                    onCheckedChange={() => handlePermissionToggle(viewPerm.name)}
                                    disabled={isDisabled}
                                  />
                                ) : (
                                  <div className="text-xs text-gray-400">-</div>
                                )}
                              </div>

                              <div className="flex justify-center">
                                {createPerm ? (
                                  <Checkbox
                                    id={`perm-${createPerm.id}`}
                                    checked={selectedPermissions.includes(createPerm.name)}
                                    onCheckedChange={() => handlePermissionToggle(createPerm.name)}
                                    disabled={isDisabled}
                                  />
                                ) : (
                                  <div className="text-xs text-gray-400">-</div>
                                )}
                              </div>

                              <div className="flex justify-center">
                                {editPerm ? (
                                  <Checkbox
                                    id={`perm-${editPerm.id}`}
                                    checked={selectedPermissions.includes(editPerm.name)}
                                    onCheckedChange={() => handlePermissionToggle(editPerm.name)}
                                    disabled={isDisabled}
                                  />
                                ) : (
                                  <div className="text-xs text-gray-400">-</div>
                                )}
                              </div>

                              <div className="flex justify-center">
                                {deletePerm ? (
                                  <Checkbox
                                    id={`perm-${deletePerm.id}`}
                                    checked={selectedPermissions.includes(deletePerm.name)}
                                    onCheckedChange={() => handlePermissionToggle(deletePerm.name)}
                                    disabled={isDisabled}
                                  />
                                ) : (
                                  <div className="text-xs text-gray-400">-</div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 justify-center">
                                {morePerms.length ? (
                                  morePerms.map((p) => (
                                    <div key={p.id} className="flex items-center gap-2">
                                      <Checkbox
                                        id={`perm-${p.id}`}
                                        checked={selectedPermissions.includes(p.name)}
                                        onCheckedChange={() => handlePermissionToggle(p.name)}
                                        disabled={isDisabled}
                                      />
                                      <span className="text-xs">{p.name.split('.').slice(1).join('.') || p.name}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-gray-400">—</div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Hidden form values to sync roles/permissions with react-hook-form */}
            <input type="hidden" {...form.register('roles')} value={selectedRoles.join(',')} />
            <input type="hidden" {...form.register('permissions')} value={selectedPermissions.join(',')} />
          </form>
        </Form>

        {!isView && (
          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} form="user-form">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
