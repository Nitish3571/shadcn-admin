
'use client'

import { z } from 'zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Ban, Loader2 } from 'lucide-react'

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

import { useUsers } from '../context/users-context'
import { usePostRole, useGetRolesById, useGetAllModulePermissions } from '../services/role.hook'

interface Permission {
  id: number | string
  slug?: string
}

interface ModulePermissions {
  name: string
  slug: string
  permissions: Permission[]
}

interface ApiModuleResponse {
  modulePermissions: ModulePermissions[]
}


const formSchema = z
  .object({
    name: z.string().min(1, { message: 'Role Name is required.' }),
    isEdit: z.boolean(),
    permissions: z.array(z.string()).optional(), 
  })

type RoleForm = z.infer<typeof formSchema>


const getActionSlug = (p: Permission) => 
  p.slug 
      ? p.slug.split(':').pop() 
      : p.name.split('_').slice(1).join('_');


const getPermissionTypes = (modules: ModulePermissions[]): string[] => {
    const allPermissions = modules.flatMap((m) => m.permissions)
    const types = new Set<string>()

    allPermissions.forEach((p) => {
        const actionSlug = getActionSlug(p);
        if (actionSlug) {
            types.add(actionSlug)
        }
    })

    const order = ['view', 'create', 'edit', 'delete', 'export', 'import']
    return Array.from(types).sort((a, b) => {
        const indexA = order.indexOf(a)
        const indexB = order.indexOf(b)

        if (indexA === -1 && indexB === -1) return a.localeCompare(b)
        if (indexA === -1) return 1
        if (indexB === -1) return -1
        return indexA - indexB
    })
}

