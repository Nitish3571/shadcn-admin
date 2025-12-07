'use client';

import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { DeleteModal } from '@/components/shared/common-delete-modal';
import { useRoleStore } from '../store/role-store';
import { useDeleteRole } from '../services/roles.services';

export function RoleDeleteModal() {
  const { open, setOpen, currentRow } = useRoleStore();
  const { mutate: deleteRole, isPending } = useDeleteRole();

  const handleDelete = () => {
    if (!currentRow?.id) return;

    deleteRole(String(currentRow.id), {
      onSuccess: () => {
        toast.success('Role deleted successfully!');
        setOpen(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to delete role');
      },
    });
  };

  return (
    <DeleteModal
      isOpen={open === 'delete'}
      onClose={(state) => !state && setOpen(null)}
      onConfirm={handleDelete}
      loading={isPending}
      title="Delete Role"
      description={`Are you sure you want to delete ${currentRow?.name || 'this role'}? This action cannot be undone and will permanently remove the role from the system.`}
      confirmButtonText="Delete"
      iconComponent={<Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />}
      confirmButtonColor="destructive"
    />
  );
}