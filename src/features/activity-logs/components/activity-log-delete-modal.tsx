'use client';

import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useActivityLogStore } from '../store/activity-log-store';
import { useDeleteActivityLog } from '../services/activity-logs.services';
import { DeleteModal } from '@/components/shared/common-delete-modal';

export function ActivityLogDeleteModal() {
  const { open, setOpen, currentRow } = useActivityLogStore();
  const { mutate: deleteLog, isPending } = useDeleteActivityLog();

  const handleDelete = () => {
    if (!currentRow?.id) return;

    deleteLog(String(currentRow.id), {
      onSuccess: () => {
        toast.success('Activity log deleted successfully!');
        setOpen(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to delete activity log');
      },
    });
  };

  return (
    <DeleteModal
      isOpen={open === 'delete'}
      onClose={(state) => !state && setOpen(null)}
      onConfirm={handleDelete}
      loading={isPending}
      title="Delete Activity Log"
      description={`Are you sure you want to delete this activity log? This action cannot be undone.`}
      confirmButtonText="Delete"
      iconComponent={<Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />}
      confirmButtonColor="destructive"
    />
  );
}