export function UsersActionDialog() {
  const { open, setOpen, currentRow } = useUsers()
  const isEdit = open === 'edit'

  const roleId = currentRow?.id
  const { data: roleData, isLoading } = useGetRolesById(roleId!, { enabled: !!roleId && isEdit }) 
  const { data: modulePermissionsRaw } = useGetAllModulePermissions() as { data: ApiModuleResponse | undefined }

  const modules: ModulePermissions[] = modulePermissionsRaw?.modulePermissions || []
  const permissionTypes = getPermissionTypes(modules)
  const allAvailablePermissions = modules.flatMap(m => m.permissions);

  const form = useForm<RoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      isEdit,
      permissions: [],
    },
  })

  const { mutate: createRole, isPending: creating } = usePostRole()

  useEffect(() => {
    if (roleData && isEdit) {
      const res = roleData?.data
      
      // Map by permission NAME
      const initialPermissions = res.permissions?.map((p: any) => p.name) || [] 

      form.reset({
        name: res.name || '',
        isEdit: true, 
        permissions: initialPermissions, 
      })
    } else if (open === 'add') {
      form.reset({
        name: '',
        isEdit: false, 
        permissions: [],
      });
    }
  }, [roleData, isEdit, form, open])


  const toggleAllPermissions = (isChecked: boolean) => {
    const allNames = allAvailablePermissions.map(p => p.name);
    
    const updatedPermissions = isChecked ? [] : allNames; 

    form.setValue('permissions', updatedPermissions, { shouldValidate: true, shouldDirty: true });
  }

  const togglePermission = (permission: Permission, moduleSlug: string) => {
    const permissionName = permission.name; 
    const currentPermissions = form.getValues('permissions') || [];
    const isCurrentlyChecked = currentPermissions.includes(permissionName); 
    let updatedPermissions = [...currentPermissions];
    const actionSlug = getActionSlug(permission);
    const module = modules.find(m => m.slug === moduleSlug);
    
    if (!module) return; 

    if (isCurrentlyChecked) {
      updatedPermissions = updatedPermissions.filter(name => name !== permissionName);

      if (actionSlug === 'view') {
        const dependentPermissionNames = module.permissions
          .filter(p => getActionSlug(p) !== 'view')
          .map(p => p.name); 
        
        updatedPermissions = updatedPermissions.filter(name => !dependentPermissionNames.includes(name));
      }

    } else {
      updatedPermissions.push(permissionName);

      if (actionSlug !== 'view') {
        const viewPermission = module.permissions.find(p => getActionSlug(p) === 'view');
        
        if (viewPermission && !updatedPermissions.includes(viewPermission.name)) {
          updatedPermissions.push(viewPermission.name);
        }
      }
    }
      
    form.setValue('permissions', updatedPermissions, { shouldValidate: true, shouldDirty: true });
  }

  const toggleModulePermissions = (module: ModulePermissions, isModuleChecked: boolean) => {
    let currentPermissions = form.getValues('permissions') || []
    const modulePermissionNames = module.permissions.map((p) => p.name)

    if (isModuleChecked) {
      currentPermissions = currentPermissions.filter(name => !modulePermissionNames.includes(name))
    } else {
      const newPermissions = modulePermissionNames.filter((name) => !currentPermissions.includes(name))
      currentPermissions = [...currentPermissions, ...newPermissions]
    }

    form.setValue('permissions', currentPermissions, { shouldValidate: true, shouldDirty: true })
  }

  const togglePermissionType = (typeSlug: string, isTypeChecked: boolean) => {
    const allPermissions = modules.flatMap((m) => m.permissions)
    let currentPermissions = form.getValues('permissions') || []
    
    const typePermissionNames = allPermissions
        .filter((p) => getActionSlug(p) === typeSlug)
        .map((p) => p.name);


    if (isTypeChecked) {
      currentPermissions = currentPermissions.filter(name => !typePermissionNames.includes(name))

      if (typeSlug === 'view') {
          const dependentPermissionNames = allPermissions
            .filter(p => getActionSlug(p) !== 'view')
            .map(p => p.name); 
          
          currentPermissions = currentPermissions.filter(name => !dependentPermissionNames.includes(name));
      }

    } else {
      const newPermissions = typePermissionNames.filter((name) => !currentPermissions.includes(name))
      currentPermissions = [...currentPermissions, ...newPermissions]
      
      if (typeSlug !== 'view') {
          const viewPermissionNames = allPermissions
            .filter((p) => getActionSlug(p) === 'view')
            .map((p) => p.name); 

          const newViewPermissions = viewPermissionNames.filter((name) => !currentPermissions.includes(name));
          currentPermissions = [...currentPermissions, ...newViewPermissions];
      }
    }
    
    form.setValue('permissions', currentPermissions, { shouldValidate: true, shouldDirty: true })
  }

  const onSubmit = () => {
    const values = form.getValues();

    const roleId = currentRow?.id ?? null;
    
    const payload = {
      id: roleId,
      name: values.name,
      permissions: values.permissions, 
      isEdit: values.isEdit, 
    }

    createRole(
      payload,
      {
        onSuccess: () => {
          toast.success(isEdit ? 'Role updated successfully! ✅' : 'Role created successfully! 🎉')
          setOpen(null) 
          form.reset() 
        },
        onError: (error: any) =>
          toast.error(error?.response?.data?.message || (isEdit ? 'Failed to update role' : 'Failed to create role')),
      }
    )
  }

  const currentPermissions = form.watch('permissions') || [];
  const allAvailableNames = allAvailablePermissions.map(p => p.name);

  const isAllChecked = allAvailableNames.length > 0 && 
                       allAvailableNames.every(name => currentPermissions.includes(name));

  if (isEdit && isLoading) {
    return (
      <Dialog open={true} onOpenChange={() => setOpen(null)}>
        <DialogContent className="sm:max-w-lg flex justify-center items-center h-40">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading role data...
        </DialogContent>
      </Dialog>
    )
  }
  
  // 🔹 Component Render
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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? 'Edit Role' : 'Add New Role'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the role details and permissions below.'
              : 'Fill in the details to create a new role and assign permissions.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
          <Form {...form}>
            <form
              id="role-form"
              // Pass the onSubmit handler to React Hook Form
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6 p-0.5"
            >
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Details</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-right">Role Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Administrator"
                          className="col-span-4"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Permissions Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Permissions</h3>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm table-fixed">
                    <thead className="bg-muted/50">
                      <tr>
                        {/* 💡 GLOBAL SELECT ALL CHECKBOX */}
                        <th className="p-2 text-center font-medium w-[40px]">
                            <input
                                type="checkbox"
                                checked={isAllChecked}
                                onChange={() => toggleAllPermissions(isAllChecked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        </th>
                        {/* Module Header */}
                        <th className="p-2 text-left font-medium w-[160px]">Module</th>
                        {/* Global Type Checkboxes (e.g., All View, All Create) */}
                        {permissionTypes.map(type => {
                            const allNamesOfType = modules
                                .flatMap((m) => m.permissions)
                                .filter((p) => getActionSlug(p) === type)
                                .map((p) => p.name); 
                            
                            const isTypeChecked = allNamesOfType.length > 0 && 
                                allNamesOfType.every((name) => currentPermissions.includes(name))

                            return (
                                <th key={type} className="p-2 text-center font-medium w-[80px] capitalize">
                                    <div className="flex items-center justify-center gap-1">
                                        {type}
                                        <input
                                            type="checkbox"
                                            checked={isTypeChecked}
                                            onChange={() => togglePermissionType(type, isTypeChecked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </div>
                                </th>
                            )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((module) => {
                          const modulePermissionNames = module.permissions.map((p) => p.name) 

                          const isModuleChecked = modulePermissionNames.length > 0 && 
                              modulePermissionNames.every((name) => currentPermissions.includes(name))

                          return (
                              <tr key={module.slug} className="border-t hover:bg-muted/20">
                                  {/* Empty TD for the global select all column */}
                                  <td className="p-2"></td>
                                  
                                  {/* Module Name (Toggle all permissions for this module) */}
                                  <td className="p-2 font-semibold">
                                      <div className="flex items-center gap-2">
                                          <input
                                              type="checkbox"
                                              checked={isModuleChecked}
                                              onChange={() => toggleModulePermissions(module, isModuleChecked)}
                                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                          />
                                          {module.name}
                                      </div>
                                  </td>
                                  {/* Individual Permission Checkboxes */}
                                  {permissionTypes.map(type => {
                                      const permission = module.permissions.find((p) => getActionSlug(p) === type)
                                      
                                      const isChecked = permission && currentPermissions.includes(permission.name)

                                      return (
                                          <td key={`${module.slug}-${type}`} className="p-2 text-center">
                                              {permission ? (
                                                  <input
                                                      type="checkbox"
                                                      checked={isChecked}
                                                      onChange={() => togglePermission(permission, module.slug)}
                                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                  />
                                              ) : (
                                                  <span className="text-gray-400">
                                                      <Ban className="h-4 w-4 mx-auto" />
                                                  </span>
                                              )}
                                          </td>
                                      )
                                  })}
                              </tr>
                          )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="submit" form="role-form" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEdit ? 'Update Role' : 'Create Role'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}