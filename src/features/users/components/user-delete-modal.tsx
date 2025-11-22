'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '../store/user-store';
import { useDeleteUser } from '../services/users.services';

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
    <AlertDialog open={open === 'delete'} onOpenChange={(state) => !state && setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            <span className="font-semibold"> {currentRow?.name}</span> and remove their data from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
