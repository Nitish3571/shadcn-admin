'use client';

import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useUserStore } from '../store/user-store';
import { useDeleteUser } from '../services/users.services';
import { DeleteModal } from '@/components/shared/common-delete-modal';

export function UserDeleteModal() {
  const { open, setOpen, currentRow } = useUserStore();
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const handleDelete = () => {
    if (!currentRow?.id) return;

    deleteUser(currentRow.id, {
      onSuccess: () => {
        toast.success('User deleted successfully!');
        setOpen(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to delete user');
      },
    });
  };

  return (
    <DeleteModal
      isOpen={open === 'delete'}
      onClose={(state) => !state && setOpen(null)}
      onConfirm={handleDelete}
      loading={isPending}
      title="Delete User"
      description={`Are you sure you want to delete ${currentRow?.name || 'this user'}? This action cannot be undone and will permanently remove their data from the system.`}
      confirmButtonText="Delete"
      iconComponent={<Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />}
      confirmButtonColor="destructive"
    />
  );
}