'use client';

import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useUserStore } from '../store/user-store';
import { useDeleteUser } from '../services/users.services';
import { DeleteModal } from '@/components/shared/common-delete-modal';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/useTranslation';

export function UserDeleteModal() {
  const { t } = useTranslation();
  const { open, setOpen, currentRow } = useUserStore();
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const currentUser = useAuthStore((state) => state.userInfo);

  const handleDelete = () => {
    if (!currentRow?.id) return;

    // Extra safety check - prevent deleting current user
    if (currentUser?.id === currentRow.id) {
      toast.error(t('cannot_delete_own_account'));
      setOpen(null);
      return;
    }

    deleteUser(String(currentRow.id), {
      onSuccess: () => {
        toast.success(t('user_deleted_successfully'));
        setOpen(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || t('failed_to_delete_user'));
      },
    });
  };

  return (
    <DeleteModal
      isOpen={open === 'delete'}
      onClose={(state) => !state && setOpen(null)}
      onConfirm={handleDelete}
      loading={isPending}
      title={t('delete_user')}
      description={t('delete_user_confirmation', { name: currentRow?.name || t('user') })}
      confirmButtonText={t('delete')}
      iconComponent={<Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />}
      confirmButtonColor="destructive"
    />
  );
}