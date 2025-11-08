
"use client";

import { TextInputField } from "@/components/shared/custom-input-field";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { createUserSchema, TUserSchema } from "../schema/user-schema";
import { useGetRole } from "@/features/roles/services/role.hook";


interface Props {
  currentRow?: any; // Assuming User type is defined elsewhere
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  onSubmit: (values: TUserSchema) => void;
  isViewMode?: boolean;
}

export function UserActionForm({
  currentRow,
  open,
  onOpenChange,
  onSubmit: onSubmitValues,
  loading,
  isViewMode = false,
}: Readonly<Props>) {
  const isEdit = !!currentRow && !isViewMode;

  const { data: rolesData, isLoading: isRolesLoading } :any= useGetRole();


  // Create a memoized schema that depends on rolesData
  const userSchema = useMemo(() => createUserSchema(rolesData as any ), [rolesData]);

  const form = useForm<TUserSchema>({
    resolver: zodResolver(userSchema as any),
    defaultValues: {
      name: "", email: "", phone_number: "", password: "",
      role_id: undefined, barge_id: undefined, crane_id: undefined,
    },
  });

  // Watch the 'role_id' field to conditionally render other fields
  const selectedRoleId = form.watch("role_id");
  const selectedRole = rolesData?.find((role:any) => role.id === selectedRoleId);

  useEffect(() => {
    if (open) {
      if ((isEdit || isViewMode) && currentRow) {
        form.reset({
          name: currentRow.name || "",
          email: currentRow.email || "",
          phone_number: currentRow.phone_number || "",
          password: "",
          role_id: currentRow.role?.id,
        });
      } else {
        form.reset();
      }
    }
  }, [open, currentRow, isEdit, isViewMode, form]);

  const onSubmit: SubmitHandler<TUserSchema> = (values) => {
    if (!isViewMode) {
      if (isEdit && (!values.password || values.password === '')) {
        delete values.password;
      }
      
      const selectedRole = rolesData?.find((role:any) => role.id === values.role_id);
      
      // Handle barge_operator role: only include barge_id, remove crane_id
      if(selectedRole?.role === 'barge_operator') {
        values.barge_id = values.barge_id || undefined;
        delete values.crane_id; // Remove crane_id from payload
      }
      // Handle crane_operator role: only include crane_id, remove barge_id
      else if(selectedRole?.role === 'crane_operator') {
        values.crane_id = values.crane_id || undefined;
        delete values.barge_id; // Remove barge_id from payload
      }
      // For other roles, remove both barge_id and crane_id
      else {
        delete values.barge_id;
        delete values.crane_id;
      }
      
      onSubmitValues(values);
    }
  };

  const isDisabled = isViewMode || loading;
  const dialogTitle = isViewMode ? "User Details" : isEdit ? "Edit User" : "Add New User";

  return (
    <Dialog open={open} modal onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left"><DialogTitle>{dialogTitle}</DialogTitle></DialogHeader>

        <div className="py-4">
          <Form {...form}>
            <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* --- User Information Section --- */}
              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-sm font-medium text-gray-600">User Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInputField label="Full Name" placeholder="Enter full name" control={form.control} name="name" disabled={isDisabled} />
                  <TextInputField type="email" label="Email Address" placeholder="Enter email address" control={form.control} name="email" disabled={isDisabled} />
                </div>
              </div>

              {/* --- Credentials & Contact Section --- */}
              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-sm font-medium text-gray-600">Credentials & Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInputField type="tel" label="Phone Number" placeholder="Enter phone number" control={form.control} name="phone_number" disabled={isDisabled} />
                  {/* Hide password in view mode */}
                  {!isViewMode && (
                     <TextInputField type="password" label="Password" placeholder={isEdit ? "Leave blank to keep current" : "Enter a strong password"} control={form.control} name="password" disabled={isDisabled} />
                  )}
                </div>
              </div>

              {/* --- Role & Assignments Section --- */}
              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-sm font-medium text-gray-600">Role & Assignments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="role_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value || '')} disabled={isDisabled || isRolesLoading}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {rolesData?.map((role:any) => (
                            <SelectItem key={role?.id} value={String(role?.id)}>{role?.role?.replace(/_/g, ' ')?.replace(/\b\w/g, (c:any) => c.toUpperCase())}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  

                </div>
              </div>
            </form>
          </Form>
        </div>

        {!isViewMode && (
          <DialogFooter>
            <Button type="button" variant="outline" disabled={loading} onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} form="user-form">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}