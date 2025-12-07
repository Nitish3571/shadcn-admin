'use client';

import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { DeleteModal } from '@/components/shared/common-delete-modal';
import { useRoleStore } from '../store/role-store';
import { useDeleteRole } from '../services/roles.services';
import { useTranslation } from '@/hooks/useTranslation';

export function RoleDeleteModal() {
  const { t } = useTranslation();
  const { open, setOpen, currentRow } = useRoleStore();
  const { mutate: deleteRole, isPending } = useDeleteRole();

  const handleDelete = () => {
    if (!currentRow?.id) return;

    deleteRole(String(currentRow.id), {
      onSuccess: () => {
        toast.success(t('role_deleted_successfully'));
        setOpen(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || t('failed_to_delete_role'));
      },
    });
  };

  return (
    <DeleteModal
      isOpen={open === 'delete'}
      onClose={(state) => !state && setOpen(null)}
      onConfirm={handleDelete}
      loading={isPending}
      title={t('delete_role')}
      description={t('delete_role_confirmation', { name: currentRow?.name || t('role') })}
      confirmButtonText={t('delete')}
      iconComponent={<Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />}
      confirmButtonColor="destructive"
    />
  );
}